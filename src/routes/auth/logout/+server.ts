import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteCustomerSession } from '$lib/server/auth';

export const POST: RequestHandler = (event) => {
	deleteCustomerSession(event);
	redirect(302, '/');
};
