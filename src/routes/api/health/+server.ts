import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sqlite } from '$lib/server/db';

export const GET: RequestHandler = () => {
	sqlite.exec('SELECT 1');
	return json({ status: 'ok' });
};
