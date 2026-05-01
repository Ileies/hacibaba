import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { customersTable } from '$lib/server/schema';
import { createCustomerSession } from '$lib/server/auth';
import { sendWelcomeEmail } from '$lib/server/email';
import { registerSchema } from '$lib/server/validation';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.customerId) redirect(302, '/account');
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '')
			.trim()
			.toLowerCase();
		const result = registerSchema.safeParse({
			name,
			email,
			password: String(data.get('password') ?? '')
		});
		if (!result.success) return fail(400, { error: 'invalid', name, email });

		const { password } = result.data;

		const existing = db
			.select({ id: customersTable.id })
			.from(customersTable)
			.where(eq(customersTable.email, email))
			.get();

		if (existing) return fail(400, { error: 'email_taken', name, email });

		const passwordHash = await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 12 });
		const [customer] = db
			.insert(customersTable)
			.values({ email, name, passwordHash })
			.returning({ id: customersTable.id })
			.all();

		await createCustomerSession(customer.id, event);
		sendWelcomeEmail(email, name).catch(console.error);
		redirect(302, '/account');
	}
};
