<script lang="ts">
	import type { PageData } from './$types';
	import { formatPrice, activeAllergens, activeTags } from '$lib/types';
	import { cart, toasts } from '$lib/states.svelte';
	import { Button, Badge, Separator } from '$lib/components/ui';
	import { ShoppingCart } from 'lucide-svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { untrack } from 'svelte';
	import * as m from '$lib/messages';

	let scrollY = $state(0);

	let { data }: { data: PageData } = $props();
	let quantity = $state(1);
	let activeImage = $state(untrack(() => data.product.imageUrl));
	const allImages = $derived(
		[data.product.imageUrl, ...(data.product.images ?? [])].filter(Boolean)
	);

	const productJsonLd = $derived(
		`<script type="application/ld+json">${JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Product',
			name: data.product.name,
			description: data.product.description ?? undefined,
			image: data.product.imageUrl ?? undefined,
			brand: { '@type': 'Brand', name: 'Hacibaba' },
			offers: {
				'@type': 'Offer',
				price: (data.product.price / 100).toFixed(2),
				priceCurrency: 'EUR',
				availability:
					data.product.stockQuantity !== null && data.product.stockQuantity <= 0
						? 'https://schema.org/OutOfStock'
						: 'https://schema.org/InStock'
			}
		})}<` + `/script>`
	);
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{data.product.name} - {m.shop_title()}</title>
	<meta
		name="description"
		content={data.product.description
			? data.product.description.slice(0, 155)
			: `${data.product.name} - Authentisches türkisches Lokum von Hacibaba.`}
	/>
	<meta property="og:title" content="{data.product.name} - Hacibaba" />
	<meta
		property="og:description"
		content={data.product.description
			? data.product.description.slice(0, 155)
			: `${data.product.name} - Authentisches türkisches Lokum.`}
	/>
	{#if data.product.imageUrl}
		<meta property="og:image" content={data.product.imageUrl} />
		<meta name="twitter:image" content={data.product.imageUrl} />
	{/if}
	<meta property="og:type" content="product" />
	<!-- JSON-LD Product structured data (#77) -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html productJsonLd}
</svelte:head>

<div class="container mx-auto max-w-5xl px-4 py-10">
	<Breadcrumb
		items={[
			{ label: m.shop_breadcrumb_home(), href: '/' },
			{ label: m.shop_breadcrumb_products(), href: '/products' },
			{ label: data.product.name }
		]}
	/>

	<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
		<!-- Images -->
		<div>
			<div class="bg-secondary/20 mb-3 aspect-square overflow-hidden rounded-xl">
				{#if activeImage}
					<img
						src={activeImage}
						alt={data.product.name}
						class="h-full w-full object-cover"
						fetchpriority="high"
						decoding="async"
					/>
				{:else}
					<div
						class="text-muted-foreground/20 flex h-full w-full items-center justify-center text-8xl"
					>
						□
					</div>
				{/if}
			</div>
			{#if allImages.length > 1}
				<div class="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={m.product_images()}>
					{#each allImages as img, i (i)}
						<button
							class="h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-all {activeImage ===
							img
								? 'ring-primary'
								: 'hover:ring-border ring-transparent'}"
							aria-label={m.common_select_image({ n: String(i + 1) })}
							aria-pressed={activeImage === img}
							onclick={() => (activeImage = img)}
						>
							<img
								src={img!}
								alt=""
								class="h-full w-full object-cover"
								loading="lazy"
								decoding="async"
							/>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Details -->
		<div>
			<h1 class="mb-2 text-3xl font-bold tracking-tight">{data.product.name}</h1>

			{#if data.product.weight}
				<p class="text-muted-foreground mb-4 text-sm">{data.product.weight} g</p>
			{/if}

			{#if data.product.description}
				<p class="text-muted-foreground mb-6 leading-relaxed">{data.product.description}</p>
			{/if}

			<Separator class="mb-6" />

			<!-- Price with optional strikethrough (#36) -->
			<div class="mb-1 flex items-baseline gap-3">
				<span class="text-3xl font-bold">{formatPrice(data.product.price)}</span>
				{#if data.product.originalPrice && data.product.originalPrice > data.product.price}
					<span class="text-muted-foreground text-xl line-through"
						>{formatPrice(data.product.originalPrice)}</span
					>
				{/if}
			</div>
			<p class="text-muted-foreground mb-6 text-xs">
				{m.shop_vat_plus_shipping()}
				<a href="/lieferbedingungen" class="underline underline-offset-2"
					>{m.shop_shipping_costs()}</a
				>
			</p>

			<!-- Product tag badges (#32) -->
			{#each [activeTags(data.product.tags)] as productTags (productTags.join(','))}
				{#if productTags.length > 0}
					<div class="mb-4 flex flex-wrap gap-1.5">
						{#each productTags as tag (tag)}
							<span
								class="border-border bg-secondary/40 rounded-full border px-2.5 py-0.5 text-xs font-medium"
								>{(m as unknown as Record<string, () => string>)[`tag_${tag}`]?.()}</span
							>
						{/each}
					</div>
				{/if}
			{/each}

			<!-- Out of stock state (#27) -->
			{#if data.product.stockQuantity !== null && data.product.stockQuantity <= 0}
				<div class="mb-6">
					<span
						class="bg-secondary text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-sm"
					>
						{m.shop_out_of_stock()}
					</span>
				</div>
			{:else}
				<div class="mb-6 flex items-center gap-3">
					<div class="border-input flex items-center rounded-md border">
						<button
							class="text-muted-foreground hover:text-foreground flex h-10 w-10 items-center justify-center transition-colors disabled:opacity-40"
							aria-label={m.common_qty_decrease()}
							onclick={() => quantity > 1 && quantity--}
							disabled={quantity <= 1}>−</button
						>
						<span class="w-10 text-center text-sm font-medium" aria-live="polite">{quantity}</span>
						<button
							class="text-muted-foreground hover:text-foreground flex h-10 w-10 items-center justify-center transition-colors"
							aria-label={m.common_qty_increase()}
							onclick={() => quantity++}>+</button
						>
					</div>
					<Button
						class="flex-1 gap-2"
						onclick={() => {
							cart.add({
								productId: data.product.id,
								name: data.product.name,
								price: data.product.price,
								imageUrl: data.product.imageUrl,
								quantity
							});
							toasts.add(m.shop_added_to_cart());
							quantity = 1;
						}}
					>
						<ShoppingCart size={16} />
						{m.shop_add_to_cart()}
					</Button>
				</div>
			{/if}
		</div>

		<!-- Origin + pairing (#34) -->
		{#if data.product.originRegion || data.product.pairingSuggestion}
			<dl class="mt-4 space-y-1 text-sm">
				{#if data.product.originRegion}
					<div class="flex gap-2">
						<dt class="text-muted-foreground shrink-0">Herkunft:</dt>
						<dd>{data.product.originRegion}</dd>
					</div>
				{/if}
				{#if data.product.pairingSuggestion}
					<div class="flex gap-2">
						<dt class="text-muted-foreground shrink-0">Passt zu:</dt>
						<dd>{data.product.pairingSuggestion}</dd>
					</div>
				{/if}
			</dl>
		{/if}

		<!-- Shelf life + storage -->
		{#if data.product.shelfLifeMonths || data.product.storageDe}
			<Separator class="mt-2" />
			<dl class="space-y-1 text-sm">
				{#if data.product.shelfLifeMonths}
					<div class="flex gap-2">
						<dt class="text-muted-foreground shrink-0">{m.product_shelf_life()}:</dt>
						<dd>{m.product_shelf_life_months({ months: data.product.shelfLifeMonths })}</dd>
					</div>
				{/if}
				{#if data.product.storageDe}
					<div class="flex gap-2">
						<dt class="text-muted-foreground shrink-0">{m.product_storage()}:</dt>
						<dd>{data.product.storageDe}</dd>
					</div>
				{/if}
			</dl>
		{/if}
	</div>
</div>

<!-- Allergens + Ingredients + Nutrition - below the two-column grid -->
{#if data.product.allergens !== null || data.product.ingredientsDe || data.product.nutrition}
	<div class="container mx-auto max-w-5xl px-4 pb-12">
		<div class="border-border space-y-6 rounded-xl border p-6">
			{#if data.product.allergens !== null}
				{@const active = activeAllergens(data.product.allergens)}
				<div>
					<h3 class="mb-2 text-sm font-semibold">{m.product_allergens()}</h3>
					{#if active.length === 0}
						<p class="text-muted-foreground text-sm">{m.product_allergen_free()}</p>
					{:else}
						<p class="mb-2 text-sm font-medium">{m.product_contains()}:</p>
						<div class="flex flex-wrap gap-2">
							{#each active as key (key)}
								<Badge variant="secondary">{m[`allergen_${key}`]()}</Badge>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			{#if data.product.ingredientsDe}
				<div>
					<h3 class="mb-1 text-sm font-semibold">{m.product_ingredients()}</h3>
					<p class="text-muted-foreground text-sm">{data.product.ingredientsDe}</p>
				</div>
			{/if}

			{#if data.product.nutrition}
				{@const n = data.product.nutrition}
				<div>
					<h3 class="mb-3 text-sm font-semibold">{m.product_nutrition()}</h3>
					<table class="w-full max-w-sm text-sm">
						<tbody class="divide-border divide-y">
							{#if n.energy_kj !== null || n.energy_kcal !== null}
								<tr class="flex justify-between py-1.5">
									<td class="text-muted-foreground">{m.product_energy()}</td>
									<td>{n.energy_kj ?? '-'} kJ / {n.energy_kcal ?? '-'} kcal</td>
								</tr>
							{/if}
							{#if n.fat !== null}
								<tr class="flex justify-between py-1.5">
									<td class="text-muted-foreground">{m.product_fat()}</td>
									<td>{n.fat} g</td>
								</tr>
							{/if}
							{#if n.fat_saturated !== null}
								<tr class="flex justify-between py-1.5 pl-4">
									<td class="text-muted-foreground">{m.product_fat_saturated()}</td>
									<td>{n.fat_saturated} g</td>
								</tr>
							{/if}
							{#if n.carbs !== null}
								<tr class="flex justify-between py-1.5">
									<td class="text-muted-foreground">{m.product_carbs()}</td>
									<td>{n.carbs} g</td>
								</tr>
							{/if}
							{#if n.sugar !== null}
								<tr class="flex justify-between py-1.5 pl-4">
									<td class="text-muted-foreground">{m.product_sugar()}</td>
									<td>{n.sugar} g</td>
								</tr>
							{/if}
							{#if n.fiber !== null}
								<tr class="flex justify-between py-1.5">
									<td class="text-muted-foreground">{m.product_fiber()}</td>
									<td>{n.fiber} g</td>
								</tr>
							{/if}
							{#if n.protein !== null}
								<tr class="flex justify-between py-1.5">
									<td class="text-muted-foreground">{m.product_protein()}</td>
									<td>{n.protein} g</td>
								</tr>
							{/if}
							{#if n.salt !== null}
								<tr class="flex justify-between py-1.5">
									<td class="text-muted-foreground">{m.product_salt()}</td>
									<td>{n.salt} g</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- Sticky "Add to cart" on mobile (#109) -->
{#if scrollY > 300 && (data.product.stockQuantity === null || data.product.stockQuantity > 0)}
	<div
		class="border-border bg-background/95 fixed right-0 bottom-0 left-0 z-40 flex items-center gap-3 border-t px-4 py-3 backdrop-blur md:hidden"
	>
		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-medium">{data.product.name}</p>
			<p class="text-muted-foreground text-xs">{formatPrice(data.product.price)}</p>
		</div>
		<Button
			onclick={() => {
				cart.add({
					productId: data.product.id,
					name: data.product.name,
					price: data.product.price,
					imageUrl: data.product.imageUrl,
					quantity
				});
				toasts.add(m.shop_added_to_cart());
			}}
			class="shrink-0 gap-2"
		>
			<ShoppingCart size={16} />
			{m.shop_add_to_cart()}
		</Button>
	</div>
{/if}
