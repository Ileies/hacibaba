import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcryptjs';
import db from '$lib/server/db';
import { customersTable, passwordResetTokensTable } from '$lib/server/schema';
import { passwordResetConfirmSchema } from '$lib/server/validation';
import { eq, and, gt } from 'drizzle-orm';

export const load: PageServerLoad = ({ params }) => {
	const now = new Date().toISOString();
	const resetToken = db
		.select()
		.from(passwordResetTokensTable)
		.where(
			and(
				eq(passwordResetTokensTable.token, params.token),
				gt(passwordResetTokensTable.expiresAt, now)
			)
		)
		.get();

	if (!resetToken) error(400, 'invalid_token');

	return { email: resetToken.email };
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const data = await request.formData();
		const result = passwordResetConfirmSchema.safeParse({
			password: String(data.get('password') ?? ''),
			confirm: String(data.get('confirm') ?? '')
		});
		if (!result.success) {
			const isMismatch = result.error.issues.some((e) => e.message === 'mismatch');
			return fail(400, { error: isMismatch ? 'mismatch' : 'invalid' });
		}
		const { password } = result.data;

		const now = new Date().toISOString();
		const resetToken = db
			.select()
			.from(passwordResetTokensTable)
			.where(
				and(
					eq(passwordResetTokensTable.token, params.token),
					gt(passwordResetTokensTable.expiresAt, now)
				)
			)
			.get();

		if (!resetToken) return fail(400, { error: 'expired' });

		const passwordHash = await bcrypt.hash(password, 12);
		db.update(customersTable)
			.set({ passwordHash })
			.where(eq(customersTable.email, resetToken.email))
			.run();

		db.delete(passwordResetTokensTable)
			.where(eq(passwordResetTokensTable.token, params.token))
			.run();

		redirect(302, '/auth/login?reset=success');
	}
};
