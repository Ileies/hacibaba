<script lang="ts">
	import { cart } from '$lib/states.svelte';
	import type { PageData } from './$types';
	import { formatPrice, localizedName } from '$lib/types';
	import { Button, Separator } from '$lib/components/ui';
	import { Trash2 } from 'lucide-svelte';
	import * as m from '$lib/messages';
	import { env } from '$env/dynamic/public';

	let { data }: { data: PageData } = $props();

	const freeThreshold = parseInt(env.PUBLIC_FREE_SHIPPING_THRESHOLD ?? '5000');
	const shippingCost = parseInt(env.PUBLIC_SHIPPING_COST ?? '590');
	const shipping = $derived(cart.total >= freeThreshold ? 0 : shippingCost);
	const total = $derived(cart.total + shipping);
	const remaining = $derived(Math.max(0, freeThreshold - cart.total));
</script>

<svelte:head><title>{m.shop_cart()} - {m.shop_title()}</title></svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-10">
	<h1 class="mb-8 text-3xl font-bold tracking-tight">{m.shop_cart()}</h1>

	{#if cart.count === 0}
		<div class="py-20 text-center">
			<p class="text-muted-foreground mb-6">{m.shop_cart_empty()}</p>
			<Button href="/products" variant="outline">{m.shop_continue_shopping()}</Button>
		</div>
	{:else}
		{#if remaining > 0}
			<div class="bg-secondary/50 border-border mb-6 rounded-lg border px-4 py-3 text-sm">
				{m.shop_free_shipping_remaining({ amount: formatPrice(remaining) })}
			</div>
		{:else}
			<div
				class="bg-primary/10 border-primary/20 text-primary mb-6 rounded-lg border px-4 py-3 text-sm font-medium"
			>
				{m.shop_free_shipping()} ✓
			</div>
		{/if}

		<div class="mb-8 space-y-1">
			{#each cart.items as item (item.productId)}
				{@const lineName = localizedName(item, data.locale)}
				<div class="border-border flex items-center gap-4 border-b py-4 last:border-0">
					{#if item.imageUrl}
						<img
							src={item.imageUrl}
							alt={lineName}
							class="bg-secondary/30 h-16 w-16 shrink-0 rounded-lg object-cover"
						/>
					{:else}
						<div class="bg-secondary/30 h-16 w-16 shrink-0 rounded-lg"></div>
					{/if}
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium">{lineName}</p>
						<p class="text-muted-foreground mt-0.5 text-xs">
							{formatPrice(item.price)}
							{m.shop_per_piece()}
						</p>
						<p class="text-muted-foreground mt-0.5 text-xs">
							{m.shop_net_amount()}: {formatPrice(item.price - Math.round((item.price * 7) / 107))} &middot;
							{m.shop_vat_7_pct()}: {formatPrice(Math.round((item.price * 7) / 107))}
						</p>
					</div>
					<div class="border-input flex shrink-0 items-center rounded-md border">
						<button
							class="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center text-sm transition-colors"
							aria-label={m.common_qty_decrease()}
							onclick={() => cart.update(item.productId, item.quantity - 1)}>−</button
						>
						<input
							type="number"
							min="1"
							value={item.quantity}
							aria-live="polite"
							class="w-8 [appearance:textfield] bg-transparent text-center text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
							onfocus={(e) => e.currentTarget.select()}
							onkeydown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
							onchange={(e) => {
								const val = parseInt(e.currentTarget.value);
								if (!isNaN(val) && val >= 1) {
									cart.update(item.productId, val);
								} else {
									e.currentTarget.value = String(item.quantity);
								}
							}}
						/>
						<button
							class="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center text-sm transition-colors"
							aria-label={m.common_qty_increase()}
							onclick={() => cart.update(item.productId, item.quantity + 1)}>+</button
						>
					</div>
					<span class="w-16 shrink-0 text-right text-sm font-semibold"
						>{formatPrice(item.price * item.quantity)}</span
					>
					<button
						class="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
						onclick={() => cart.remove(item.productId)}
						aria-label={m.common_remove()}
					>
						<Trash2 size={15} />
					</button>
				</div>
			{/each}
		</div>

		<div class="border-border bg-card mb-6 space-y-3 rounded-lg border p-5">
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">{m.shop_subtotal()}</span>
				<span>{formatPrice(cart.total)}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">{m.shop_shipping_cost()}</span>
				<span>{shipping === 0 ? m.shop_free_shipping() : formatPrice(shipping)}</span>
			</div>
			<Separator />
			<div class="flex justify-between font-semibold">
				<span>{m.shop_total()}</span>
				<span>{formatPrice(total)}</span>
			</div>
			<Separator />
			<div class="text-muted-foreground flex justify-between text-xs">
				<span>{m.shop_net_amount()}</span>
				<span>{formatPrice(total - Math.round((total * 7) / 107))}</span>
			</div>
			<div class="text-muted-foreground flex justify-between text-xs">
				<span>{m.shop_vat_7_pct()}</span>
				<span>{formatPrice(Math.round((total * 7) / 107))}</span>
			</div>
		</div>

		<div class="flex flex-col gap-3 sm:flex-row">
			<Button href="/products" variant="outline" class="flex-1">{m.shop_continue_shopping()}</Button
			>
			<Button href="/checkout" class="flex-1">{m.shop_checkout()}</Button>
		</div>
	{/if}
</div>
