import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	shopHostname: new URL(env.PUBLIC_SITE_URL.replace(/\/$/, '')).hostname
});
