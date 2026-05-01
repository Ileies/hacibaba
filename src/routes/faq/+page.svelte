<script lang="ts">
	const faqs = [
		{
			q: 'Sind Ihre Lokum-Produkte Halal?',
			a: 'Ja, alle unsere Produkte werden nach traditionellen türkischen Rezepten ohne Alkohol und ohne Schweinefleischprodukte hergestellt. Das Halal-Zertifikat steht auf Anfrage zur Verfügung.'
		},
		{
			q: 'Wie lange sind Ihre Produkte haltbar?',
			a: 'Die Mindesthaltbarkeit variiert je nach Produkt. In der Regel sind unsere Lokum-Produkte 6 bis 12 Monate ab Produktionsdatum haltbar, wenn sie kühl und trocken gelagert werden. Die genaue MHD-Angabe finden Sie auf jeder Produktseite und der Verpackung.'
		},
		{
			q: 'Wie soll ich die Produkte lagern?',
			a: 'Bitte lagern Sie Lokum kühl, trocken und lichtgeschützt - idealerweise bei Zimmertemperatur zwischen 15 und 20 Grad. Nicht im Kühlschrank lagern, da die Feuchtigkeit die Konsistenz verändern kann.'
		},
		{
			q: 'Welche Allergene sind in Ihren Produkten enthalten?',
			a: 'Das hängt vom jeweiligen Produkt ab. Viele klassische Lokum-Sorten enthalten Nüsse (z.B. Pistazien, Walnüsse) oder Sesam. Die genaue Allergen-Kennzeichnung finden Sie auf jeder einzelnen Produktseite. Bei Fragen stehen wir gerne zur Verfügung.'
		},
		{
			q: 'Bieten Sie glutenfreie Produkte an?',
			a: 'Einige unserer Sorten sind von Natur aus glutenfrei. Bitte prüfen Sie die Allergen-Angaben auf der jeweiligen Produktseite. Da wir in einer gemeinsamen Produktionsumgebung herstellen, können wir eine Kontaminierung mit Gluten nicht vollständig ausschließen.'
		},
		{
			q: 'Ab welchem Bestellwert ist der Versand kostenlos?',
			a: 'Ab einem Bestellwert von 50,00 € liefern wir versandkostenfrei innerhalb Deutschlands. Unterhalb dieses Betrags berechnen wir eine Versandpauschale von 5,90 €.'
		},
		{
			q: 'Wie lange dauert die Lieferung?',
			a: 'Bestellungen, die bis 14:00 Uhr eingehen, werden in der Regel am gleichen Werktag versendet. Die Lieferzeit innerhalb Deutschlands beträgt 1-3 Werktage.'
		},
		{
			q: 'Kann ich meine Bestellung zurückgeben?',
			a: 'Als Privatkunde haben Sie ein 14-tägiges Widerrufsrecht. Bei Lebensmitteln, deren Haltbarkeitsdatum überschritten ist oder die aus hygienischen Gründen nicht zurückgenommen werden können, gelten gesonderte Regelungen. Details finden Sie in unserer Widerrufsbelehrung.'
		},
		{
			q: 'Liefern Sie auch ins Ausland?',
			a: 'Derzeit liefern wir innerhalb Deutschlands. Für internationale Bestellungen oder Großbestellungen nehmen Sie bitte direkt Kontakt mit uns auf.'
		},
		{
			q: 'Sind die Produkte für Veganer geeignet?',
			a: 'Klassische Lokum-Sorten ohne Milchzusatz und ohne Gelatine sind vegan. Bitte prüfen Sie die Zutatenliste auf der Produktseite, da einige Sorten Milch oder andere tierische Zutaten enthalten können.'
		},
		{
			q: 'Wie weit im Voraus sollte ich für Feiern bestellen?',
			a: 'Für kleinere Mengen (bis 5 kg) können Sie kurzfristig bestellen. Für Hochzeiten, Firmenveranstaltungen oder größere Bestellmengen empfehlen wir, mindestens 1-2 Wochen im Voraus zu bestellen, um die Verfügbarkeit zu sichern.'
		}
	];
</script>

<svelte:head>
	<title>FAQ - Hacibaba</title>
	<meta
		name="description"
		content="Antworten auf häufige Fragen zu unseren Lokum-Produkten, Lieferung, Zutaten und Zertifikaten."
	/>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
	<h1 class="mb-2 text-3xl font-bold tracking-tight">Häufige Fragen</h1>
	<p class="text-muted-foreground mb-10">Antworten auf die am häufigsten gestellten Fragen.</p>

	<div class="space-y-6">
		{#each faqs as { q, a } (q)}
			<details class="border-border group rounded-lg border p-5 open:shadow-sm">
				<summary class="group-open:text-primary -m-5 cursor-pointer list-none p-5 font-medium">
					{q}
				</summary>
				<p class="text-muted-foreground mt-3 text-sm leading-relaxed">{a}</p>
			</details>
		{/each}
	</div>

	<div class="border-border mt-12 rounded-lg border p-6 text-center">
		<p class="text-muted-foreground mb-3 text-sm">Ihre Frage ist nicht dabei?</p>
		<a
			href="/kontakt"
			class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
		>
			Kontakt aufnehmen
		</a>
	</div>
</div>
