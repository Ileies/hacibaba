<script>
	import { EMAIL_INFO } from '$lib/constants';
</script>

<svelte:head>
	<title>Widerrufsbelehrung - Hacibaba</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
	<h1 class="mb-8 text-3xl font-bold tracking-tight">Widerrufsbelehrung</h1>

	<div class="space-y-8 text-sm leading-relaxed">
		<section class="border-border rounded-lg border p-5">
			<h2 class="mb-3 text-base font-semibold">Widerrufsrecht</h2>
			<p>
				Sie haben das Recht, binnen <strong>vierzehn Tagen</strong> ohne Angabe von Gründen diesen Vertrag
				zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen
				benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
			</p>
			<p class="mt-3">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
			<address class="bg-secondary/30 mt-2 rounded p-3 not-italic">
				<strong>[FIRMENNAME]</strong><br />
				[STRASSE UND HAUSNUMMER]<br />
				[POSTLEITZAHL] [STADT]<br />
				E-Mail:
				<a href="mailto:{EMAIL_INFO}" class="text-primary hover:underline">{EMAIL_INFO}</a><br />
				Telefon: [TELEFONNUMMER]
			</address>
			<p class="mt-3">
				mittels einer eindeutigen Erklärung (z.&nbsp;B. ein mit der Post versandter Brief oder eine
				E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür
				das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
			</p>
			<p class="mt-3">
				Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
				Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Folgen des Widerrufs</h2>
			<p>
				Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
				erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die
				sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene,
				günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn
				Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags
				bei uns eingegangen ist.
			</p>
			<p class="mt-3">
				Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen
				Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes
				vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
			</p>
			<p class="mt-3">
				Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder
				bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem,
				welches der frühere Zeitpunkt ist.
			</p>
			<p class="mt-3">
				Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem
				Tag, an dem Sie uns über den Widerruf dieses Vertrages unterrichten, an uns zurückzusenden
				oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von
				vierzehn Tagen absenden. Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
			</p>
			<p class="mt-3">
				Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust
				auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht
				notwendigen Umgang mit ihnen zurückzuführen ist.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-base font-semibold">Ausschluss des Widerrufsrechts</h2>
			<p>
				Das Widerrufsrecht besteht nicht bei Waren, die schnell verderben können oder deren
				Verfallsdatum schnell überschritten würde (§ 312g Abs. 2 Nr. 2 BGB). Dies gilt insbesondere
				für Lebensmittel mit begrenzter Haltbarkeit.
			</p>
			<p class="mt-2">
				Bitte prüfen Sie bei Ihrer Bestellung, ob das betreffende Produkt dem Widerrufsrecht
				unterliegt. Im Zweifelsfall kontaktieren Sie uns vor der Bestellung.
			</p>
		</section>

		<section class="border-border rounded-lg border p-5">
			<h2 class="mb-4 text-base font-semibold">Muster-Widerrufsformular</h2>
			<p class="text-muted-foreground mb-4 text-xs">
				(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und
				senden Sie es zurück.)
			</p>
			<div class="space-y-2">
				<p>An:</p>
				<address class="bg-secondary/30 rounded p-3 not-italic">
					[FIRMENNAME]<br />
					[STRASSE UND HAUSNUMMER]<br />
					[POSTLEITZAHL] [STADT]<br />
					E-Mail: {EMAIL_INFO}
				</address>
				<p class="mt-4">
					Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf
					der folgenden Waren (*):<br /><br />
					Bestellt am (*) / erhalten am (*):<br /><br />
					Name des/der Verbraucher(s):<br /><br />
					Anschrift des/der Verbraucher(s):<br /><br />
					Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):<br /><br />
					Datum:
				</p>
				<p class="text-muted-foreground mt-4 text-xs">(*) Unzutreffendes streichen.</p>
			</div>
		</section>
	</div>
</div>
