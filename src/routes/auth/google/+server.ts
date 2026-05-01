import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Google, generateState, generateCodeVerifier } from 'arctic';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ cookies }) => {
	const google = new Google(
		env.GOOGLE_CLIENT_ID,
		env.GOOGLE_CLIENT_SECRET,
		env.GOOGLE_REDIRECT_URI
	);

	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email']);

	cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 minutes
	});
	cookies.set('google_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10
	});

	redirect(302, url.toString());
};
