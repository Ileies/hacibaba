<script lang="ts">
	import { BUSINESS_CITY, BUSINESS_STREET, BUSINESS_ZIP, EMAIL_INFO } from '$lib/constants';
	import type { PageData } from './$types';

	type AgbData = PageData & { shopHostname: string };

	let { data }: { data: AgbData } = $props();
</script>

<svelte:head>
	<title>Allgemeine Geschäftsbedingungen - Hacibaba</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
	<h1 class="mb-2 text-3xl font-bold tracking-tight">Allgemeine Geschäftsbedingungen</h1>
	<p class="text-muted-foreground mb-8 text-sm">Stand: Mai 2026</p>

	<div class="space-y-8 text-sm leading-relaxed">
		<section>
			<h2 class="mb-3 text-base font-semibold">§ 1 Geltungsbereich</h2>
			<p>
				Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen, die über den
				Online-Shop <strong>{data.shopHostname}</strong> von
				<strong>[FIRMENNAME]</strong>, {BUSINESS_STREET}, {BUSINESS_ZIP}
				{BUSINESS_CITY} (nachfolgend "Verkäufer") aufgegeben werden.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 2 Vertragsschluss</h2>
			<p>
				Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar,
				sondern einen unverbindlichen Online-Katalog. Durch Klicken auf "Jetzt bezahlen" geben Sie
				eine verbindliche Bestellung auf. Die Auftragsbestätigung per E-Mail stellt die Annahme des
				Vertrages dar. Der Vertragstext wird nach Vertragsschluss gespeichert und ist im Kundenkonto
				einsehbar.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 3 Preise und Versandkosten</h2>
			<p>
				Alle Preise sind Endpreise in Euro und enthalten die gesetzliche Umsatzsteuer (7&nbsp;% für
				Lebensmittel). Versandkosten: [VERSANDKOSTEN, z.&nbsp;B. 5,90&nbsp;€] innerhalb
				Deutschlands. Ab einem Bestellwert von [FREIVERSANDGRENZE, z.&nbsp;B. 50,00&nbsp;€] liefern
				wir versandkostenfrei. Die anfallenden Versandkosten werden vor Abschluss der Bestellung
				deutlich ausgewiesen.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 4 Zahlung</h2>
			<p>
				Die Zahlung erfolgt über den Zahlungsdienstleister Stripe. Akzeptierte Zahlungsarten:
				Kreditkarte (Visa, Mastercard, American Express), SEPA-Lastschrift sowie weitere im Checkout
				angezeigte Methoden. Der Rechnungsbetrag wird mit Abschluss der Bestellung fällig.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 5 Lieferung</h2>
			<p>
				Wir liefern ausschließlich nach Deutschland. Die Lieferzeit beträgt in der Regel
				[LIEFERZEIT, z.&nbsp;B. 3-5] Werktage nach Zahlungseingang. Gerät ein von uns zu
				vertretender Artikel in Lieferverzug, steht dem Kunden das gesetzliche Rücktrittsrecht zu.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 6 Eigentumsvorbehalt</h2>
			<p>Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 7 Widerrufsrecht</h2>
			<p>
				Verbrauchern steht grundsätzlich ein Widerrufsrecht zu. Für Lebensmittel, die schnell
				verderben können oder deren Verfallsdatum schnell überschritten würde, ist das
				Widerrufsrecht gemäß § 312g Abs. 2 Nr. 2 BGB ausgeschlossen. Für nicht verderbliche Produkte
				gilt unsere separate
				<a href="/widerruf" class="text-primary hover:underline">Widerrufsbelehrung</a>.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 8 Gewährleistung</h2>
			<p>
				Es gilt das gesetzliche Gewährleistungsrecht. Bei Mängeln wenden Sie sich bitte unter
				<a href="mailto:{EMAIL_INFO}" class="text-primary hover:underline">{EMAIL_INFO}</a>
				an uns. Wir klären das weitere Vorgehen schnell und unkompliziert.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 9 Haftungsbeschränkung</h2>
			<p>
				Ansprüche des Kunden auf Schadensersatz sind ausgeschlossen, soweit nachfolgend nichts
				anderes bestimmt ist. Dies gilt auch für den Vertreter und Erfüllungsgehilfen des Verkäufers
				hinsichtlich der gesetzlich vorgeschriebenen Haftung bei Vorsatz und grober Fahrlässigkeit,
				bei Verletzung des Lebens, des Körpers oder der Gesundheit sowie Produkthaftung.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 10 Anwendbares Recht und Gerichtsstand</h2>
			<p>
				Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
				Gerichtsstand ist [GERICHTSSTAND, z.&nbsp;B. München], sofern der Kunde Kaufmann oder
				juristische Person des öffentlichen Rechts ist.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">§ 11 Streitbeilegung</h2>
			<p>
				Die EU-Kommission stellt eine Online-Streitbeilegungsplattform bereit:
				<a
					href="https://ec.europa.eu/consumers/odr/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline">https://ec.europa.eu/consumers/odr/</a
				>. Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer
				Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
			</p>
		</section>
	</div>
</div>
