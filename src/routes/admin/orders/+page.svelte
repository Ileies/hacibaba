<script lang="ts">
	import type { PageData } from './$types';
	import { formatPrice } from '$lib/types';
	import {
		Badge,
		Button,
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell
	} from '$lib/components/ui';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { Download } from 'lucide-svelte';
	import * as m from '$lib/messages';

	let { data }: { data: PageData } = $props();
	let page = $state(1);
	const pageSize = 25;
	const totalPages = $derived(Math.ceil(data.orders.length / pageSize));
	const paged = $derived(data.orders.slice((page - 1) * pageSize, page * pageSize));
</script>

<svelte:head><title>{m.admin_orders()} - Admin</title></svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-semibold tracking-tight">{m.admin_orders()}</h1>
	<Button href="/admin/orders/export" variant="outline" size="sm">
		<Download size={14} />
		{m.admin_export_csv()}
	</Button>
</div>

<div class="border-border bg-card overflow-hidden rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>{m.shop_order_number()}</TableHead>
				<TableHead>Kunde</TableHead>
				<TableHead>Datum</TableHead>
				<TableHead>{m.shop_total()}</TableHead>
				<TableHead>{m.admin_order_status()}</TableHead>
				<TableHead>{m.admin_payment_status()}</TableHead>
				<TableHead></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each paged as order (order.id)}
				<TableRow>
					<TableCell class="font-mono text-xs">{order.orderNumber}</TableCell>
					<TableCell>
						<p class="text-sm font-medium">{order.customerName}</p>
						<p class="text-muted-foreground text-xs">{order.customerEmail}</p>
					</TableCell>
					<TableCell class="text-muted-foreground text-sm">
						{new Date(order.createdAt).toLocaleDateString('de-DE')}
					</TableCell>
					<TableCell class="text-sm font-medium">{formatPrice(order.total)}</TableCell>
					<TableCell>
						<StatusBadge status={order.status} />
					</TableCell>
					<TableCell>
						<Badge variant="outline">{order.paymentStatus}</Badge>
					</TableCell>
					<TableCell>
						<a href="/admin/orders/{order.id}" class="text-primary text-xs hover:underline"
							>Details</a
						>
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
			({data.orders.length})
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
