import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { ordersTable } from '$lib/server/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = () => {
	const orders = db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).all();
	return { orders };
};
