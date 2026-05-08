import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { customersTable } from '$lib/server/schema';
import { createCustomerSession } from '$lib/server/auth';
import { sendWelcomeEmail } from '$lib/server/email';
import { and, eq, gt } from 'drizzle-orm';

export const GET: RequestHandler = async (event) => {
	const { token } = event.params;
	const now = new Date().toISOString();

	const customer = db
		.select()
		.from(customersTable)
		.where(
			and(
				eq(customersTable.emailVerificationToken, token),
				gt(customersTable.emailVerificationTokenExpiresAt, now)
			)
		)
		.get();

	if (!customer) {
		redirect(302, '/auth/verify-pending?error=invalid');
	}

	db.update(customersTable)
		.set({
			emailVerified: true,
			emailVerificationToken: null,
			emailVerificationTokenExpiresAt: null
		})
		.where(eq(customersTable.id, customer.id))
		.run();

	await createCustomerSession(customer.id, event);
	sendWelcomeEmail(customer.email, customer.name).catch(console.error);
	redirect(302, '/account');
};
