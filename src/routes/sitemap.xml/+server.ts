import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { productsTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/public';

export const GET: RequestHandler = () => {
	const siteUrl = (env.PUBLIC_SITE_URL ?? 'https://hacibaba.de').replace(/\/$/, '');

	const products = db
		.select({ slug: productsTable.slug, updatedAt: productsTable.updatedAt })
		.from(productsTable)
		.where(eq(productsTable.isActive, true))
		.all();

	const staticPages = [
		{ url: '/', priority: '1.0', changefreq: 'weekly' },
		{ url: '/products', priority: '0.9', changefreq: 'daily' },
		{ url: '/faq', priority: '0.6', changefreq: 'monthly' },
		{ url: '/kontakt', priority: '0.6', changefreq: 'monthly' },
		{ url: '/agb', priority: '0.3', changefreq: 'yearly' },
		{ url: '/datenschutz', priority: '0.3', changefreq: 'yearly' },
		{ url: '/impressum', priority: '0.3', changefreq: 'yearly' },
		{ url: '/lieferbedingungen', priority: '0.3', changefreq: 'yearly' },
		{ url: '/widerruf', priority: '0.3', changefreq: 'yearly' }
	];

	const productUrls = products.map((p) => ({
		url: `/products/${p.slug}`,
		priority: '0.8',
		changefreq: 'weekly',
		lastmod: p.updatedAt.slice(0, 10)
	}));

	const today = new Date().toISOString().slice(0, 10);

	const urlEntries = [
		...staticPages.map(
			(p) =>
				`  <url>
    <loc>${siteUrl}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
		),
		...productUrls.map(
			(p) =>
				`  <url>
    <loc>${siteUrl}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
		)
	].join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
