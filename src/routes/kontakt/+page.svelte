<script lang="ts">
	import { BUSINESS_CITY, BUSINESS_STREET, BUSINESS_ZIP, EMAIL_INFO } from '$lib/constants';
	import { Button, Input, Label, Textarea } from '$lib/components/ui';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		status = 'sending';
		// Since we don't have a contact form endpoint yet, we use mailto as fallback
		const subject = encodeURIComponent('Anfrage von ' + name);
		const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${message}`);
		window.location.href = `mailto:${EMAIL_INFO}?subject=${subject}&body=${body}`;
		status = 'idle';
	}
</script>

<svelte:head>
	<title>Kontakt - Hacibaba</title>
	<meta
		name="description"
		content="Kontaktieren Sie uns bei Fragen zu unseren Lokum-Produkten, Bestellungen oder Großkundenanfragen."
	/>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-12">
	<h1 class="mb-2 text-3xl font-bold tracking-tight">Kontakt</h1>
	<p class="text-muted-foreground mb-10">
		Wir freuen uns von Ihnen zu hören. Kontaktieren Sie uns gerne bei Fragen oder
		Großkundenanfragen.
	</p>

	<div class="grid grid-cols-1 gap-10 md:grid-cols-2">
		<!-- Contact info -->
		<div class="space-y-6">
			<div>
				<h2 class="mb-3 font-semibold">Erreichbarkeit</h2>
				<div class="text-muted-foreground space-y-2 text-sm">
					<p>Montag - Freitag: 09:00 - 17:00 Uhr</p>
					<p>Samstag: 10:00 - 14:00 Uhr</p>
					<p>Sonntag: geschlossen</p>
				</div>
			</div>

			<div>
				<h2 class="mb-3 font-semibold">Kontaktdaten</h2>
				<div class="text-muted-foreground space-y-2 text-sm">
					<p>
						<span class="text-foreground font-medium">E-Mail:</span>
						<a
							href="mailto:{EMAIL_INFO}"
							class="hover:text-primary ml-1 underline-offset-2 hover:underline">{EMAIL_INFO}</a
						>
					</p>
					<p>
						<span class="text-foreground font-medium">WhatsApp:</span>
						<a
							href="https://wa.me/4915123456789"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-primary ml-1 underline-offset-2 hover:underline"
						>
							+49 151 23456789
						</a>
					</p>
				</div>
			</div>

			<div>
				<h2 class="mb-3 font-semibold">Adresse</h2>
				<address class="text-muted-foreground text-sm leading-relaxed not-italic">
					Hacibaba<br />
					{BUSINESS_STREET}<br />
					{BUSINESS_ZIP}
					{BUSINESS_CITY}<br />
					Deutschland
				</address>
			</div>

			<div class="border-border rounded-lg border p-4">
				<p class="text-sm font-medium">Großkundenanfragen</p>
				<p class="text-muted-foreground mt-1 text-sm">
					Für Bestellungen ab 10 kg oder für Restaurants, Cafés und Einzelhändler bieten wir
					individuelle Konditionen. Schreiben Sie uns gerne direkt an.
				</p>
			</div>
		</div>

		<!-- Contact form -->
		<div>
			<h2 class="mb-5 font-semibold">Nachricht senden</h2>
			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-1.5">
					<Label for="name">Name</Label>
					<Input id="name" type="text" bind:value={name} required placeholder="Ihr Name" />
				</div>
				<div class="space-y-1.5">
					<Label for="email">E-Mail-Adresse</Label>
					<Input id="email" type="email" bind:value={email} required placeholder="ihre@email.de" />
				</div>
				<div class="space-y-1.5">
					<Label for="message">Nachricht</Label>
					<Textarea
						id="message"
						bind:value={message}
						required
						rows={6}
						placeholder="Ihre Nachricht..."
					/>
				</div>
				<Button type="submit" disabled={status === 'sending'} class="w-full">
					Nachricht senden
				</Button>
			</form>
		</div>
	</div>
</div>
