import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { loadCustomerSession, handleAdminAuth } from '$lib/server/auth';
import { runWithLocale, cookieName } from '$lib/messages';
import { backupDatabase } from '$lib/server/backup';
import { cleanupExpiredSessions } from '$lib/server/session-cleanup';
import { checkRequiredEnvVars } from '$lib/server/env-check';
import { registerShutdownHandler } from '$lib/server/shutdown';
import { checkRateLimit } from '$lib/server/rate-limiter';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

checkRequiredEnvVars();
registerShutdownHandler();
backupDatabase().catch(console.error);
setInterval(() => backupDatabase().catch(console.error), ONE_DAY_MS);

cleanupExpiredSessions();
setInterval(cleanupExpiredSessions, ONE_DAY_MS);

const handleAuth: Handle = async ({ event, resolve }) => {
	event.locals.customerId = null;
	event.locals.customerName = null;
	event.locals.customerEmail = null;
	event.locals.isAdmin = false;

	loadCustomerSession(event);
	await handleAdminAuth(event);

	return resolve(event);
};

const handleLocale: Handle = ({ event, resolve }) => {
	const locale = event.cookies.get(cookieName) ?? 'de';
	event.locals.locale = locale;
	return runWithLocale(locale, () =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		})
	);
};

// Rate limit rules: [path-prefix, maxRequests, windowMs]
const RATE_LIMIT_RULES: Array<[string, number, number]> = [
	['/auth/login', 10, 60_000],
	['/auth/register', 5, 60_000],
	['/api/orders', 10, 60_000],
	['/api/newsletter', 5, 60_000]
];

const handleRateLimit: Handle = ({ event, resolve }) => {
	const ip = event.request.headers.get('x-forwarded-for') ?? event.getClientAddress();
	const { pathname } = event.url;

	for (const [prefix, max, window] of RATE_LIMIT_RULES) {
		if (pathname.startsWith(prefix)) {
			if (!checkRateLimit(`${prefix}:${ip}`, max, window)) {
				return new Response('Too Many Requests', { status: 429 });
			}
			break;
		}
	}

	return resolve(event);
};

const CSRF_SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_EXEMPT = ['/api/stripe/webhook'];

const handleSecurity: Handle = async ({ event, resolve }) => {
	const { method } = event.request;
	const { pathname, origin } = event.url;

	if (
		!CSRF_SAFE_METHODS.has(method) &&
		pathname.startsWith('/api/') &&
		!CSRF_EXEMPT.includes(pathname)
	) {
		const requestOrigin = event.request.headers.get('origin');
		if (requestOrigin !== origin) {
			return new Response('Forbidden', { status: 403 });
		}
	}

	const response = await resolve(event);
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	return response;
};

export const handle = sequence(handleRateLimit, handleAuth, handleLocale, handleSecurity);
