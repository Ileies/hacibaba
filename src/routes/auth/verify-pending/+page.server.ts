import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { customersTable } from '$lib/server/schema';
import { createEmailVerificationToken } from '$lib/server/auth';
import { sendVerificationEmail } from '$lib/server/email';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = ({ url }) => {
	return {
		email: url.searchParams.get('email') ?? '',
		error: url.searchParams.get('error') ?? null
	};
};

export const actions: Actions = {
	resend: async ({ request }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '')
			.trim()
			.toLowerCase();

		const customer = db
			.select({
				id: customersTable.id,
				name: customersTable.name,
				emailVerified: customersTable.emailVerified
			})
			.from(customersTable)
			.where(eq(customersTable.email, email))
			.get();

		// Always return success to avoid email enumeration
		if (!customer || customer.emailVerified) return { sent: true };

		const token = createEmailVerificationToken(customer.id);
		sendVerificationEmail(email, customer.name, token).catch(console.error);

		return { sent: true };
	}
};
