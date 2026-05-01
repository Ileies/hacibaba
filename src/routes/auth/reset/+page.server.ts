import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { customersTable, passwordResetTokensTable } from '$lib/server/schema';
import { generateSessionToken } from '$lib/server/auth';
import { sendPasswordResetEmail } from '$lib/server/email';
import { passwordResetRequestSchema } from '$lib/server/validation';
import { eq, lt } from 'drizzle-orm';

export const load: PageServerLoad = () => ({});

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const result = passwordResetRequestSchema.safeParse({
			email: String(data.get('email') ?? '')
				.trim()
				.toLowerCase()
		});
		if (!result.success) return fail(400, { error: 'invalid' });

		const { email } = result.data;

		// Delete expired tokens
		db.delete(passwordResetTokensTable)
			.where(lt(passwordResetTokensTable.expiresAt, new Date().toISOString()))
			.run();

		const customer = db
			.select({ id: customersTable.id })
			.from(customersTable)
			.where(eq(customersTable.email, email))
			.get();

		if (customer) {
			const token = generateSessionToken();
			const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
			db.insert(passwordResetTokensTable).values({ token, email, expiresAt }).run();
			sendPasswordResetEmail(email, token).catch(console.error);
		}

		// Always return success to prevent email enumeration
		return { sent: true };
	}
};
