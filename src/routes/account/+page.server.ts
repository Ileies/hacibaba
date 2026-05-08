import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import bcrypt from 'bcryptjs';
import { requireCustomer, deleteCustomerSession } from '$lib/server/auth';
import db from '$lib/server/db';
import {
	customersTable,
	newsletterSubscribersTable,
	ordersTable,
	orderItemsTable,
	customerAddressesTable
} from '$lib/server/schema';
import { eq, desc, and, asc } from 'drizzle-orm';

export const load: PageServerLoad = (event) => {
	requireCustomer(event);

	const customer = db
		.select({ id: customersTable.id, name: customersTable.name, email: customersTable.email })
		.from(customersTable)
		.where(eq(customersTable.id, event.locals.customerId!))
		.get()!;

	const orders = db
		.select()
		.from(ordersTable)
		.where(eq(ordersTable.customerId, event.locals.customerId!))
		.orderBy(desc(ordersTable.createdAt))
		.all();

	const newsletterSub = db
		.select({ confirmed: newsletterSubscribersTable.confirmed })
		.from(newsletterSubscribersTable)
		.where(eq(newsletterSubscribersTable.email, customer.email))
		.get();

	const ordersWithItems = orders.map((order) => {
		const items = db
			.select()
			.from(orderItemsTable)
			.where(eq(orderItemsTable.orderId, order.id))
			.all();
		return { ...order, items };
	});

	const addresses = db
		.select()
		.from(customerAddressesTable)
		.where(eq(customerAddressesTable.customerId, event.locals.customerId!))
		.orderBy(desc(customerAddressesTable.isDefault), asc(customerAddressesTable.id))
		.all();

	return {
		customer,
		orders: ordersWithItems,
		isNewsletterSubscribed: !!newsletterSub?.confirmed,
		addresses
	};
};

