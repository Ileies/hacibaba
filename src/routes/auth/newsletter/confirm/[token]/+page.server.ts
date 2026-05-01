import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { newsletterSubscribersTable } from '$lib/server/schema';
import { and, eq, gt, isNotNull } from 'drizzle-orm';

export const load: PageServerLoad = ({ params }) => {
	const { token } = params;
	const now = new Date().toISOString();

	const subscriber = db
		.select({ id: newsletterSubscribersTable.id, email: newsletterSubscribersTable.email })
		.from(newsletterSubscribersTable)
		.where(
			and(
				eq(newsletterSubscribersTable.confirmationToken, token),
				isNotNull(newsletterSubscribersTable.tokenExpiresAt),
				gt(newsletterSubscribersTable.tokenExpiresAt, now),
				eq(newsletterSubscribersTable.confirmed, false)
			)
		)
		.get();

	if (!subscriber) {
		return { success: false };
	}

	db.update(newsletterSubscribersTable)
		.set({ confirmed: true, confirmationToken: null, tokenExpiresAt: null })
		.where(eq(newsletterSubscribersTable.id, subscriber.id))
		.run();

	return { success: true };
};
