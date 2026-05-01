import db from '$lib/server/db';
import { customerSessionsTable, adminSessionsTable } from '$lib/server/schema';
import { lt } from 'drizzle-orm';

export function cleanupExpiredSessions(): void {
	const now = new Date().toISOString();
	db.delete(customerSessionsTable).where(lt(customerSessionsTable.expiresAt, now)).run();
	db.delete(adminSessionsTable).where(lt(adminSessionsTable.expiresAt, now)).run();
}
