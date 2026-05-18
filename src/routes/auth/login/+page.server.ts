import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcryptjs';
import db from '$lib/server/db';
import { customersTable } from '$lib/server/schema';
import { createCustomerSession } from '$lib/server/auth';
import { loginSchema } from '$lib/server/validation';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.customerId) redirect(302, url.searchParams.get('redirectTo') ?? '/');
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const result = loginSchema.safeParse({
			email: String(data.get('email') ?? '')
				.trim()
				.toLowerCase(),
			password: String(data.get('password') ?? '')
		});
		if (!result.success) return fail(400, { error: true });

		const { email, password } = result.data;

		const customer = db.select().from(customersTable).where(eq(customersTable.email, email)).get();

		if (!customer?.passwordHash) return fail(401, { error: true });

		const valid = await bcrypt.compare(password, customer.passwordHash);
		if (!valid) return fail(401, { error: true });

		if (!customer.emailVerified) {
			return fail(403, { error: 'email_not_verified' as const, email });
		}

		await createCustomerSession(customer.id, event);

		const redirectTo = event.url.searchParams.get('redirectTo') ?? '/';
		redirect(302, redirectTo);
	}
};
