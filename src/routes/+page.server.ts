import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { productsTable, testimonialsTable } from '$lib/server/schema';
import { eq, and, asc } from 'drizzle-orm';
import { parseProductImages, withLocalizedName } from '$lib/server/queries';

export const load: PageServerLoad = async ({ locals }) => {
	const locale = locals.locale;

	const featured = db
		.select()
		.from(productsTable)
		.where(and(eq(productsTable.isActive, true)))
		.orderBy(productsTable.sortOrder)
		.limit(10)
		.all()
		.map((p) => withLocalizedName(parseProductImages(p), locale));

	const testimonials = db
		.select()
		.from(testimonialsTable)
		.where(eq(testimonialsTable.isActive, true))
		.orderBy(asc(testimonialsTable.sortOrder))
		.limit(6)
		.all();

	return { featured, testimonials };
};
