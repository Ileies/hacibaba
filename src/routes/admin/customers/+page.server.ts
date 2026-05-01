import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { customersTable, ordersTable } from '$lib/server/schema';
import { eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = () => {
	const customers = db
		.select({
			id: customersTable.id,
			email: customersTable.email,
			name: customersTable.name,
			isBlocked: customersTable.isBlocked,
			createdAt: customersTable.createdAt,
			orderCount: sql<number>`count(distinct ${ordersTable.id})`.as('order_count'),
			totalRevenue: sql<number>`coalesce(sum(${ordersTable.total}), 0)`.as('total_revenue')
		})
		.from(customersTable)
		.leftJoin(ordersTable, eq(ordersTable.customerId, customersTable.id))
		.groupBy(customersTable.id)
		.orderBy(customersTable.createdAt)
		.all();

	return { customers };
};

export const actions: Actions = {
	toggleBlock: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(String(data.get('customerId') ?? ''));
		if (isNaN(id)) return fail(400);

		const customer = db.select().from(customersTable).where(eq(customersTable.id, id)).get();
		if (!customer) return fail(404);

		db.update(customersTable)
			.set({ isBlocked: !customer.isBlocked })
			.where(eq(customersTable.id, id))
			.run();

		return { toggled: true, nowBlocked: !customer.isBlocked };
	}
};
