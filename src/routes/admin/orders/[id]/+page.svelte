<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { Button, Select, Separator } from '$lib/components/ui';
	import { formatPrice } from '$lib/types';
	import BackLink from '$lib/components/BackLink.svelte';
	import * as m from '$lib/messages';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function vatAmount(total: number) {
		return Math.round((total * 7) / 107);
	}
	function netAmount(total: number) {
		return total - vatAmount(total);
	}
</script>

<svelte:head><title>{data.order.orderNumber} - Admin</title></svelte:head>

<BackLink href="/admin/orders" />

<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
	<div class="space-y-4 lg:col-span-2">
		<div class="border-border bg-card rounded-lg border p-6">
			<h1 class="font-mono text-xl font-semibold">{data.order.orderNumber}</h1>
			<p class="text-muted-foreground mt-1 text-sm">
				{new Date(data.order.createdAt).toLocaleString('de-DE')}
			</p>

			<Separator class="my-5" />

			<h2 class="mb-3 text-sm font-medium">{m.common_items()}</h2>
			<div class="space-y-2">
				<div
					class="text-muted-foreground mb-1 grid grid-cols-[1fr_auto_auto] gap-x-6 text-xs font-medium tracking-wide uppercase"
				>
					<span>Produkt</span>
					<span class="text-right">{m.shop_unit_price()}</span>
					<span class="text-right">Gesamt</span>
				</div>
				{#each data.items as item (item.id)}
					<div class="grid grid-cols-[1fr_auto_auto] gap-x-6 text-sm">
						<span class="text-muted-foreground">{item.productName} × {item.quantity}</span>
						<span class="text-muted-foreground text-right">{formatPrice(item.unitPrice)}</span>
						<span class="text-right">{formatPrice(item.totalPrice)}</span>
					</div>
				{/each}
				<Separator class="my-2" />
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">{m.shop_shipping_cost()}</span>
					<span
						>{data.order.shippingCost === 0
							? m.shop_free_shipping()
							: formatPrice(data.order.shippingCost)}</span
					>
				</div>
				<Separator class="my-2" />
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">{m.shop_net_amount()}</span>
					<span>{formatPrice(netAmount(data.order.total))}</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">{m.shop_vat_7_pct()}</span>
					<span>{formatPrice(vatAmount(data.order.total))}</span>
				</div>
				<div class="flex justify-between font-semibold">
					<span>{m.shop_total()} (brutto)</span>
					<span>{formatPrice(data.order.total)}</span>
				</div>
			</div>
		</div>

		<div class="border-border bg-card rounded-lg border p-6">
			<h2 class="mb-3 text-sm font-medium">{m.shop_shipping_address()}</h2>
			{#if data.shippingAddress}
				<address class="text-muted-foreground text-sm leading-relaxed not-italic">
					{data.shippingAddress.firstName}
					{data.shippingAddress.lastName}<br />
					{data.shippingAddress.street}<br />
					{data.shippingAddress.zip}
					{data.shippingAddress.city}<br />
					{#if data.shippingAddress.state}{data.shippingAddress.state}<br />{/if}
					{data.shippingAddress.country}
				</address>
			{/if}
			{#if data.order.customerPhone}<p class="text-muted-foreground mt-2 text-sm">
					{data.order.customerPhone}
				</p>{/if}
			{#if data.order.notes}<p class="text-muted-foreground mt-3 text-sm italic">
					"{data.order.notes}"
				</p>{/if}
			{#if data.order.giftMessage}
				<p class="text-muted-foreground mt-2 text-sm">
					<span class="font-medium">Geschenknachricht:</span>
					{data.order.giftMessage}
				</p>
			{/if}
		</div>
	</div>

	<div class="space-y-4">
		<div class="border-border bg-card rounded-lg border p-5">
			<h2 class="mb-4 text-sm font-medium">{m.admin_order_status()}</h2>
			{#if form?.error}<p class="text-destructive mb-2 text-xs">{m.common_error()}</p>{/if}
			<form method="POST" action="?/updateStatus" use:enhance class="space-y-3">
				<Select name="status" value={data.order.status}>
					<option value="pending">{m.admin_order_status_pending()}</option>
					<option value="confirmed">{m.admin_order_status_confirmed()}</option>
					<option value="shipped">{m.admin_order_status_shipped()}</option>
					<option value="delivered">{m.admin_order_status_delivered()}</option>
					<option value="cancelled">{m.admin_order_status_cancelled()}</option>
				</Select>
				<div class="space-y-1">
					<label for="trackingNumber" class="text-muted-foreground text-xs"
						>{m.admin_tracking_number()} ({m.common_optional()})</label
					>
					<input
						id="trackingNumber"
						name="trackingNumber"
						type="text"
						value={data.order.trackingNumber ?? ''}
						placeholder="1Z999AA10123456784"
						class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-1.5 text-sm focus-visible:ring-1 focus-visible:outline-none"
					/>
				</div>
				<Button type="submit" size="sm" class="w-full">{m.common_save()}</Button>
			</form>
		</div>

		<div class="border-border bg-card rounded-lg border p-5">
			<h2 class="mb-4 text-sm font-medium">{m.admin_payment_status()}</h2>
			<form method="POST" action="?/updatePayment" use:enhance class="space-y-3">
				<Select name="paymentStatus" value={data.order.paymentStatus}>
					<option value="pending">{m.admin_payment_pending()}</option>
					<option value="paid">{m.admin_payment_paid()}</option>
					<option value="failed">{m.admin_payment_failed_status()}</option>
					<option value="refunded">{m.admin_payment_refunded()}</option>
				</Select>
				<Button type="submit" size="sm" class="w-full">{m.common_save()}</Button>
			</form>
		</div>

		<!-- Internal notes (#123) -->
		<div class="border-border bg-card rounded-lg border p-5">
			<h2 class="mb-3 text-sm font-medium">{m.admin_internal_notes()}</h2>
			{#if form?.notesSaved}<p class="text-primary mb-2 text-xs">{m.admin_notes_saved()}</p>{/if}
			<form method="POST" action="?/saveNotes" use:enhance class="space-y-3">
				<textarea
					name="adminNotes"
					rows={4}
					class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
					placeholder="Interne Notiz...">{data.order.adminNotes ?? ''}</textarea
				>
				<Button type="submit" size="sm" class="w-full">{m.common_save()}</Button>
			</form>
		</div>
	</div>
</div>
