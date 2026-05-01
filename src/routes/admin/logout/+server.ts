import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteAdminSession } from '$lib/server/auth';

export const POST: RequestHandler = (event) => {
	deleteAdminSession(event);
	redirect(302, '/admin/login');
};
