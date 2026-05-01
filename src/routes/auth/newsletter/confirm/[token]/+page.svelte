<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui';
	import * as m from '$lib/messages';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{m.newsletter_confirm_title()} - {m.shop_title()}</title></svelte:head>

<div class="container mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
	{#if data.success}
		<div class="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
			<svg
				class="text-primary h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		</div>
		<h1 class="mb-3 text-2xl font-bold">{m.newsletter_confirm_title()}</h1>
		<p class="text-muted-foreground mb-8">{m.newsletter_confirm_success()}</p>
	{:else}
		<div class="bg-destructive/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
			<svg
				class="text-destructive h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</div>
		<h1 class="mb-3 text-2xl font-bold">{m.newsletter_confirm_title()}</h1>
		<p class="text-muted-foreground mb-8">{m.newsletter_confirm_invalid()}</p>
	{/if}
	<Button href="/products">{m.shop_all_products()}</Button>
</div>
