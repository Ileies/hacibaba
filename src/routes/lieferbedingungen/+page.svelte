<script>
	import { EMAIL_INFO } from '$lib/constants';
</script>

<svelte:head>
	<title>Lieferbedingungen - Hacibaba</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
	<h1 class="mb-8 text-3xl font-bold tracking-tight">Lieferbedingungen</h1>

	<div class="space-y-8 text-sm leading-relaxed">
		<section>
			<h2 class="mb-3 text-base font-semibold">Liefergebiet</h2>
			<p>
				Wir liefern ausschließlich innerhalb Deutschlands. Lieferungen in andere Länder sind nicht
				möglich.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Versandkosten</h2>
			<p>
				Die Versandkosten betragen <strong>[VERSANDKOSTEN, z.&nbsp;B. 5,90&nbsp;€]</strong>
				(inkl. MwSt.) pro Bestellung. Ab einem Bestellwert von
				<strong>[FREIVERSANDGRENZE, z.&nbsp;B. 50,00&nbsp;€]</strong> liefern wir versandkostenfrei.
				Die geltenden Versandkosten werden im Bestellprozess vor der Zahlung eindeutig ausgewiesen.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Lieferzeiten</h2>
			<p>
				Bestellungen werden in der Regel innerhalb von 1-2 Werktagen nach Zahlungseingang bearbeitet
				und versandt. Die Lieferzeit beträgt anschließend
				<strong>[LIEFERZEIT, z.&nbsp;B. 2-4 Werktage]</strong>. Gesamte Lieferzeit: in der Regel
				<strong>[GESAMT, z.&nbsp;B. 3-5 Werktage]</strong>.
			</p>
			<p class="mt-2">
				Bei Bestellungen an Feiertagen oder Wochenenden beginnt die Bearbeitungszeit am nächsten
				Werktag.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Versandpartner</h2>
			<p>
				Wir versenden mit [VERSANDPARTNER, z.&nbsp;B. DHL Paket]. Nach dem Versand erhalten Sie eine
				E-Mail mit Ihrer Trackingnummer, mit der Sie den Status Ihrer Sendung jederzeit verfolgen
				können.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Verpackung</h2>
			<p>
				Alle Produkte werden sorgfältig und bruchsicher verpackt. Empfindliche Produkte werden mit
				zusätzlichem Polstermaterial gesichert, damit sie unbeschadet bei Ihnen ankommen.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Beschädigte Lieferungen</h2>
			<p>
				Sollte Ihre Lieferung beschädigt ankommen, fotografieren Sie bitte die Verpackung und den
				Inhalt und kontaktieren Sie uns umgehend unter
				<a href="mailto:{EMAIL_INFO}" class="text-primary hover:underline">{EMAIL_INFO}</a>. Wir
				finden gemeinsam eine schnelle und unkomplizierte Lösung.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Lieferverzögerungen</h2>
			<p>
				In Ausnahmefällen (z.&nbsp;B. bei hohem Auftragsvolumen, Streiks oder höherer Gewalt) kann
				es zu Verzögerungen kommen. Wir informieren Sie in diesem Fall umgehend per E-Mail.
			</p>
		</section>
	</div>
</div>
