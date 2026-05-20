<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { Star } from '@lucide/svelte';
	import * as m from '$lib/messages';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{m.shop_title()} - {m.shop_tagline()}</title>
</svelte:head>

<!-- Hero -->
<section class="border-border bg-secondary/20 border-b py-24 text-center">
	<div class="container mx-auto max-w-2xl px-4">
		<p class="text-primary mb-4 text-sm font-medium tracking-widest uppercase">
			{m.shop_since_1988()}
		</p>
		<h1 class="mb-4 text-5xl font-bold tracking-tight">{m.shop_title()}</h1>
		<p class="text-muted-foreground mb-8 text-xl">{m.shop_tagline()}</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<Button href="/products" size="lg">{m.shop_discover_all_products()}</Button>
			<Button href="/katalog.pdf" target="_blank" variant="outline" size="lg"
				>Katalog herunterladen</Button
			>
		</div>
	</div>
</section>

<!-- Featured products -->
{#if data.featured.length > 0}
	<section class="container mx-auto px-4 pt-10 pb-16">
		<div class="mb-8 flex items-center justify-between">
			<h2 class="text-2xl font-semibold tracking-tight">{m.shop_featured_products()}</h2>
			<a
				href="/products"
				class="border-border text-primary hover:bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
				>{m.shop_show_all()}</a
			>
		</div>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each data.featured as product, i (product.id)}
				<div class={i === 9 ? 'sm:hidden lg:block' : i === 8 ? 'md:hidden lg:block' : ''}>
					<ProductCard {product} />
				</div>
			{/each}
		</div>
	</section>
{/if}

<!-- Testimonials (#72) -->
{#if data.testimonials.length > 0}
	<section class="border-border bg-secondary/20 border-t py-16">
		<div class="container mx-auto px-4">
			<h2 class="mb-10 text-center text-2xl font-semibold tracking-tight">
				{m.shop_testimonials_heading()}
			</h2>
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.testimonials as t (t.id)}
					<blockquote class="border-border bg-card rounded-xl border p-6">
						<div class="mb-3 flex items-center gap-0.5">
							{#each [0, 1, 2, 3, 4] as i (i)}
								<Star
									size={14}
									class={i < t.rating
										? 'fill-amber-400 text-amber-400'
										: 'text-muted-foreground/20'}
								/>
							{/each}
						</div>
						<p class="text-muted-foreground mb-4 text-sm leading-relaxed">"{t.text}"</p>
						<footer class="text-sm font-medium">
							{t.name}
							{#if t.location}
								<span class="text-muted-foreground font-normal"> · {t.location}</span>
							{/if}
						</footer>
					</blockquote>
				{/each}
			</div>
		</div>
	</section>
{/if}
