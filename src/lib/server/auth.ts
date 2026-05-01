import { redirect, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import db from '$lib/server/db';
import {
	customersTable,
	customerSessionsTable,
	adminSessionsTable,
	oauthAccountsTable
} from '$lib/server/schema';
import { and, eq, gt } from 'drizzle-orm';

// --- Shared helpers ---

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function generateSessionToken(): string {
	const bytes = new Uint8Array(32);
	globalThis.crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function sessionExpiresAt(): string {
	return new Date(Date.now() + SESSION_DURATION_MS).toISOString();
}

// --- Customer auth ---

const CUSTOMER_SESSION_COOKIE = 'session';

export async function createCustomerSession(
	customerId: number,
	event: RequestEvent
): Promise<void> {
	const token = generateSessionToken();
	db.insert(customerSessionsTable)
		.values({ token, customerId, expiresAt: sessionExpiresAt() })
		.run();
	event.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: SESSION_DURATION_MS / 1000
	});
}

export function deleteCustomerSession(event: RequestEvent): void {
	const token = event.cookies.get(CUSTOMER_SESSION_COOKIE);
	if (token) {
		db.delete(customerSessionsTable).where(eq(customerSessionsTable.token, token)).run();
	}
	event.cookies.delete(CUSTOMER_SESSION_COOKIE, { path: '/' });
}

export function loadCustomerSession(event: RequestEvent): void {
	const token = event.cookies.get(CUSTOMER_SESSION_COOKIE);
	if (!token) return;

	const now = new Date().toISOString();
	const row = db
		.select({
			customerId: customersTable.id,
			name: customersTable.name,
			email: customersTable.email,
			isBlocked: customersTable.isBlocked
		})
		.from(customerSessionsTable)
		.innerJoin(customersTable, eq(customersTable.id, customerSessionsTable.customerId))
		.where(and(eq(customerSessionsTable.token, token), gt(customerSessionsTable.expiresAt, now)))
		.get();

	if (!row || row.isBlocked) {
		event.cookies.delete(CUSTOMER_SESSION_COOKIE, { path: '/' });
		return;
	}

	event.locals.customerId = row.customerId;
	event.locals.customerName = row.name;
	event.locals.customerEmail = row.email;
}

// Protects routes that require a logged-in customer (e.g. /account)
export function requireCustomer(event: RequestEvent): void {
	if (!event.locals.customerId) {
		redirect(302, `/auth/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);
	}
}

export async function findOrCreateOauthCustomer(
	provider: string,
	providerUserId: string,
	email: string,
	name: string
): Promise<number> {
	// Check existing OAuth link
	const existing = db
		.select({ customerId: oauthAccountsTable.customerId })
		.from(oauthAccountsTable)
		.where(
			and(
				eq(oauthAccountsTable.provider, provider),
				eq(oauthAccountsTable.providerUserId, providerUserId)
			)
		)
		.get();

	if (existing) return existing.customerId;

	// Link to existing customer by email, or create new
	let customer = db
		.select({ id: customersTable.id })
		.from(customersTable)
		.where(eq(customersTable.email, email))
		.get();

	if (!customer) {
		const [created] = db
			.insert(customersTable)
			.values({ email, name })
			.returning({ id: customersTable.id })
			.all();
		customer = created;
	}

	db.insert(oauthAccountsTable).values({ provider, providerUserId, customerId: customer.id }).run();

	return customer.id;
}

// --- Admin auth (credentials from .env) ---

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
	return username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD;
}

export async function createAdminSession(event: RequestEvent): Promise<void> {
	const token = generateSessionToken();
	const expiresAt = new Date(Date.now() + ADMIN_SESSION_DURATION_MS).toISOString();
	db.insert(adminSessionsTable).values({ token, expiresAt }).run();
	event.cookies.set(ADMIN_SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: ADMIN_SESSION_DURATION_MS / 1000
	});
}

export function deleteAdminSession(event: RequestEvent): void {
	const token = event.cookies.get(ADMIN_SESSION_COOKIE);
	if (token) db.delete(adminSessionsTable).where(eq(adminSessionsTable.token, token)).run();
	event.cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
}

export async function handleAdminAuth(event: RequestEvent): Promise<void> {
	if (!event.url.pathname.startsWith('/admin')) return;
	if (event.url.pathname === '/admin/login') return;

	const token = event.cookies.get(ADMIN_SESSION_COOKIE);
	if (!token) redirect(302, `/admin/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);

	const now = new Date().toISOString();
	const session = db
		.select()
		.from(adminSessionsTable)
		.where(and(eq(adminSessionsTable.token, token), gt(adminSessionsTable.expiresAt, now)))
		.get();

	if (!session) {
		event.cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
		redirect(302, '/admin/login');
	}

	event.locals.isAdmin = true;
}
