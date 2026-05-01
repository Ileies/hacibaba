<script lang="ts">
	import { cart } from '$lib/states.svelte';
	import { formatPrice, activeTags } from '$lib/types';
	import { Button } from '$lib/components/ui';
	import * as m from '$lib/messages';

	let {
		product,
		compact = false
	}: {
		product: {
			id: number;
			slug: string;
			name: string;
			price: number;
			originalPrice?: number | null;
			stockQuantity?: number | null;
			tags?: number | null;
			imageUrl: string | null;
			weight?: number | null;
		};
		compact?: boolean;
	} = $props();

	const isOutOfStock = $derived(
		product.stockQuantity !== undefined &&
			product.stockQuantity !== null &&
			product.stockQuantity <= 0
	);
	const tags = $derived(activeTags(product.tags));
</script>

<div
	class="group border-border bg-card overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
>
	<a
		href="/products/{product.slug}"
		class="bg-secondary/20 relative block aspect-square overflow-hidden"
	>
		{#if tags.includes('bestseller') || tags.includes('neu')}
			<div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
				{#if tags.includes('neu')}
					<span
						class="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold"
						>{m.tag_neu()}</span
					>
				{/if}
				{#if tags.includes('bestseller')}
					<span class="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white"
						>{m.tag_bestseller()}</span
					>
				{/if}
			</div>
		{/if}
		{#if product.imageUrl}
			<img
				src={product.imageUrl}
				alt={product.name}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
				decoding="async"
			/>
		{:else if compact}
			<div class="text-muted-foreground/30 flex h-full w-full items-center justify-center text-4xl">
				□
			</div>
		{/if}
	</a>
	<div class={compact ? 'p-3' : 'p-4'}>
		<a
			href="/products/{product.slug}"
			class="hover:text-primary text-sm font-medium transition-colors line-clamp-2{compact
				? ' leading-snug'
				: ''}"
		>
			{product.name}
		</a>
		{#if compact && product.weight}
			<p class="text-muted-foreground mt-0.5 text-xs">{product.weight} g</p>
		{/if}
		{#if tags.some((t) => ['halal', 'vegan', 'glutenfrei', 'nussfrei', 'saisonal'].includes(t))}
			<div class="mt-1.5 flex flex-wrap gap-1">
				{#each tags.filter( (t) => ['halal', 'vegan', 'glutenfrei', 'nussfrei', 'saisonal'].includes(t) ) as tag (tag)}
					<span
						class="border-border text-muted-foreground rounded-full border px-1.5 py-0.5 text-[10px]"
						>{(m as unknown as Record<string, () => string>)[`tag_${tag}`]?.() ?? tag}</span
					>
				{/each}
			</div>
		{/if}
		<div class="flex items-center justify-between {compact ? 'mt-2' : 'mt-3'}">
			<div class="flex items-baseline gap-2">
				<span class="font-semibold{compact ? ' text-sm' : ''}">{formatPrice(product.price)}</span>
				{#if product.originalPrice && product.originalPrice > product.price}
					<span class="text-muted-foreground text-xs line-through"
						>{formatPrice(product.originalPrice)}</span
					>
				{/if}
			</div>
			{#if isOutOfStock}
				<span class="text-muted-foreground text-xs">{m.shop_out_of_stock()}</span>
			{:else}
				<Button
					size="sm"
					variant="outline"
					class={compact ? 'h-7 px-2 text-xs' : ''}
					onclick={() =>
						cart.add({
							productId: product.id,
							name: product.name,
							price: product.price,
							imageUrl: product.imageUrl
						})}
				>
					{compact ? m.shop_add_to_cart() : '+'}
				</Button>
			{/if}
		</div>
	</div>
</div>
