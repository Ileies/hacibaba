<script lang="ts">
	import type { PageData } from './$types';
	import { formatPrice } from '$lib/types';
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell
	} from '$lib/components/ui';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import * as m from '$lib/messages';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{m.admin_dashboard()} - Admin</title></svelte:head>

<h1 class="mb-8 text-2xl font-semibold tracking-tight">{m.admin_dashboard()}</h1>

<div class="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
	<div class="border-border bg-card rounded-lg border p-5">
		<p class="text-muted-foreground text-sm">{m.admin_total_orders()}</p>
		<p class="mt-1 text-3xl font-bold">{data.stats.totalOrders}</p>
	</div>
	<div class="border-border bg-card rounded-lg border p-5">
		<p class="text-muted-foreground text-sm">{m.admin_total_revenue()}</p>
		<p class="mt-1 text-3xl font-bold">{formatPrice(data.stats.totalRevenue)}</p>
	</div>
	<div class="border-border bg-card rounded-lg border p-5">
		<p class="text-muted-foreground text-sm">{m.admin_order_status_pending()}</p>
		<p class="mt-1 text-3xl font-bold">{data.stats.pendingOrders}</p>
	</div>
</div>

<h2 class="mb-4 text-lg font-semibold">{m.admin_recent_orders()}</h2>
<div class="border-border bg-card overflow-hidden rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>{m.shop_order_number()}</TableHead>
				<TableHead>{m.admin_customer()}</TableHead>
				<TableHead>{m.shop_total()}</TableHead>
				<TableHead>{m.admin_order_status()}</TableHead>
				<TableHead></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.recentOrders as order (order.id)}
				<TableRow>
					<TableCell class="font-mono text-xs">{order.orderNumber}</TableCell>
					<TableCell>
						<p class="text-sm font-medium">{order.customerName}</p>
						<p class="text-muted-foreground text-xs">{order.customerEmail}</p>
					</TableCell>
					<TableCell class="font-medium">{formatPrice(order.total)}</TableCell>
					<TableCell>
						<StatusBadge status={order.status} />
					</TableCell>
					<TableCell>
						<a href="/admin/orders/{order.id}" class="text-primary text-xs hover:underline"
							>{m.admin_details()}</a
						>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
