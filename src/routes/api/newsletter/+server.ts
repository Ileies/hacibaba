import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { newsletterSchema } from '$lib/server/validation';
import { newsletterSubscribersTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { sendMail } from '$lib/server/email';
import { env } from '$env/dynamic/private';

function generateToken(): string {
	const bytes = new Uint8Array(24);
	globalThis.crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function tokenExpiresAt(): string {
	return new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
}

async function sendConfirmationEmail(email: string, token: string): Promise<void> {
	const siteUrl = env.PUBLIC_SITE_URL ?? 'https://hacibaba.de';
	const confirmUrl = `${siteUrl}/auth/newsletter/confirm/${token}`;

	if (!env.SMTP_HOST) {
		console.log(`[newsletter] Confirmation URL for ${email}: ${confirmUrl}`);
		return;
	}

	await sendMail(
		email,
		'Newsletter bestätigen - Hacibaba',
		`<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:32px 16px;background:#f5f5f4;font-family:Arial,sans-serif;">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;padding:36px;">
  <p style="margin:0 0 4px;color:#b45309;font-weight:bold;font-size:18px;">Hacibaba</p>
  <h2 style="margin:0 0 24px;font-size:18px;color:#1c1917;">Newsletter bestätigen</h2>
  <p style="margin:0 0 16px;color:#44403c;">Bitte bestätigen Sie Ihre Newsletter-Anmeldung mit einem Klick auf den Button:</p>
  <p style="margin:24px 0;">
    <a href="${confirmUrl}" style="display:inline-block;background:#b45309;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:bold;">E-Mail-Adresse bestätigen</a>
  </p>
  <p style="margin:24px 0 0;font-size:12px;color:#78716c;">Dieser Link ist 48 Stunden gültig. Falls Sie sich nicht angemeldet haben, können Sie diese E-Mail ignorieren.</p>
  <p style="margin:8px 0 0;font-size:11px;color:#a8a29e;word-break:break-all;">${confirmUrl}</p>
</div>
</body>
</html>`
	);
}

export const POST: RequestHandler = async ({ request }) => {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		return json({ error: 'invalid_email' }, { status: 400 });
	}

	const result = newsletterSchema.safeParse(raw);
	if (!result.success) return json({ error: 'invalid_email' }, { status: 400 });

	const normalized = result.data.email.trim().toLowerCase();

	const existing = db
		.select({ confirmed: newsletterSubscribersTable.confirmed })
		.from(newsletterSubscribersTable)
		.where(eq(newsletterSubscribersTable.email, normalized))
		.get();

	if (existing?.confirmed) {
		return json({ error: 'already_subscribed' }, { status: 409 });
	}

	const token = generateToken();
	const expiresAt = tokenExpiresAt();

	if (existing) {
		// Resend confirmation for unconfirmed subscription
		db.update(newsletterSubscribersTable)
			.set({ confirmationToken: token, tokenExpiresAt: expiresAt })
			.where(eq(newsletterSubscribersTable.email, normalized))
			.run();
	} else {
		db.insert(newsletterSubscribersTable)
			.values({
				email: normalized,
				confirmed: false,
				confirmationToken: token,
				tokenExpiresAt: expiresAt
			})
			.run();
	}

	await sendConfirmationEmail(normalized, token);
	return json({ ok: true });
};
