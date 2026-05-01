<script lang="ts">
	import type { PageData } from './$types';
	import { formatPrice } from '$lib/types';
	import {
		Button,
		Badge,
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell
	} from '$lib/components/ui';
	import { Plus, Pencil } from 'lucide-svelte';
	import * as m from '$lib/messages';

	let { data }: { data: PageData } = $props();
	let page = $state(1);
	const pageSize = 25;
	const totalPages = $derived(Math.ceil(data.products.length / pageSize));
	const paged = $derived(data.products.slice((page - 1) * pageSize, page * pageSize));
</script>

<svelte:head><title>{m.admin_products()} - Admin</title></svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-semibold tracking-tight">{m.admin_products()}</h1>
	<Button href="/admin/products/new" size="sm">
		<Plus size={14} />
		{m.admin_new_product()}
	</Button>
</div>

<div class="border-border bg-card overflow-hidden rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="w-12">{m.admin_image()}</TableHead>
				<TableHead>{m.admin_product_name()}</TableHead>
				<TableHead>{m.shop_price()}</TableHead>
				<TableHead>{m.admin_active()}</TableHead>
				<TableHead class="w-10"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each paged as product (product.id)}
				<TableRow>
					<TableCell>
						{#if product.imageUrl}
							<img src={product.imageUrl} alt="" class="h-8 w-8 rounded object-cover" />
						{/if}
					</TableCell>
					<TableCell class="text-sm font-medium">{product.name_de}</TableCell>
					<TableCell class="text-sm">{formatPrice(product.price)}</TableCell>
					<TableCell>
						<Badge variant={product.isActive ? 'default' : 'outline'}
							>{product.isActive ? m.admin_active() : m.admin_inactive()}</Badge
						>
					</TableCell>
					<TableCell>
						<a
							href="/admin/products/{product.id}"
							aria-label="{m.common_edit()}: {product.name_de}"
							class="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors"
						>
							<Pencil size={13} />
						</a>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

{#if totalPages > 1}
	<div class="mt-4 flex items-center justify-between text-sm">
		<span class="text-muted-foreground">
			{m.admin_page()}
			{page}
			{m.admin_of()}
			{totalPages}
			({data.products.length})
		</span>
		<div class="flex gap-2">
			<Button variant="outline" size="sm" disabled={page <= 1} onclick={() => (page = page - 1)}>
				&larr;
			</Button>
			<Button
				variant="outline"
				size="sm"
				disabled={page >= totalPages}
				onclick={() => (page = page + 1)}
			>
				&rarr;
			</Button>
		</div>
	</div>
{/if}
