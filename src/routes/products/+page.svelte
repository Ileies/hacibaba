<script lang="ts">
	import type { PageData } from './$types';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { Search, SlidersHorizontal, X } from 'lucide-svelte';
	import { PRODUCT_TAGS } from '$lib/types';
	import * as m from '$lib/messages';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data }: { data: PageData } = $props();

	let showFilters = $state(false);

	// Derive current URL params
	const sortParam = $derived($page.url.searchParams.get('sort') ?? '');
	const minPriceParam = $derived($page.url.searchParams.get('minPrice') ?? '');
	const maxPriceParam = $derived($page.url.searchParams.get('maxPrice') ?? '');
	const tagsParam = $derived($page.url.searchParams.get('tags') ?? '');
	const activeTagFilters = $derived(tagsParam ? tagsParam.split(',').filter(Boolean) : []);
	const hasFilters = $derived(
		!!(sortParam || minPriceParam || maxPriceParam || tagsParam || data.searchQuery)
	);

	function applyFilters(e: SubmitEvent) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const fd = new FormData(form);
		const params = new SvelteURLSearchParams();
		const q = fd.get('q') as string;
		const sort = fd.get('sort') as string;
		const minPrice = fd.get('minPrice') as string;
		const maxPrice = fd.get('maxPrice') as string;
		const tags = fd.getAll('tag') as string[];
		if (q) params.set('q', q);
		if (sort) params.set('sort', sort);
		if (minPrice) params.set('minPrice', minPrice);
		if (maxPrice) params.set('maxPrice', maxPrice);
		if (tags.length) params.set('tags', tags.join(','));
		goto(`/products?${params.toString()}`);
		showFilters = false;
	}

	function clearFilters() {
		goto('/products');
	}
</script>

<svelte:head>
	<title>{m.shop_products()} - {m.shop_title()}</title>
	<meta
		name="description"
		content="Entdecken Sie unser Sortiment an authentischem türkischem Lokum - traditionell hergestellt nach Familienrezepten seit 1988."
	/>
	<meta property="og:title" content="Produkte - Hacibaba" />
	<meta
		property="og:description"
		content="Entdecken Sie unser Sortiment an authentischem türkischem Lokum seit 1988."
	/>
</svelte:head>

