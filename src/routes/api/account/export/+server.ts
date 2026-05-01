import type { RequestHandler } from './$types';
import { requireCustomer } from '$lib/server/auth';
import db from '$lib/server/db';
import {
	customersTable,
	ordersTable,
	orderItemsTable,
	newsletterSubscribersTable
} from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = (event) => {
	requireCustomer(event);
	const customerId = event.locals.customerId!;

	const customer = db
		.select({
			id: customersTable.id,
			name: customersTable.name,
			email: customersTable.email,
			createdAt: customersTable.createdAt
		})
		.from(customersTable)
		.where(eq(customersTable.id, customerId))
		.get();

	const orders = db
		.select()
		.from(ordersTable)
		.where(eq(ordersTable.customerId, customerId))
		.all()
		.map((order) => {
			const items = db
				.select()
				.from(orderItemsTable)
				.where(eq(orderItemsTable.orderId, order.id))
				.all();
			return { ...order, items };
		});

	const newsletter =
		db
			.select({
				email: newsletterSubscribersTable.email,
				confirmed: newsletterSubscribersTable.confirmed,
				createdAt: newsletterSubscribersTable.createdAt
			})
			.from(newsletterSubscribersTable)
			.where(eq(newsletterSubscribersTable.email, customer?.email ?? ''))
			.get() ?? null;

	const exportData = {
		exportedAt: new Date().toISOString(),
		customer,
		orders,
		newsletterSubscription: newsletter
	};

	return new Response(JSON.stringify(exportData, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': 'attachment; filename="meine-daten.json"'
		}
	});
};
