import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import db from '$lib/server/db';
import { ordersTable, orderItemsTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { sendOrderConfirmation } from '$lib/server/email';

export const POST: RequestHandler = async ({ request }) => {
	const sig = request.headers.get('stripe-signature');
	if (!sig) error(400, 'Missing stripe-signature header');

	const rawBody = await request.text();
	const stripe = new Stripe(env.STRIPE_SECRET_KEY!);

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET!);
	} catch {
		error(400, 'Invalid webhook signature');
	}

	const now = new Date().toISOString();

	if (
		event.type === 'checkout.session.completed' ||
		event.type === 'checkout.session.async_payment_succeeded'
	) {
		const session = event.data.object as Stripe.Checkout.Session;
		if (session.payment_status === 'paid') {
			const order = db
				.update(ordersTable)
				.set({
					paymentStatus: 'paid',
					status: 'confirmed',
					paymentMethod: session.payment_method_types?.[0] ?? 'card',
					updatedAt: now
				})
				.where(eq(ordersTable.stripeSessionId, session.id))
				.returning()
				.get();

			if (order) {
				const items = db
					.select()
					.from(orderItemsTable)
					.where(eq(orderItemsTable.orderId, order.id))
					.all();
				sendOrderConfirmation(order, items).catch(console.error);
			}
		}
	} else if (event.type === 'checkout.session.async_payment_failed') {
		const session = event.data.object as Stripe.Checkout.Session;
		db.update(ordersTable)
			.set({ paymentStatus: 'failed', updatedAt: now })
			.where(eq(ordersTable.stripeSessionId, session.id))
			.run();
	}

	return json({ received: true });
};
