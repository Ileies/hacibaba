import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';
const PRODUCT_SLUG = 'vanilyali-turk-lokumu-1000';
const CHROMIUM_PATH =
	process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
	'/nix/store/z902vg8lk7gqwafn7anq7blmrymf2r0s-chromium-147.0.7727.137/bin/chromium';

async function main() {
	const browser = await chromium.launch({
		headless: false,
		slowMo: 200,
		executablePath: CHROMIUM_PATH
	});
	const ctx = await browser.newContext();
	const page = await ctx.newPage();

	console.log('1. Produktseite aufrufen...');
	await page.goto(`${BASE_URL}/products/${PRODUCT_SLUG}`);
	await page.waitForLoadState('networkidle');

	// "In den Warenkorb" klicken
	const addToCartBtn = page
		.locator('button')
		.filter({ hasText: /warenkorb/i })
		.first();
	await addToCartBtn.click();
	console.log('   -> Produkt in Warenkorb gelegt');
	await page.waitForTimeout(500);

	console.log('2. Zur Kasse...');
	await page.goto(`${BASE_URL}/checkout`);
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(1000);

	const url = page.url();
	if (url.includes('/cart')) {
		console.log('   -> Warenkorb leer - wurde zum Cart umgeleitet');
		console.log(
			'   [Hinweis: Cart ist clientseitig (localStorage), direkte Navigation funktioniert nicht]'
		);
		// Direkt via localStorage Produkt setzen
		await page.goto(`${BASE_URL}/products/${PRODUCT_SLUG}`);
		await page.waitForLoadState('networkidle');
		const btn = page
			.locator('button')
			.filter({ hasText: /warenkorb/i })
			.first();
		await btn.click();
		await page.waitForTimeout(500);
		await page.goto(`${BASE_URL}/checkout`);
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);
	}

	console.log('3. Versandformular ausfüllen...');

	async function fillInput(selector: string, value: string) {
		await page.locator(selector).click();
		await page.locator(selector).fill(value);
		// Dispatch input + change events to ensure Svelte 5 reactivity picks up the value
		await page.evaluate((sel) => {
			const el = document.querySelector(sel) as HTMLInputElement;
			if (!el) return;
			el.dispatchEvent(new Event('input', { bubbles: true }));
			el.dispatchEvent(new Event('change', { bubbles: true }));
		}, selector);
		await page.waitForTimeout(100);
	}

	await fillInput('#firstName', 'Max');
	await fillInput('#lastName', 'Mustermann');
	await fillInput('#email', 'test@example.com');
	await fillInput('#street', 'Musterstrasse 42');
	await fillInput('#zip', '10115');
	await page.waitForTimeout(2000); // PLZ-Lookup abwarten
	await fillInput('#city', 'Berlin');

	// Bundesland auswählen
	await page.locator('#state').selectOption('Berlin');
	await page.evaluate(() => {
		const el = document.querySelector('#state') as HTMLSelectElement;
		if (el) el.dispatchEvent(new Event('change', { bubbles: true }));
	});

	// Debug: Formularwerte vor Submit prüfen
	const formValues = await page.evaluate(() => {
		return {
			firstName: (document.querySelector('#firstName') as HTMLInputElement)?.value,
			lastName: (document.querySelector('#lastName') as HTMLInputElement)?.value,
			email: (document.querySelector('#email') as HTMLInputElement)?.value,
			street: (document.querySelector('#street') as HTMLInputElement)?.value,
			zip: (document.querySelector('#zip') as HTMLInputElement)?.value,
			city: (document.querySelector('#city') as HTMLInputElement)?.value,
			state: (document.querySelector('#state') as HTMLSelectElement)?.value
		};
	});
	console.log('   Formularwerte:', JSON.stringify(formValues));

	console.log('4. Weiter zur Zahlung...');
	const submitBtn = page.locator('button[type="submit"]').filter({ hasText: /zahlung/i });
	await submitBtn.click();
	await page.waitForTimeout(3000);

	// Alle Fehler sammeln
	const allErrors = await page.locator('.text-destructive').allTextContents();
	if (allErrors.length > 0) {
		console.log(`   -> Fehler: ${allErrors.join(' | ')}`);
	}

	// Prüfen ob Stripe Payment Element geladen wurde
	const currentUrl = page.url();
	console.log(`   URL nach Submit: ${currentUrl}`);

	const paymentHeading = await page
		.locator('h2')
		.filter({ hasText: /zahlung/i })
		.count();
	if (paymentHeading > 0) {
		console.log('   -> Schritt 2 (Zahlung) ist sichtbar');
		const iframes = await page.locator('iframe').count();
		console.log(`   -> Anzahl iframes auf Seite: ${iframes}`);
		if (iframes > 0) {
			console.log('   -> Stripe Payment Element geladen!');
		} else {
			console.log('   -> Kein Stripe iframe gefunden - Payment Element fehlt');
		}
	} else {
		console.log('   -> Zahlungsschritt nicht erreicht');
	}

	await page.screenshot({ path: 'scripts/checkout-result.png', fullPage: true });
	console.log('\nScreenshot gespeichert: scripts/checkout-result.png');

	await page.waitForTimeout(2000);
	await browser.close();
}

main().catch((err) => {
	console.error('Fehler:', err);
	process.exit(1);
});
