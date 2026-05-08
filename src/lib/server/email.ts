import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { EMAIL_BESTELLUNGEN } from '$lib/constants';

function siteUrl(): string {
	return publicEnv.PUBLIC_SITE_URL.replace(/\/$/, '');
}

function siteHostname(): string {
	return new URL(siteUrl()).hostname;
}

function formatEur(cents: number): string {
	return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function esc(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = env;

	if (!SMTP_HOST) {
		console.log(`[email] SMTP not configured. Would send to ${to}: ${subject}`);
		return;
	}

	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: parseInt(SMTP_PORT ?? '587'),
		secure: Number(SMTP_PORT) === 465,
		auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
	});

	try {
		await transporter.sendMail({
			from: SMTP_FROM ?? EMAIL_BESTELLUNGEN,
			to,
			subject,
			html
		});
	} catch (err) {
		console.error('[email] Send failed:', subject, '->', to, err);
	}
}

function wrap(content: string): string {
	const url = siteUrl();
	const host = siteHostname();
	return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;">
<tr><td style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
  <tr>
    <td style="background:#b45309;padding:24px 36px;">
      <p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:0.5px;">Hacibaba</p>
      <p style="margin:4px 0 0;color:#fef3c7;font-size:12px;font-family:Arial,sans-serif;">Authentisches Lokum - Seit 1988</p>
    </td>
  </tr>
  <tr>
    <td style="padding:36px;color:#1c1917;font-size:15px;line-height:1.6;">
      ${content}
    </td>
  </tr>
  <tr>
    <td style="background:#f5f5f4;padding:20px 36px;border-top:1px solid #e7e5e4;">
      <p style="margin:0;color:#78716c;font-size:12px;text-align:center;font-family:Arial,sans-serif;">
        &copy; Hacibaba &middot;
        <a href="${url}" style="color:#b45309;text-decoration:none;">${esc(host)}</a>
      </p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
	return `<p style="margin:24px 0 0;">
    <a href="${href}" style="display:inline-block;background:#b45309;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:bold;font-family:Arial,sans-serif;">${label}</a>
  </p>`;
}

