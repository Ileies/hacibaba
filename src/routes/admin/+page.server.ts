import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { ordersTable } from '$lib/server/schema';
import { desc, eq, sum, count } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const recentOrders = db
		.select()
		.from(ordersTable)
		.orderBy(desc(ordersTable.createdAt))
		.limit(10)
		.all();

	const [totals] = db
		.select({
			totalOrders: count(),
			totalRevenue: sum(ordersTable.total)
		})
		.from(ordersTable)
		.all();

	const [pending] = db
		.select({ pendingOrders: count() })
		.from(ordersTable)
		.where(eq(ordersTable.status, 'pending'))
		.all();

	return {
		recentOrders,
		stats: {
			totalOrders: totals.totalOrders ?? 0,
			totalRevenue: Number(totals.totalRevenue ?? 0),
			pendingOrders: pending.pendingOrders ?? 0
		}
	};
};
