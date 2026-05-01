import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { testimonialsTable } from '$lib/server/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = () => {
	const testimonials = db
		.select()
		.from(testimonialsTable)
		.orderBy(asc(testimonialsTable.sortOrder))
		.all();
	return { testimonials };
};
