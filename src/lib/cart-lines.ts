export type PersistedCartLine = { productId: number; quantity: number };

export function mergeLinesByProductId(lines: PersistedCartLine[]): PersistedCartLine[] {
	const order: number[] = [];
	const qty = new Map<number, number>();
	for (const { productId, quantity } of lines) {
		if (!qty.has(productId)) order.push(productId);
		qty.set(productId, Math.min(9999, (qty.get(productId) ?? 0) + quantity));
	}
	return order.map((productId) => ({ productId, quantity: qty.get(productId)! }));
}

/** Accepts slim `[{productId,quantity}]` or legacy full cart rows; returns merged lines or null. */
export function parsePersistedLines(parsed: unknown): PersistedCartLine[] | null {
	if (!Array.isArray(parsed) || parsed.length === 0) return null;
	const lines: PersistedCartLine[] = [];
	for (const raw of parsed) {
		if (!raw || typeof raw !== 'object') continue;
		const o = raw as Record<string, unknown>;
		if (typeof o.productId !== 'number' || typeof o.quantity !== 'number') continue;
		if (o.productId < 1 || o.quantity < 1) continue;
		lines.push({
			productId: Math.floor(o.productId),
			quantity: Math.min(9999, Math.floor(o.quantity))
		});
	}
	if (lines.length === 0) return null;
	return mergeLinesByProductId(lines);
}

export function fingerprint(lines: PersistedCartLine[]): string {
	return [...lines]
		.sort((a, b) => a.productId - b.productId)
		.map((l) => `${l.productId}:${l.quantity}`)
		.join(',');
}
