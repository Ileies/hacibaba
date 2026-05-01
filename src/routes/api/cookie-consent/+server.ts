import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies }) => {
	cookies.set('cookie_consent', '1', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 365 * 24 * 60 * 60
	});
	return json({ ok: true });
};
