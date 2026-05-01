import type { CartItem } from '$lib/types';

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

	get total(): number {
		return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	get count(): number {
		return this.items.length;
	}

	load(): void {
		if (typeof window === 'undefined') return;
		try {
			const saved = localStorage.getItem('cart');
			if (saved) this.items = JSON.parse(saved);
		} catch {
			/* ignore corrupt data */
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
		if (typeof window !== 'undefined') {
			localStorage.setItem('cart', JSON.stringify(this.items));
		}
	}
}

export const cart = new CartStore();
