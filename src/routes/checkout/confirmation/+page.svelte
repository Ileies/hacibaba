<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui';
	import * as m from '$lib/messages';

	const orderNumber = $derived(page.url.searchParams.get('order') ?? '');
</script>

<svelte:head><title>{m.shop_order_confirmed()} - {m.shop_title()}</title></svelte:head>

<div class="container mx-auto max-w-md px-4 py-24 text-center">
	<div class="bg-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
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
	<h1 class="mb-4 text-3xl font-bold tracking-tight">{m.shop_order_confirmed()}</h1>
	<p class="text-muted-foreground mb-6">{m.shop_order_confirmed_desc()}</p>
	{#if orderNumber}
		<p
			class="border-border mb-8 inline-flex items-center rounded-full border px-4 py-1.5 font-mono text-sm"
		>
			{m.shop_order_number()}: {orderNumber}
		</p>
	{/if}
	<div>
		<Button href="/products" variant="outline">{m.shop_continue_shopping()}</Button>
	</div>
</div>
