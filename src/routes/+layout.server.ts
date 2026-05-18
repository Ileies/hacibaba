import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, cookies, url }) => {
	const siteOrigin = (env.PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
	return {
		locale: locals.locale,
		customer: locals.customerId
			? { id: locals.customerId, name: locals.customerName!, email: locals.customerEmail! }
			: null,
		showCookieBanner: !cookies.get('cookie_consent'),
		pathname: url.pathname,
		siteOrigin
	};
};
