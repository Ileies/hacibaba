<script>
	import { BUSINESS_CITY, BUSINESS_STREET, BUSINESS_ZIP, EMAIL_INFO } from '$lib/constants';
</script>

<svelte:head>
	<title>Impressum - Hacibaba</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
	<h1 class="mb-8 text-3xl font-bold tracking-tight">Impressum</h1>

	<div class="space-y-8 text-sm leading-relaxed">
		<section>
			<h2 class="mb-3 text-base font-semibold">Angaben gemäß § 5 TMG</h2>
			<address class="not-italic">
				<strong>[FIRMENNAME]</strong><br />
				[RECHTSFORM, z.&nbsp;B. GmbH / e.K. / Einzelunternehmen]<br />
				{BUSINESS_STREET}<br />
				{BUSINESS_ZIP}
				{BUSINESS_CITY}<br />
				Deutschland
			</address>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Vertreten durch</h2>
			<p>Engin Karahanci</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Kontakt</h2>
			<p>
				Telefon: <a href="tel:[TELEFONNUMMER]" class="text-primary hover:underline"
					>[TELEFONNUMMER]</a
				><br />
				E-Mail:
				<a href="mailto:{EMAIL_INFO}" class="text-primary hover:underline">{EMAIL_INFO}</a>
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Handelsregister</h2>
			<p>
				Registergericht: [REGISTERGERICHT, z.&nbsp;B. Amtsgericht München]<br />
				Registernummer: [HANDELSREGISTERNUMMER, z.&nbsp;B. HRB 123456]
			</p>
			<p class="text-muted-foreground mt-1 text-xs">
				(Nur zutreffend wenn im Handelsregister eingetragen. Andernfalls diesen Abschnitt
				entfernen.)
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Umsatzsteuer-Identifikationsnummer</h2>
			<p>
				Gemäß § 27a Umsatzsteuergesetz: <strong>[DE-XXXXXXXXXXXXX]</strong>
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">
				Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
			</h2>
			<address class="not-italic">
				Engin Karahanci<br />
				{BUSINESS_STREET}<br />
				{BUSINESS_ZIP}
				{BUSINESS_CITY}
			</address>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Streitschlichtung</h2>
			<p>
				Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
				<a
					href="https://ec.europa.eu/consumers/odr/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline">https://ec.europa.eu/consumers/odr/</a
				>
			</p>
			<p class="mt-2">
				Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet,
				an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Haftung für Inhalte</h2>
			<p>
				Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach
				den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
				jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
				oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
			</p>
		</section>
	</div>
</div>
