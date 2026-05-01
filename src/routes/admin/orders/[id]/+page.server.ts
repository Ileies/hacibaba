import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { ordersTable, orderItemsTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { ShippingAddress } from '$lib/types';
import { sendShippingConfirmation, sendOrderStatusUpdate } from '$lib/server/email';

export const load: PageServerLoad = ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) error(404);

	const order = db.select().from(ordersTable).where(eq(ordersTable.id, id)).get();
	if (!order) error(404, 'Bestellung nicht gefunden');

	const items = db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id)).all();

	let shippingAddress: ShippingAddress | null = null;
	try {
		shippingAddress = JSON.parse(order.shippingAddress);
	} catch {
		/* ignore */
	}

	return { order, items, shippingAddress };
};

export const actions: Actions = {
	updateStatus: async ({ params, request }) => {
		const id = parseInt(params.id);
		const data = await request.formData();
		const status = String(data.get('status'));
		const trackingNumber = String(data.get('trackingNumber') ?? '').trim() || null;
		const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
		if (!validStatuses.includes(status)) return fail(400, { error: true });

		const order = db
			.update(ordersTable)
			.set({ status: status as never, trackingNumber, updatedAt: new Date().toISOString() })
			.where(eq(ordersTable.id, id))
			.returning()
			.get();

		if (order) {
			if (status === 'shipped') {
				sendShippingConfirmation(order).catch(console.error);
			} else if (['confirmed', 'delivered', 'cancelled'].includes(status)) {
				sendOrderStatusUpdate(order, status).catch(console.error);
			}
		}
	},

	updatePayment: async ({ params, request }) => {
		const id = parseInt(params.id);
		const data = await request.formData();
		const paymentStatus = String(data.get('paymentStatus'));
		const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
		if (!validStatuses.includes(paymentStatus)) return fail(400, { error: true });

		db.update(ordersTable)
			.set({ paymentStatus: paymentStatus as never, updatedAt: new Date().toISOString() })
			.where(eq(ordersTable.id, id))
			.run();
	},

	saveNotes: async ({ params, request }) => {
		const id = parseInt(params.id);
		if (isNaN(id)) return fail(400);
		const data = await request.formData();
		const adminNotes = String(data.get('adminNotes') ?? '').trim() || null;

		db.update(ordersTable)
			.set({ adminNotes, updatedAt: new Date().toISOString() })
			.where(eq(ordersTable.id, id))
			.run();

		return { notesSaved: true };
	}
};
