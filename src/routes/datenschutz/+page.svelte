<script>
	import {
		BUSINESS_CITY,
		BUSINESS_STREET,
		BUSINESS_ZIP,
		EMAIL_DATENSCHUTZ,
		PHONE_INFO
	} from '$lib/constants';
</script>

<svelte:head>
	<title>Datenschutzerklärung - Hacibaba</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
	<h1 class="mb-2 text-3xl font-bold tracking-tight">Datenschutzerklärung</h1>
	<p class="text-muted-foreground mb-8 text-sm">Stand: Mai 2026</p>

	<div class="space-y-8 text-sm leading-relaxed">
		<section>
			<h2 class="mb-3 text-base font-semibold">1. Verantwortlicher</h2>
			<address class="not-italic">
				<strong>[FIRMENNAME]</strong><br />
				{BUSINESS_STREET}<br />
				{BUSINESS_ZIP}
				{BUSINESS_CITY}<br />
				E-Mail:
				<a href="mailto:{EMAIL_DATENSCHUTZ}" class="text-primary hover:underline"
					>{EMAIL_DATENSCHUTZ}</a
				><br />
				Telefon: {PHONE_INFO}
			</address>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">
				2. Erhebung und Speicherung personenbezogener Daten
			</h2>
			<h3 class="text-muted-foreground mb-2 font-medium">a) Beim Besuch der Website</h3>
			<p>
				Beim Aufrufen unserer Website werden durch den Browser automatisch Informationen an den
				Server übermittelt: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Referrer-URL,
				Browser-Typ. Diese Daten werden ausschließlich zur Sicherstellung des Betriebs gespeichert
				(Art. 6 Abs. 1 lit. f DSGVO) und nach 7 Tagen gelöscht.
			</p>

			<h3 class="text-muted-foreground mt-4 mb-2 font-medium">b) Bei der Registrierung</h3>
			<p>
				Bei der Erstellung eines Kundenkontos erheben wir: Name, E-Mail-Adresse, verschlüsseltes
				Passwort. Die Verarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Daten
				werden so lange gespeichert, wie das Konto besteht.
			</p>

			<h3 class="text-muted-foreground mt-4 mb-2 font-medium">c) Bei einer Bestellung</h3>
			<p>
				Zur Abwicklung von Bestellungen verarbeiten wir: Name, Lieferadresse, E-Mail-Adresse,
				Telefonnummer (optional), Bestellinhalt, Zahlungsdaten (ausschließlich über Stripe -
				s.&nbsp;unten). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Bestelldaten werden aufgrund
				steuerrechtlicher Aufbewahrungspflichten 10 Jahre aufbewahrt (§ 147 AO).
			</p>

			<h3 class="text-muted-foreground mt-4 mb-2 font-medium">d) Newsletter</h3>
			<p>
				Mit Ihrer ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) speichern wir Ihre
				E-Mail-Adresse für den Versand unseres Newsletters. Die Anmeldung erfolgt per
				Double-Opt-In-Verfahren. Sie können sich jederzeit über den Abmeldelink im Newsletter
				abmelden.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">3. Weitergabe von Daten an Dritte</h2>

			<h3 class="text-muted-foreground mb-2 font-medium">Stripe (Zahlungsabwicklung)</h3>
			<p>
				Für die Zahlungsabwicklung nutzen wir Stripe Payments Europe, Ltd., 1 Grand Canal Street
				Lower, Grand Canal Dock, Dublin, D02 H210, Irland. Stripe ist als Auftragsverarbeiter gemäß
				Art. 28 DSGVO tätig. Bei Zahlungen werden Ihre Kreditkartendaten ausschließlich an Stripe
				übertragen. Datenschutzerklärung Stripe:
				<a
					href="https://stripe.com/de/privacy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline">stripe.com/de/privacy</a
				>.
			</p>

			<h3 class="text-muted-foreground mt-4 mb-2 font-medium">Google (OAuth-Anmeldung)</h3>
			<p>
				Wenn Sie sich mit Google anmelden, erhalten wir von Google LLC, 1600 Amphitheatre Parkway,
				Mountain View, CA 94043, USA, Ihren Namen und Ihre E-Mail-Adresse. Rechtsgrundlage ist Art.
				6 Abs. 1 lit. b DSGVO. Datenschutzerklärung Google:
				<a
					href="https://policies.google.com/privacy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline">policies.google.com/privacy</a
				>.
			</p>

			<h3 class="text-muted-foreground mt-4 mb-2 font-medium">Versanddienstleister</h3>
			<p>
				Zur Lieferung Ihrer Bestellung übermitteln wir Name und Lieferadresse an unseren
				Versandpartner ([VERSANDPARTNER, z.&nbsp;B. DHL Paket GmbH]). Rechtsgrundlage ist Art. 6
				Abs. 1 lit. b DSGVO.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">4. Cookies und Sitzungsdaten</h2>
			<p>
				Wir verwenden ausschließlich technisch notwendige Cookies: ein Session-Cookie für Ihren
				Login-Status und ein Cookie zur Speicherung Ihrer Sprachpräferenz. Diese Cookies sind für
				den Betrieb des Shops erforderlich und können nicht deaktiviert werden (Art. 6 Abs. 1 lit. f
				DSGVO). Es werden keine Tracking- oder Werbe-Cookies ohne Ihre Einwilligung gesetzt.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">5. Ihre Rechte</h2>
			<p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
			<ul class="mt-2 list-inside list-disc space-y-1">
				<li>Recht auf Auskunft (Art. 15 DSGVO)</li>
				<li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
				<li>Recht auf Löschung (Art. 17 DSGVO)</li>
				<li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
				<li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
				<li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
				<li>Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
			</ul>
			<p class="mt-3">
				Zur Ausübung Ihrer Rechte wenden Sie sich an:
				<a href="mailto:{EMAIL_DATENSCHUTZ}" class="text-primary hover:underline"
					>{EMAIL_DATENSCHUTZ}</a
				>. Sie haben zudem das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde zu
				beschweren.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">6. Datensicherheit</h2>
			<p>
				Diese Seite nutzt aus Sicherheitsgründen eine SSL/TLS-Verschlüsselung. Passwörter werden
				ausschließlich in gehashter Form (bcrypt) gespeichert. Zahlungsdaten werden nicht auf
				unseren Servern gespeichert, sondern direkt über Stripe verarbeitet.
			</p>
		</section>
	</div>
</div>