function itemsTable(
	items: { productName: string; quantity: number; totalPrice: number }[]
): string {
	const rows = items
		.map(
			(item) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;font-size:14px;color:#44403c;font-family:Arial,sans-serif;">${item.productName} &times; ${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f5f5f4;font-size:14px;color:#44403c;text-align:right;font-family:Arial,sans-serif;">${formatEur(item.totalPrice)}</td>
    </tr>`
		)
		.join('');
	return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">${rows}</table>`;
}

export type EmailOrderItem = {
	productName: string;
	quantity: number;
	totalPrice: number;
};

export type EmailOrder = {
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	subtotal: number;
	shippingCost: number;
	total: number;
	trackingNumber?: string | null;
};

export async function sendOrderConfirmation(
	order: EmailOrder,
	items: EmailOrderItem[]
): Promise<void> {
	const url = siteUrl();
	const html = wrap(`
    <h2 style="margin:0 0 8px;color:#b45309;font-size:20px;">Bestellung eingegangen</h2>
    <p style="margin:0 0 24px;color:#78716c;font-size:14px;font-family:Arial,sans-serif;">Bestellnummer: <strong style="color:#1c1917;">${esc(order.orderNumber)}</strong></p>
    <p style="margin:0 0 16px;">Vielen Dank, ${esc(order.customerName)}! Ihre Zahlung wurde erfolgreich verarbeitet und Ihre Bestellung wird nun vorbereitet.</p>
    <h3 style="margin:24px 0 8px;font-size:13px;color:#44403c;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;">Ihre Artikel</h3>
    ${itemsTable(items)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0;">
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#78716c;font-family:Arial,sans-serif;">Zwischensumme</td>
        <td style="padding:6px 0;font-size:14px;color:#78716c;text-align:right;font-family:Arial,sans-serif;">${formatEur(order.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#78716c;font-family:Arial,sans-serif;">Versandkosten</td>
        <td style="padding:6px 0;font-size:14px;color:#78716c;text-align:right;font-family:Arial,sans-serif;">${order.shippingCost === 0 ? 'Kostenlos' : formatEur(order.shippingCost)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0 4px;font-size:16px;font-weight:bold;border-top:2px solid #e7e5e4;font-family:Arial,sans-serif;">Gesamt</td>
        <td style="padding:10px 0 4px;font-size:16px;font-weight:bold;text-align:right;border-top:2px solid #e7e5e4;font-family:Arial,sans-serif;">${formatEur(order.total)}</td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:14px;color:#78716c;font-family:Arial,sans-serif;">Sobald Ihre Bestellung versendet wird, erhalten Sie eine weitere E-Mail.</p>
    ${ctaButton(`${url}/account`, 'Bestellstatus ansehen')}
  `);
	await sendMail(order.customerEmail, `Bestellbestätigung ${order.orderNumber} - Hacibaba`, html);
}

export async function sendShippingConfirmation(order: EmailOrder): Promise<void> {
	const url = siteUrl();
	const trackingBlock = order.trackingNumber
		? `<p style="margin:16px 0 0;padding:16px;background:#fef3c7;border-radius:6px;font-size:14px;font-family:Arial,sans-serif;"><strong>Trackingnummer:</strong> ${esc(order.trackingNumber)}</p>`
		: '';
	const html = wrap(`
    <h2 style="margin:0 0 8px;color:#b45309;font-size:20px;">Ihre Bestellung ist unterwegs!</h2>
    <p style="margin:0 0 24px;color:#78716c;font-size:14px;font-family:Arial,sans-serif;">Bestellnummer: <strong style="color:#1c1917;">${esc(order.orderNumber)}</strong></p>
    <p style="margin:0 0 16px;">Gute Neuigkeiten, ${esc(order.customerName)}! Ihre Bestellung wurde soeben versendet und ist auf dem Weg zu Ihnen.</p>
    ${trackingBlock}
    <p style="margin:24px 0 0;font-size:14px;color:#78716c;font-family:Arial,sans-serif;">Die Lieferung dauert in der Regel 2-4 Werktage. Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
    ${ctaButton(`${url}/account`, 'Bestellung verfolgen')}
  `);
	await sendMail(order.customerEmail, `Ihre Bestellung ${order.orderNumber} wurde versendet`, html);
}

export async function sendOrderStatusUpdate(order: EmailOrder, newStatus: string): Promise<void> {
	const url = siteUrl();
	const messages: Record<string, { heading: string; body: string }> = {
		confirmed: {
			heading: 'Bestellung bestätigt',
			body: `Ihre Zahlung ist eingegangen und Ihre Bestellung <strong>${esc(order.orderNumber)}</strong> wird nun bearbeitet.`
		},
		delivered: {
			heading: 'Bestellung zugestellt',
			body: `Ihre Bestellung <strong>${esc(order.orderNumber)}</strong> wurde zugestellt. Wir hoffen, Sie genießen Ihr Haci Baba Lokum!`
		},
		cancelled: {
			heading: 'Bestellung storniert',
			body: `Ihre Bestellung <strong>${esc(order.orderNumber)}</strong> wurde storniert. Bei Fragen wenden Sie sich bitte an uns.`
		}
	};
	const msg = messages[newStatus];
	if (!msg) return;
	const html = wrap(`
    <h2 style="margin:0 0 24px;color:#b45309;font-size:20px;">${msg.heading}</h2>
    <p style="margin:0 0 16px;">Sehr geehrte/r ${esc(order.customerName)},</p>
    <p style="margin:0 0 24px;">${msg.body}</p>
    ${ctaButton(`${url}/account`, 'Meine Bestellungen')}
  `);
	await sendMail(order.customerEmail, `${msg.heading} - ${order.orderNumber}`, html);
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
	const url = siteUrl();
	const html = wrap(`
    <h2 style="margin:0 0 24px;color:#b45309;font-size:20px;">Willkommen bei Hacibaba!</h2>
    <p style="margin:0 0 16px;">Herzlich willkommen, ${esc(name)}!</p>
    <p style="margin:0 0 16px;">Wir freuen uns, Sie als Kunden begrüßen zu dürfen. Seit 1988 stellen wir authentisches Lokum nach traditionellen Familienrezepten her.</p>
    <p style="margin:0 0 24px;">Entdecken Sie unsere Auswahl an handgefertigtem türkischen Lokum - von klassisch bis kreativ, in höchster Qualität.</p>
    ${ctaButton(`${url}/products`, 'Jetzt entdecken')}
  `);
	await sendMail(to, 'Willkommen bei Hacibaba', html);
}

export async function sendAdminNewOrderNotification(
	order: EmailOrder,
	items: EmailOrderItem[]
): Promise<void> {
	const adminEmail = env.ADMIN_EMAIL;
	if (!adminEmail) return;
	const url = siteUrl();
	const html = wrap(`
    <h2 style="margin:0 0 8px;color:#b45309;font-size:20px;">Neue Bestellung eingegangen</h2>
    <p style="margin:0 0 4px;font-size:14px;font-family:Arial,sans-serif;"><strong>Bestellnummer:</strong> ${esc(order.orderNumber)}</p>
    <p style="margin:0 0 4px;font-size:14px;font-family:Arial,sans-serif;"><strong>Kunde:</strong> ${esc(order.customerName)}</p>
    <p style="margin:0 0 16px;font-size:14px;font-family:Arial,sans-serif;"><strong>E-Mail:</strong> ${esc(order.customerEmail)}</p>
    <h3 style="margin:0 0 8px;font-size:13px;color:#44403c;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;">Artikel</h3>
    ${itemsTable(items)}
    <p style="margin:8px 0 0;font-size:16px;font-weight:bold;font-family:Arial,sans-serif;">Gesamt: ${formatEur(order.total)}</p>
    ${ctaButton(`${url}/admin/orders`, 'Im Admin ansehen')}
  `);
	await sendMail(
		adminEmail,
		`Neue Bestellung ${order.orderNumber} - ${formatEur(order.total)}`,
		html
	);
}

export async function sendVerificationEmail(
	to: string,
	name: string,
	token: string
): Promise<void> {
	const url = siteUrl();
	const verifyUrl = `${url}/auth/verify/${token}`;
	const html = wrap(`
    <h2 style="margin:0 0 24px;color:#b45309;font-size:20px;">E-Mail-Adresse bestätigen</h2>
    <p style="margin:0 0 16px;">Herzlich willkommen, ${esc(name)}!</p>
    <p style="margin:0 0 24px;">Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren. Klicken Sie auf den Button - der Link ist <strong>24 Stunden</strong> gültig.</p>
    ${ctaButton(verifyUrl, 'E-Mail-Adresse bestätigen')}
    <p style="margin:24px 0 0;font-size:13px;color:#78716c;font-family:Arial,sans-serif;">Falls Sie dieses Konto nicht erstellt haben, können Sie diese E-Mail ignorieren.</p>
    <p style="margin:8px 0 0;font-size:12px;color:#a8a29e;font-family:Arial,sans-serif;word-break:break-all;">${verifyUrl}</p>
  `);
	await sendMail(to, 'E-Mail-Adresse bestätigen - Hacibaba', html);
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
	const url = siteUrl();
	const resetUrl = `${url}/auth/reset/${token}`;
	const html = wrap(`
    <h2 style="margin:0 0 24px;color:#b45309;font-size:20px;">Passwort zurücksetzen</h2>
    <p style="margin:0 0 16px;">Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
    <p style="margin:0 0 24px;">Klicken Sie auf den folgenden Button, um ein neues Passwort festzulegen. Dieser Link ist <strong>1 Stunde</strong> gültig.</p>
    ${ctaButton(resetUrl, 'Passwort zurücksetzen')}
    <p style="margin:24px 0 0;font-size:13px;color:#78716c;font-family:Arial,sans-serif;">Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. Ihr Passwort bleibt unverändert.</p>
    <p style="margin:8px 0 0;font-size:12px;color:#a8a29e;font-family:Arial,sans-serif;word-break:break-all;">${resetUrl}</p>
  `);
	await sendMail(to, 'Passwort zurücksetzen - Hacibaba', html);
}
