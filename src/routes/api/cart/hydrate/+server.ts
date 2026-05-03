import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { productsTable } from '$lib/server/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { parseProductImages } from '$lib/server/queries';
import { cartHydrateSchema } from '$lib/server/validation';
import { mergeLinesByProductId } from '$lib/cart-lines';
import type { CartItem } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		error(400, 'Invalid JSON');
	}

	const parsed = cartHydrateSchema.safeParse(raw);
	if (!parsed.success) error(400, 'Invalid request');

	const lines = mergeLinesByProductId(parsed.data.items);
	if (lines.length === 0) return json({ items: [] as CartItem[] });

	const ids = lines.map((l) => l.productId);
	const rows = db
		.select({
			id: productsTable.id,
			name_tr: productsTable.name_tr,
			name_de: productsTable.name_de,
			name_en: productsTable.name_en,
			price: productsTable.price,
			imageUrl: productsTable.imageUrl,
			images: productsTable.images
		})
		.from(productsTable)
		.where(and(inArray(productsTable.id, ids), eq(productsTable.isActive, true)))
		.all();

	const byId = new Map(rows.map((r) => [r.id, r]));

	const out: CartItem[] = [];
	for (const line of lines) {
		const p = byId.get(line.productId);
		if (!p) continue;
		const parsedP = parseProductImages(p);
		const imageUrl = parsedP.imageUrl ?? parsedP.images?.[0] ?? null;
		out.push({
			productId: p.id,
			name_de: p.name_de,
			name_en: p.name_en,
			name_tr: p.name_tr,
			price: p.price,
			quantity: line.quantity,
			imageUrl
		});
	}

	return json({ items: out });
};
