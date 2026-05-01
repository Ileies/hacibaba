import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { customerAddressesTable } from '$lib/server/schema';
import { eq, desc, asc } from 'drizzle-orm';

export const load: PageServerLoad = ({ locals }) => {
	const savedAddresses = locals.customerId
		? db
				.select()
				.from(customerAddressesTable)
				.where(eq(customerAddressesTable.customerId, locals.customerId))
				.orderBy(desc(customerAddressesTable.isDefault), asc(customerAddressesTable.id))
				.all()
		: [];

	return {
		customer: locals.customerId
			? { name: locals.customerName!, email: locals.customerEmail! }
			: null,
		savedAddresses
	};
};
