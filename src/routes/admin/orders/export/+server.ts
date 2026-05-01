import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { ordersTable, orderItemsTable } from '$lib/server/schema';
import { formatPrice } from '$lib/types';
import { desc, gte, lte, and, eq } from 'drizzle-orm';

export const GET: RequestHandler = ({ url }) => {
	const from = url.searchParams.get('from');
	const to = url.searchParams.get('to');

	const conditions = [];
	if (from) conditions.push(gte(ordersTable.createdAt, from));
	if (to) conditions.push(lte(ordersTable.createdAt, to + 'T23:59:59'));

	const orders = db
		.select()
		.from(ordersTable)
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(desc(ordersTable.createdAt))
		.all();

	const header = [
		'Bestellnummer',
		'Datum',
		'Kunde',
		'E-Mail',
		'Telefon',
		'Status',
		'Zahlungsstatus',
		'Zwischensumme',
		'Versand',
		'Gesamt',
		'Artikel'
	]
		.map(csvCell)
		.join(';');

	const dataRows = orders.map((order) => {
		const items = db
			.select()
			.from(orderItemsTable)
			.where(eq(orderItemsTable.orderId, order.id))
			.all();
		const itemText = items.map((i) => `${i.productName} x${i.quantity}`).join(', ');

		return [
			order.orderNumber,
			new Date(order.createdAt).toLocaleDateString('de-DE'),
			order.customerName,
			order.customerEmail,
			order.customerPhone ?? '',
			order.status,
			order.paymentStatus,
			formatPrice(order.subtotal),
			formatPrice(order.shippingCost),
			formatPrice(order.total),
			itemText
		]
			.map(csvCell)
			.join(';');
	});

	const csv = '\uFEFF' + [header, ...dataRows].join('\n'); // BOM for Excel UTF-8

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="bestellungen-${new Date().toISOString().slice(0, 10)}.csv"`
		}
	});
};

function csvCell(val: string): string {
	if (val.includes(';') || val.includes('"') || val.includes('\n')) {
		return `"${val.replace(/"/g, '""')}"`;
	}
	return val;
}