export const actions: Actions = {
	updateProfile: async (event) => {
		requireCustomer(event);
		const formData = await event.request.formData();
		const firstName = String(formData.get('firstName') ?? '').trim();
		const lastName = String(formData.get('lastName') ?? '').trim();

		if (!firstName || !lastName) return fail(400, { profileError: 'missing_fields' as const });

		const name = `${firstName} ${lastName}`;
		db.update(customersTable)
			.set({ name })
			.where(eq(customersTable.id, event.locals.customerId!))
			.run();

		return { profileSuccess: true as const };
	},

	changePassword: async (event) => {
		requireCustomer(event);
		const formData = await event.request.formData();
		const currentPassword = String(formData.get('currentPassword') ?? '');
		const newPassword = String(formData.get('newPassword') ?? '');
		const confirmPassword = String(formData.get('confirmPassword') ?? '');

		if (newPassword.length < 8) return fail(400, { passwordError: 'invalid' as const });
		if (newPassword !== confirmPassword) return fail(400, { passwordError: 'mismatch' as const });

		const customer = db
			.select({ passwordHash: customersTable.passwordHash })
			.from(customersTable)
			.where(eq(customersTable.id, event.locals.customerId!))
			.get();

		if (!customer?.passwordHash) return fail(400, { passwordError: 'no_password' as const });

		const valid = await bcrypt.compare(currentPassword, customer.passwordHash);
		if (!valid) return fail(400, { passwordError: 'wrong' as const });

		const passwordHash = await bcrypt.hash(newPassword, 12);
		db.update(customersTable)
			.set({ passwordHash })
			.where(eq(customersTable.id, event.locals.customerId!))
			.run();

		return { passwordSuccess: true as const };
	},

	toggleNewsletter: async (event) => {
		requireCustomer(event);
		const customer = db
			.select({ email: customersTable.email })
			.from(customersTable)
			.where(eq(customersTable.id, event.locals.customerId!))
			.get();
		if (!customer) return fail(400);

		const existing = db
			.select()
			.from(newsletterSubscribersTable)
			.where(eq(newsletterSubscribersTable.email, customer.email))
			.get();

		if (existing?.confirmed) {
			db.update(newsletterSubscribersTable)
				.set({ confirmed: false })
				.where(eq(newsletterSubscribersTable.email, customer.email))
				.run();
		} else {
			db.delete(newsletterSubscribersTable)
				.where(eq(newsletterSubscribersTable.email, customer.email))
				.run();
			db.insert(newsletterSubscribersTable)
				.values({ email: customer.email, confirmed: true })
				.run();
		}
		return {};
	},

	deleteAccount: async (event) => {
		requireCustomer(event);

		const formData = await event.request.formData();
		if (formData.get('confirmed') !== 'on') {
			return fail(400, { error: 'not_confirmed' as const });
		}

		const customerId = event.locals.customerId!;

		const customer = db
			.select({ email: customersTable.email })
			.from(customersTable)
			.where(eq(customersTable.id, customerId))
			.get();

		if (customer) {
			db.delete(newsletterSubscribersTable)
				.where(eq(newsletterSubscribersTable.email, customer.email))
				.run();
		}

		// Cascades to customer_sessions, oauth_accounts, and customer_addresses
		db.delete(customersTable).where(eq(customersTable.id, customerId)).run();

		deleteCustomerSession(event);
		redirect(302, '/');
	},

	addAddress: async (event) => {
		requireCustomer(event);
		const formData = await event.request.formData();
		const label = String(formData.get('label') ?? '').trim() || null;
		const firstName = String(formData.get('firstName') ?? '').trim();
		const lastName = String(formData.get('lastName') ?? '').trim();
		const street = String(formData.get('street') ?? '').trim();
		const city = String(formData.get('city') ?? '').trim();
		const zip = String(formData.get('zip') ?? '').trim();
		const state = String(formData.get('state') ?? '').trim() || null;
		const setDefault = formData.get('setDefault') === 'on';

		if (!firstName || !lastName || !street || !city || !zip) {
			return fail(400, { addressError: 'missing_fields' as const });
		}

		const customerId = event.locals.customerId!;

		const existingCount = db
			.select({ id: customerAddressesTable.id })
			.from(customerAddressesTable)
			.where(eq(customerAddressesTable.customerId, customerId))
			.all().length;

		const makeDefault = setDefault || existingCount === 0;

		if (makeDefault) {
			db.update(customerAddressesTable)
				.set({ isDefault: false })
				.where(eq(customerAddressesTable.customerId, customerId))
				.run();
		}

		db.insert(customerAddressesTable)
			.values({
				customerId,
				label,
				firstName,
				lastName,
				street,
				city,
				zip,
				state,
				country: 'DE',
				isDefault: makeDefault
			})
			.run();

		return { addressSaved: true as const };
	},

	updateAddress: async (event) => {
		requireCustomer(event);
		const formData = await event.request.formData();
		const id = parseInt(String(formData.get('id') ?? '0'));
		const label = String(formData.get('label') ?? '').trim() || null;
		const firstName = String(formData.get('firstName') ?? '').trim();
		const lastName = String(formData.get('lastName') ?? '').trim();
		const street = String(formData.get('street') ?? '').trim();
		const city = String(formData.get('city') ?? '').trim();
		const zip = String(formData.get('zip') ?? '').trim();
		const state = String(formData.get('state') ?? '').trim() || null;
		const setDefault = formData.get('setDefault') === 'on';

		if (!firstName || !lastName || !street || !city || !zip || !id) {
			return fail(400, { addressError: 'missing_fields' as const });
		}

		const customerId = event.locals.customerId!;

		const existing = db
			.select({ id: customerAddressesTable.id })
			.from(customerAddressesTable)
			.where(
				and(eq(customerAddressesTable.id, id), eq(customerAddressesTable.customerId, customerId))
			)
			.get();

		if (!existing) return fail(404);

		if (setDefault) {
			db.update(customerAddressesTable)
				.set({ isDefault: false })
				.where(eq(customerAddressesTable.customerId, customerId))
				.run();
		}

		db.update(customerAddressesTable)
			.set({ label, firstName, lastName, street, city, zip, state, isDefault: setDefault })
			.where(eq(customerAddressesTable.id, id))
			.run();

		return { addressSaved: true as const };
	},

	deleteAddress: async (event) => {
		requireCustomer(event);
		const formData = await event.request.formData();
		const id = parseInt(String(formData.get('id') ?? '0'));

		const customerId = event.locals.customerId!;

		const existing = db
			.select({ id: customerAddressesTable.id, isDefault: customerAddressesTable.isDefault })
			.from(customerAddressesTable)
			.where(
				and(eq(customerAddressesTable.id, id), eq(customerAddressesTable.customerId, customerId))
			)
			.get();

		if (!existing) return fail(404);

		db.delete(customerAddressesTable).where(eq(customerAddressesTable.id, id)).run();

		if (existing.isDefault) {
			const next = db
				.select({ id: customerAddressesTable.id })
				.from(customerAddressesTable)
				.where(eq(customerAddressesTable.customerId, customerId))
				.get();
			if (next) {
				db.update(customerAddressesTable)
					.set({ isDefault: true })
					.where(eq(customerAddressesTable.id, next.id))
					.run();
			}
		}

		return { addressDeleted: true as const };
	},

	setDefaultAddress: async (event) => {
		requireCustomer(event);
		const formData = await event.request.formData();
		const id = parseInt(String(formData.get('id') ?? '0'));

		const customerId = event.locals.customerId!;

		const existing = db
			.select({ id: customerAddressesTable.id })
			.from(customerAddressesTable)
			.where(
				and(eq(customerAddressesTable.id, id), eq(customerAddressesTable.customerId, customerId))
			)
			.get();

		if (!existing) return fail(404);

		db.update(customerAddressesTable)
			.set({ isDefault: false })
			.where(eq(customerAddressesTable.customerId, customerId))
			.run();

		db.update(customerAddressesTable)
			.set({ isDefault: true })
			.where(eq(customerAddressesTable.id, id))
			.run();

		return {};
	}
};
