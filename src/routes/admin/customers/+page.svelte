<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { formatPrice } from '$lib/types';
	import {
		Badge,
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell,
		Button
	} from '$lib/components/ui';
	import * as m from '$lib/messages';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let page = $state(1);
	const pageSize = 25;
	const totalPages = $derived(Math.ceil(data.customers.length / pageSize));
	const paged = $derived(data.customers.slice((page - 1) * pageSize, page * pageSize));
</script>

<svelte:head><title>{m.admin_customers()} - Admin</title></svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-semibold tracking-tight">{m.admin_customers()}</h1>
	<span class="text-muted-foreground text-sm">{data.customers.length} {m.common_items()}</span>
</div>

{#if form?.toggled}
	<div
		class="bg-primary/10 border-primary/20 text-primary mb-4 rounded-lg border px-4 py-3 text-sm font-medium"
	>
		{form.nowBlocked ? m.admin_customer_blocked_msg() : m.admin_customer_unblocked_msg()}
	</div>
{/if}

<div class="border-border bg-card overflow-hidden rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>{m.admin_customer_name()}</TableHead>
				<TableHead class="hidden md:table-cell">{m.admin_customer_email()}</TableHead>
				<TableHead>{m.admin_customer_orders()}</TableHead>
				<TableHead class="hidden sm:table-cell">{m.admin_customer_revenue()}</TableHead>
				<TableHead class="hidden sm:table-cell">{m.admin_customer_registered()}</TableHead>
				<TableHead></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each paged as customer (customer.id)}
				<TableRow class={customer.isBlocked ? 'opacity-60' : ''}>
					<TableCell class="text-sm font-medium">
						{customer.name}
						{#if customer.isBlocked}
							<Badge variant="destructive" class="ml-2 text-[10px]"
								>{m.admin_customer_blocked()}</Badge
							>
						{/if}
					</TableCell>
					<TableCell class="text-muted-foreground hidden text-sm md:table-cell"
						>{customer.email}</TableCell
					>
					<TableCell class="text-sm">{customer.orderCount}</TableCell>
					<TableCell class="hidden text-sm sm:table-cell"
						>{formatPrice(customer.totalRevenue)}</TableCell
					>
					<TableCell class="text-muted-foreground hidden text-xs sm:table-cell">
						{new Date(customer.createdAt).toLocaleDateString('de-DE')}
					</TableCell>
					<TableCell>
						<form method="POST" action="?/toggleBlock" use:enhance>
							<input type="hidden" name="customerId" value={customer.id} />
							<button
								type="submit"
								class="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2 transition-colors"
							>
								{customer.isBlocked ? m.admin_unblock_customer() : m.admin_block_customer()}
							</button>
						</form>
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
			{totalPages} ({data.customers.length})
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
