import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cookieName, cookieMaxAge } from '$lib/messages';
import { localeSchema } from '$lib/server/validation';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		return json({ error: 'Invalid locale' }, { status: 400 });
	}
	const result = localeSchema.safeParse(raw);
	if (!result.success) return json({ error: 'Invalid locale' }, { status: 400 });
	cookies.set(cookieName, result.data.locale, { path: '/', maxAge: cookieMaxAge, sameSite: 'lax' });
	return json({ ok: true });
};
