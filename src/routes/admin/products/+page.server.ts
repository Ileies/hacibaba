import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { productsTable } from '$lib/server/schema';
export const load: PageServerLoad = () => {
	const products = db.select().from(productsTable).orderBy(productsTable.sortOrder).all();
	return { products };
};
