import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { productsTable } from '$lib/server/schema';
import { eq, and, like, or, gte, lte, asc, desc, type SQL, sql } from 'drizzle-orm';
import { withLocalizedName } from '$lib/server/queries';
import { PRODUCT_TAGS } from '$lib/types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const searchQuery = url.searchParams.get('q')?.trim() || null;
	const sortParam = url.searchParams.get('sort') || '';
	const minPriceParam = url.searchParams.get('minPrice') || '';
	const maxPriceParam = url.searchParams.get('maxPrice') || '';
	const tagsParam = url.searchParams.get('tags') || '';
	const locale = locals.locale;

	const filters: SQL[] = [eq(productsTable.isActive, true)];

	if (searchQuery) {
		filters.push(
			or(
				like(productsTable.name_tr, `%${searchQuery}%`),
				like(productsTable.name_de, `%${searchQuery}%`),
				like(productsTable.name_en, `%${searchQuery}%`),
				like(productsTable.description, `%${searchQuery}%`)
			) as SQL
		);
	}

	if (minPriceParam) {
		const minCents = Math.round(parseFloat(minPriceParam) * 100);
		if (!isNaN(minCents)) filters.push(gte(productsTable.price, minCents));
	}

	if (maxPriceParam) {
		const maxCents = Math.round(parseFloat(maxPriceParam) * 100);
		if (!isNaN(maxCents)) filters.push(lte(productsTable.price, maxCents));
	}

	if (tagsParam) {
		const requestedTags = tagsParam.split(',').filter(Boolean);
		for (const tagKey of requestedTags) {
			const tag = PRODUCT_TAGS.find((t) => t.key === tagKey);
			if (tag) {
				filters.push(sql`(${productsTable.tags} & ${tag.bit}) != 0`);
			}
		}
	}

	const query = db
		.select()
		.from(productsTable)
		.where(and(...filters));

	const products = query
		.orderBy(
			sortParam === 'price_asc'
				? asc(productsTable.price)
				: sortParam === 'price_desc'
					? desc(productsTable.price)
					: sortParam === 'name'
						? asc(productsTable.name_de)
						: asc(productsTable.sortOrder)
		)
		.all()
		.map((p) => withLocalizedName(p, locale));

	return { products, searchQuery };
};
