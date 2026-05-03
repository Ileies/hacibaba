import type { CartItem } from '$lib/types';
import { type PersistedCartLine, parsePersistedLines, fingerprint } from '$lib/cart-lines';

function readLinesFromLocalStorage(): PersistedCartLine[] | null {
	if (typeof window === 'undefined') return null;
	const saved = localStorage.getItem('cart');
	if (!saved) return null;
	try {
		return parsePersistedLines(JSON.parse(saved));
	} catch {
		return null;
	}
}

// --- Toast store ---

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

class ToastStore {
	items = $state<Toast[]>([]);
	private nextId = 0;

	add(message: string, type: ToastType = 'success', duration = 3500): void {
		const id = this.nextId++;
		this.items.push({ id, message, type });
		setTimeout(() => this.remove(id), duration);
	}

	remove(id: number): void {
		const idx = this.items.findIndex((t) => t.id === id);
		if (idx !== -1) this.items.splice(idx, 1);
	}
}

export const toasts = new ToastStore();

class CartStore {
	items = $state<CartItem[]>([]);
	/** Distinct product lines in LS while a hydrate request is in flight (badge). */
	private optimisticLineCount = $state<number | null>(null);
	private hydratePromise: Promise<void> | null = null;

	get total(): number {
		return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	get count(): number {
		if (this.items.length > 0) return this.items.length;
		if (this.optimisticLineCount !== null) return this.optimisticLineCount;
		return 0;
	}

	/**
	 * Reads minimal cart lines from localStorage and hydrates items from the server (DB names and prices).
	 * Safe to call multiple times; concurrent calls share one in-flight request.
	 */
	load(): Promise<void> {
		if (typeof window === 'undefined') return Promise.resolve();
		if (this.hydratePromise) return this.hydratePromise;
		this.hydratePromise = this.hydrateFromStorage().finally(() => {
			this.hydratePromise = null;
		});
		return this.hydratePromise;
	}

	private async hydrateFromStorage(): Promise<void> {
		for (let depth = 0; depth < 10; depth++) {
			const lines = readLinesFromLocalStorage();
			if (!lines?.length) {
				this.items = [];
				this.optimisticLineCount = null;
				localStorage.removeItem('cart');
				return;
			}

			const fpStart = fingerprint(lines);
			this.optimisticLineCount = lines.length;

			let data: { items: CartItem[] };
			try {
				const res = await fetch('/api/cart/hydrate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ items: lines })
				});
				if (!res.ok) throw new Error('hydrate_failed');
				data = (await res.json()) as { items: CartItem[] };
			} catch {
				this.optimisticLineCount = null;
				return;
			}

			const linesAfter = readLinesFromLocalStorage();
			const fpAfter = linesAfter && linesAfter.length > 0 ? fingerprint(linesAfter) : '';
			if (fpAfter !== fpStart) {
				continue;
			}

			this.items = data.items;
			this.optimisticLineCount = null;
			this.persist();
			return;
		}
	}

	add(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
		const existing = this.items.find((i) => i.productId === item.productId);
		if (existing) {
			existing.quantity += item.quantity ?? 1;
		} else {
			this.items.push({ ...item, quantity: item.quantity ?? 1 });
		}
		this.persist();
	}

	update(productId: number, quantity: number): void {
		if (quantity <= 0) {
			this.remove(productId);
			return;
		}
		const item = this.items.find((i) => i.productId === productId);
		if (item) {
			item.quantity = quantity;
			this.persist();
		}
	}

	remove(productId: number): void {
		const idx = this.items.findIndex((i) => i.productId === productId);
		if (idx !== -1) {
			this.items.splice(idx, 1);
			this.persist();
		}
	}

	clear(): void {
		this.items = [];
		this.persist();
	}

	private persist(): void {
		if (typeof window === 'undefined') return;
		const lines: PersistedCartLine[] = this.items.map(({ productId, quantity }) => ({
			productId,
			quantity
		}));
		if (lines.length === 0) {
			localStorage.removeItem('cart');
		} else {
			localStorage.setItem('cart', JSON.stringify(lines));
		}
	}
}

export const cart = new CartStore();
