import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { verifyAdminCredentials, createAdminSession } from '$lib/server/auth';
import { adminLoginSchema } from '$lib/server/validation';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.isAdmin) redirect(302, url.searchParams.get('redirectTo') ?? '/admin');
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const result = adminLoginSchema.safeParse({
			username: String(data.get('username') ?? '').trim(),
			password: String(data.get('password') ?? '')
		});
		if (!result.success) return fail(401, { error: true });

		const valid = await verifyAdminCredentials(result.data.username, result.data.password);
		if (!valid) return fail(401, { error: true });

		await createAdminSession(event);

		const redirectTo = event.url.searchParams.get('redirectTo') ?? '/admin';
		redirect(302, redirectTo);
	}
};
