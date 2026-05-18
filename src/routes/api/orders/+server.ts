import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import db from '$lib/server/db';
import { ordersTable, orderItemsTable } from '$lib/server/schema';
import { generateOrderNumber } from '$lib/types';
import type { ShippingAddress } from '$lib/types';
import { sendAdminNewOrderNotification } from '$lib/server/email';
import { orderSchema } from '$lib/server/validation';

export const POST: RequestHandler = async ({ request }) => {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		error(400, 'Invalid JSON');
	}

	const result = orderSchema.safeParse(raw);
	if (!result.success) error(400, 'Invalid request');

	const { customer, items, shippingCost, giftMessage } = result.data;

	const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const total = subtotal + shippingCost;
	const orderNumber = generateOrderNumber();

	const stripe = new Stripe(env.STRIPE_SECRET_KEY!);

	const lineItems = items.map((item) => ({
		price_data: {
			currency: 'eur',
			product_data: { name: item.name },
			unit_amount: item.price
		},
		quantity: item.quantity
	}));

	if (shippingCost > 0) {
		lineItems.push({
			price_data: {
				currency: 'eur',
				product_data: { name: 'Versand' },
				unit_amount: shippingCost
			},
			quantity: 1
		});
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		ui_mode: 'elements',
		line_items: lineItems,
		customer_email: customer.email,
		metadata: { orderNumber },
		return_url: `${publicEnv.PUBLIC_SITE_URL}/checkout/confirmation?order=${orderNumber}`
	});

	const shippingAddress: ShippingAddress = {
		firstName: customer.firstName,
		lastName: customer.lastName,
		street: customer.street,
		city: customer.city,
		zip: customer.zip,
		state: customer.state,
		country: customer.country ?? 'DE'
	};

	const [order] = db
		.insert(ordersTable)
		.values({
			orderNumber,
			customerName: `${customer.firstName} ${customer.lastName}`,
			customerEmail: customer.email,
			customerPhone: customer.phone ?? null,
			shippingAddress: JSON.stringify(shippingAddress),
			notes: customer.notes ?? null,
			giftMessage: giftMessage ?? null,
			shippingCost,
			subtotal,
			total,
			stripeSessionId: session.id
		})
		.returning({ id: ordersTable.id })
		.all();

	const orderItemValues = items.map((item) => ({
		orderId: order.id,
		productId: item.productId,
		productName: item.name,
		unitPrice: item.price,
		quantity: item.quantity,
		totalPrice: item.price * item.quantity
	}));

	db.insert(orderItemsTable).values(orderItemValues).run();

	sendAdminNewOrderNotification(
		{
			orderNumber,
			customerName: `${customer.firstName} ${customer.lastName}`,
			customerEmail: customer.email,
			subtotal,
			shippingCost,
			total
		},
		orderItemValues.map((i) => ({
			productName: i.productName,
			quantity: i.quantity,
			totalPrice: i.totalPrice
		}))
	).catch(console.error);

	return json({ clientSecret: session.client_secret, orderNumber });
};
