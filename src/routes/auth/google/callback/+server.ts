import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Google } from 'arctic';
import { env } from '$env/dynamic/private';
import { createCustomerSession, findOrCreateOauthCustomer } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
	const { url, cookies } = event;

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state');
	const codeVerifier = cookies.get('google_code_verifier');

	cookies.delete('google_oauth_state', { path: '/' });
	cookies.delete('google_code_verifier', { path: '/' });

	if (!code || !state || state !== storedState || !codeVerifier) {
		error(400, 'Invalid OAuth state');
	}

	const google = new Google(
		env.GOOGLE_CLIENT_ID,
		env.GOOGLE_CLIENT_SECRET,
		env.GOOGLE_REDIRECT_URI
	);

	let tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch {
		error(400, 'Failed to exchange code');
	}

	const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
		headers: { Authorization: `Bearer ${tokens.accessToken()}` }
	});

	if (!userInfoRes.ok) error(502, 'Failed to fetch Google profile');

	const userInfo = (await userInfoRes.json()) as {
		id: string;
		email: string;
		name: string;
		given_name?: string;
		family_name?: string;
	};

	const fullName =
		[userInfo.given_name, userInfo.family_name].filter(Boolean).join(' ') || userInfo.name;

	const customerId = await findOrCreateOauthCustomer(
		'google',
		userInfo.id,
		userInfo.email,
		fullName
	);

	await createCustomerSession(customerId, event);
	redirect(302, '/account');
};