<div class="container mx-auto px-4 py-10">
	<!-- Header row -->
	<div class="mb-6 flex items-center gap-3">
		<h1 class="flex-1 text-2xl font-semibold tracking-tight">
			{#if data.searchQuery}
				{m.shop_search_results_for({ query: data.searchQuery })}
			{:else}
				{m.shop_products()}
			{/if}
		</h1>
		<p class="text-muted-foreground shrink-0 text-sm">{data.products.length} {m.common_items()}</p>
		<button
			onclick={() => (showFilters = !showFilters)}
			class="border-input hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors {hasFilters
				? 'border-primary text-primary'
				: ''}"
			aria-expanded={showFilters}
		>
			<SlidersHorizontal size={14} />
			{m.shop_filter()}
			{#if hasFilters}
				<span
					class="bg-primary text-primary-foreground ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
					>!</span
				>
			{/if}
		</button>
	</div>

	<!-- Filter panel -->
	{#if showFilters}
		<form onsubmit={applyFilters} class="border-border bg-secondary/20 mb-6 rounded-lg border p-5">
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<!-- Search -->
				<div class="space-y-1.5">
					<label for="filter-q" class="text-sm font-medium">{m.common_search()}</label>
					<div class="relative">
						<Search
							size={13}
							class="text-muted-foreground pointer-events-none absolute top-2.5 left-3"
						/>
						<input
							id="filter-q"
							type="search"
							name="q"
							value={data.searchQuery ?? ''}
							placeholder={m.shop_search_placeholder()}
							class="border-input bg-background focus:ring-ring h-9 w-full rounded-md border pr-3 pl-8 text-sm focus:ring-2 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Sort -->
				<div class="space-y-1.5">
					<label for="filter-sort" class="text-sm font-medium">{m.shop_sort()}</label>
					<select
						id="filter-sort"
						name="sort"
						class="border-input bg-background focus:ring-ring h-9 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
					>
						<option value="" selected={!sortParam}>{m.shop_filter_all()}</option>
						<option value="price_asc" selected={sortParam === 'price_asc'}
							>{m.shop_sort_price_asc()}</option
						>
						<option value="price_desc" selected={sortParam === 'price_desc'}
							>{m.shop_sort_price_desc()}</option
						>
						<option value="name" selected={sortParam === 'name'}>{m.shop_sort_name()}</option>
					</select>
				</div>

				<!-- Price range -->
				<div class="space-y-1.5">
					<p class="text-sm font-medium">{m.shop_filter_price()}</p>
					<div class="flex items-center gap-2">
						<input
							type="number"
							name="minPrice"
							min="0"
							step="1"
							value={minPriceParam}
							placeholder="Min €"
							class="border-input bg-background focus:ring-ring h-9 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
						/>
						<span class="text-muted-foreground text-sm">-</span>
						<input
							type="number"
							name="maxPrice"
							min="0"
							step="1"
							value={maxPriceParam}
							placeholder="Max €"
							class="border-input bg-background focus:ring-ring h-9 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Tags/badges -->
				<div class="space-y-1.5">
					<p class="text-sm font-medium">{m.shop_filter_tags()}</p>
					<div class="flex flex-wrap gap-2">
						{#each PRODUCT_TAGS as { key } (key)}
							<label class="flex cursor-pointer items-center gap-1.5 text-xs">
								<input
									type="checkbox"
									name="tag"
									value={key}
									class="border-input h-3.5 w-3.5 rounded"
									checked={activeTagFilters.includes(key)}
								/>
								{m[`tag_${key}`]()}
							</label>
						{/each}
					</div>
				</div>
			</div>

			<div class="mt-4 flex items-center gap-3">
				<button
					type="submit"
					class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
				>
					{m.shop_filter()}
				</button>
				{#if hasFilters}
					<button
						type="button"
						onclick={clearFilters}
						class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
					>
						<X size={14} />
						{m.shop_filter_clear()}
					</button>
				{/if}
			</div>
		</form>
	{/if}

	<!-- Active filter chips -->
	{#if hasFilters && !showFilters}
		<div class="mb-4 flex flex-wrap items-center gap-2">
			{#if data.searchQuery}
				<span
					class="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
				>
					"{data.searchQuery}"
				</span>
			{/if}
			{#if sortParam}
				<span class="bg-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs">
					{sortParam === 'price_asc'
						? m.shop_sort_price_asc()
						: sortParam === 'price_desc'
							? m.shop_sort_price_desc()
							: m.shop_sort_name()}
				</span>
			{/if}
			{#each activeTagFilters as tag (tag)}
				<span class="bg-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
					>{(m as unknown as Record<string, () => string>)[`tag_${tag}`]?.() ?? tag}</span
				>
			{/each}
			<button
				onclick={clearFilters}
				class="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2"
			>
				{m.shop_filter_clear()}
			</button>
		</div>
	{/if}

	{#if data.products.length === 0}
		<div class="text-muted-foreground py-20 text-center">
			<Search size={40} class="mx-auto mb-4 opacity-20" />
			<p class="font-medium">{m.shop_search_no_results()}</p>
			<button onclick={clearFilters} class="text-primary mt-3 inline-block text-sm hover:underline">
				{m.shop_all_products()}
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each data.products as product (product.id)}
				<ProductCard {product} compact />
			{/each}
		</div>
		<p class="text-muted-foreground mt-6 text-xs">
			{m.shop_vat_plus_shipping()}
			<a href="/lieferbedingungen" class="underline underline-offset-2">{m.shop_shipping_costs()}</a
			>
		</p>
	{/if}
</div>
