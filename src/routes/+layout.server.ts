import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, cookies, url }) => {
	return {
		locale: locals.locale,
		customer: locals.customerId
			? { id: locals.customerId, name: locals.customerName!, email: locals.customerEmail! }
			: null,
		showCookieBanner: !cookies.get('cookie_consent'),
		pathname: url.pathname
	};
};
