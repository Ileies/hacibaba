import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import db from '$lib/server/db';
import { productsTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { parseProductData, withLocalizedName } from '$lib/server/queries';

export const load: PageServerLoad = async ({ params, locals }) => {
	const product = db.select().from(productsTable).where(eq(productsTable.slug, params.slug)).get();

	if (!product || !product.isActive) error(404, 'Produkt nicht gefunden');

	return { product: withLocalizedName(parseProductData(product), locals.locale) };
};
