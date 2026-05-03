<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { cart } from '$lib/states.svelte';
	import { formatPrice, localizedName } from '$lib/types';
	import { goto } from '$app/navigation';
	import { Button, Input, Label, Textarea, Separator, Select } from '$lib/components/ui';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { PageData } from './$types';
	import * as m from '$lib/messages';
	import { env } from '$env/dynamic/public';
	import { untrack } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import type { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

	let { data }: { data: PageData } = $props();

	const freeThreshold = parseInt(env.PUBLIC_FREE_SHIPPING_THRESHOLD ?? '5000');
	const shippingCostValue = parseInt(env.PUBLIC_SHIPPING_COST ?? '590');
	const shipping = $derived(cart.total >= freeThreshold ? 0 : shippingCostValue);
	const total = $derived(cart.total + shipping);

	let step = $state<'shipping' | 'payment'>('shipping');
	let orderNumber = $state('');
	let submitting = $state(false);
	let errors = $state<Record<string, string>>({});

	const defaultAddr = untrack(
		() => data.savedAddresses?.find((a) => a.isDefault) ?? data.savedAddresses?.[0] ?? null
	);
	let selectedAddressId = $state<number | 'new'>(defaultAddr ? defaultAddr.id : 'new');

	$effect(() => {
		if (selectedAddressId === 'new') {
			if (data.savedAddresses && data.savedAddresses.length > 0) {
				form.firstName = '';
				form.lastName = '';
				form.street = '';
				form.city = '';
				form.zip = '';
				form.state = '';
				citySuggestions = [];
				zipLookupState = 'idle';
			}
			return;
		}
		const addr = data.savedAddresses?.find((a) => a.id === selectedAddressId);
		if (!addr) return;
		form.firstName = addr.firstName;
		form.lastName = addr.lastName;
		form.street = addr.street;
		form.city = addr.city;
		form.zip = addr.zip;
		form.state = addr.state ?? '';
	});

	let stripeInstance: Stripe | null = null;
	let elementsInstance: StripeElements | null = null;
	let paymentElementInstance: StripePaymentElement | null = null;
	let paymentContainerEl = $state<HTMLDivElement | undefined>(undefined);

	const BUNDESLAENDER = [
		'Baden-Württemberg',
		'Bayern',
		'Berlin',
		'Brandenburg',
		'Bremen',
		'Hamburg',
		'Hessen',
		'Mecklenburg-Vorpommern',
		'Niedersachsen',
		'Nordrhein-Westfalen',
		'Rheinland-Pfalz',
		'Saarland',
		'Sachsen',
		'Sachsen-Anhalt',
		'Schleswig-Holstein',
		'Thüringen'
	];

	const STATE_ABBREV_MAP: Record<string, string> = {
		BE: 'Berlin',
		BY: 'Bayern',
		BW: 'Baden-Württemberg',
		BB: 'Brandenburg',
		HB: 'Bremen',
		HH: 'Hamburg',
		HE: 'Hessen',
		MV: 'Mecklenburg-Vorpommern',
		NI: 'Niedersachsen',
		NW: 'Nordrhein-Westfalen',
		RP: 'Rheinland-Pfalz',
		SL: 'Saarland',
		SN: 'Sachsen',
		ST: 'Sachsen-Anhalt',
		SH: 'Schleswig-Holstein',
		TH: 'Thüringen'
	};

	let citySuggestions = $state<string[]>([]);
	let zipLookupState = $state<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
	let zipAbortController: AbortController | null = null;

	async function lookupZip(zip: string) {
		zipAbortController?.abort();
		if (!/^\d{5}$/.test(zip)) {
			citySuggestions = [];
			zipLookupState = 'idle';
			return;
		}
		zipAbortController = new AbortController();
		zipLookupState = 'loading';
		try {
			const res = await fetch(`https://api.zippopotam.us/de/${zip}`, {
				signal: zipAbortController.signal
			});
			if (!res.ok) {
				zipLookupState = 'invalid';
				citySuggestions = [];
				return;
			}
			const responseData = await res.json();
			type ZipPlace = { 'place name': string; state: string; 'state abbreviation': string };
			const places = responseData.places as ZipPlace[];
			citySuggestions = places.map((p) => p['place name']);
			zipLookupState = places.length > 0 ? 'valid' : 'invalid';
			if (places.length > 0) {
				if (!form.city) form.city = places[0]['place name'];
				form.state = STATE_ABBREV_MAP[places[0]['state abbreviation']] ?? form.state;
			}
		} catch (e) {
			if (e instanceof Error && e.name === 'AbortError') return;
			zipLookupState = 'idle';
			citySuggestions = [];
		}
	}

	let form = $state(
		untrack(() => ({
			firstName: defaultAddr?.firstName ?? data.customer?.name.split(' ')[0] ?? '',
			lastName: defaultAddr?.lastName ?? data.customer?.name.split(' ').slice(1).join(' ') ?? '',
			email: data.customer?.email ?? '',
			phone: '',
			street: defaultAddr?.street ?? '',
			city: defaultAddr?.city ?? '',
			zip: defaultAddr?.zip ?? '',
			state: defaultAddr?.state ?? '',
			country: 'DE',
			notes: '',
			giftMessage: ''
		}))
	);

	onMount(async () => {
		await cart.load();
		if (cart.count === 0) goto('/cart');
	});

	async function handleShippingSubmit() {
		errors = {};
		if (!form.firstName) errors.firstName = m.common_required_field();
		if (!form.lastName) errors.lastName = m.common_required_field();
		if (!form.email) errors.email = m.common_required_field();
		if (!form.street) {
			errors.street = m.common_required_field();
		} else if (!/\d/.test(form.street)) {
			errors.street = m.checkout_street_no_housenumber();
		}
		if (!form.city) errors.city = m.common_required_field();
		if (!form.zip) {
			errors.zip = m.common_required_field();
		} else if (!/^\d{5}$/.test(form.zip)) {
			errors.zip = m.checkout_zip_invalid_format();
		} else if (zipLookupState === 'invalid') {
			errors.zip = m.checkout_zip_not_found();
		}
		if (!form.state) errors.state = m.common_required_field();
		if (Object.keys(errors).length > 0) return;

		submitting = true;
		try {
			const res = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customer: form,
					items: cart.items.map((item) => ({
						productId: item.productId,
						name: localizedName(item, data.locale),
						price: item.price,
						quantity: item.quantity,
						imageUrl: item.imageUrl
					})),
					shippingCost: shipping,
					giftMessage: form.giftMessage || undefined
				})
			});
			if (!res.ok) throw new Error();
			const result = await res.json();
			orderNumber = result.orderNumber;

			stripeInstance = await loadStripe(env.PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');
			if (!stripeInstance) throw new Error('stripe_load_failed');

			elementsInstance = stripeInstance.elements({
				clientSecret: result.clientSecret,
				locale: 'de',
				appearance: {
					theme: 'stripe',
					variables: { colorPrimary: '#c07030', borderRadius: '0.5rem' }
				}
			});
			paymentElementInstance = elementsInstance.create('payment');

			step = 'payment';
			await tick();
			if (paymentContainerEl) {
				paymentElementInstance.mount(paymentContainerEl);
			}
		} catch {
			errors.submit = m.checkout_error_retry();
		} finally {
			submitting = false;
		}
	}

	async function handlePaymentSubmit() {
		if (!stripeInstance || !elementsInstance) return;
		errors = {};
		submitting = true;
		const { error: stripeError } = await stripeInstance.confirmPayment({
			elements: elementsInstance,
			confirmParams: {
				return_url: `${env.PUBLIC_SITE_URL}/checkout/confirmation?order=${orderNumber}`
			}
		});
		if (stripeError) {
			errors.payment = stripeError.message ?? m.checkout_payment_failed();
			submitting = false;
		}
		// On success Stripe redirects automatically
	}

	function goBackToShipping() {
		paymentElementInstance?.unmount();
		paymentElementInstance = null;
		elementsInstance = null;
		stripeInstance = null;
		orderNumber = '';
		errors = {};
		step = 'shipping';
	}
</script>

<svelte:head><title>{m.shop_checkout()} - {m.shop_title()}</title></svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-10">
	<h1 class="mb-8 text-3xl font-bold tracking-tight">{m.shop_checkout()}</h1>

	<!-- Step indicator -->
	<div class="mb-8 flex items-center gap-3">
		<div class="flex items-center gap-2">
			<div
				class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold {step ===
				'shipping'
					? 'bg-primary text-primary-foreground'
					: 'bg-primary/20 text-primary'}"
			>
				1
			</div>
			<span class="text-sm font-medium">{m.shop_shipping_address()}</span>
		</div>
		<div class="bg-border h-px flex-1"></div>
		<div class="flex items-center gap-2">
			<div
				class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold {step ===
				'payment'
					? 'bg-primary text-primary-foreground'
					: 'bg-muted text-muted-foreground'}"
			>
				2
			</div>
			<span class="text-sm {step === 'payment' ? 'font-medium' : 'text-muted-foreground'}"
				>{m.shop_payment()}</span
			>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="lg:col-span-2">
			{#if step === 'shipping'}
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleShippingSubmit();
					}}
					class="space-y-6"
				>
					{#if data.savedAddresses && data.savedAddresses.length > 0}
						<div class="border-border bg-card mb-4 rounded-lg border p-5">
							<h3 class="mb-3 text-sm font-medium">Gespeicherte Adressen</h3>
							<div class="space-y-2">
								{#each data.savedAddresses as addr (addr.id)}
									<label class="flex cursor-pointer items-start gap-3">
										<input
											type="radio"
											bind:group={selectedAddressId}
											value={addr.id}
											class="mt-0.5 shrink-0"
										/>
										<span class="text-sm">
											{#if addr.label}<span class="font-medium">{addr.label} - </span>{/if}
											{addr.firstName}
											{addr.lastName}, {addr.street}, {addr.zip}
											{addr.city}
											{#if addr.isDefault}
												<span class="bg-primary/10 text-primary ml-1 rounded px-1.5 py-0.5 text-xs"
													>{m.account_address_default_badge()}</span
												>
											{/if}
										</span>
									</label>
								{/each}
								<label class="flex cursor-pointer items-center gap-3">
									<input type="radio" bind:group={selectedAddressId} value="new" class="shrink-0" />
									<span class="text-sm">{m.account_address_selector_new()}</span>
								</label>
							</div>
						</div>
					{/if}

					<div class="border-border bg-card rounded-lg border p-6">
						<h2 class="mb-5 font-semibold">{m.shop_shipping_address()}</h2>
						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-1.5">
								<Label for="firstName">{m.shop_first_name()} *</Label>
								<Input
									id="firstName"
									bind:value={form.firstName}
									class={errors.firstName ? 'border-destructive' : ''}
									autocomplete="given-name"
								/>
								{#if errors.firstName}<p class="text-destructive text-xs">
										{errors.firstName}
									</p>{/if}
							</div>
							<div class="space-y-1.5">
								<Label for="lastName">{m.shop_last_name()} *</Label>
								<Input
									id="lastName"
									bind:value={form.lastName}
									class={errors.lastName ? 'border-destructive' : ''}
									autocomplete="family-name"
								/>
								{#if errors.lastName}<p class="text-destructive text-xs">{errors.lastName}</p>{/if}
							</div>
							<div class="col-span-2 space-y-1.5">
								<Label for="email">{m.shop_email()} *</Label>
								<Input
									id="email"
									type="email"
									bind:value={form.email}
									class={errors.email ? 'border-destructive' : ''}
									autocomplete="email"
								/>
								{#if errors.email}<p class="text-destructive text-xs">{errors.email}</p>{/if}
							</div>
							<div class="col-span-2 space-y-1.5">
								<Label for="phone"
									>{m.shop_phone()}
									<span class="text-muted-foreground text-xs">({m.common_optional()})</span></Label
								>
								<Input id="phone" type="tel" bind:value={form.phone} autocomplete="tel" />
							</div>
							<div class="col-span-2 space-y-1.5">
								<Label for="street">{m.shop_street()} *</Label>
								<Input
									id="street"
									bind:value={form.street}
									class={errors.street ? 'border-destructive' : ''}
									autocomplete="street-address"
								/>
								{#if errors.street}<p class="text-destructive text-xs">{errors.street}</p>{/if}
							</div>
							<div class="space-y-1.5">
								<Label for="zip">{m.shop_zip()} *</Label>
								<div class="relative">
									<Input
										id="zip"
										bind:value={form.zip}
										class={errors.zip
											? 'border-destructive'
											: zipLookupState === 'valid'
												? 'border-green-500'
												: ''}
										autocomplete="postal-code"
										inputmode="numeric"
										maxlength={5}
										oninput={() => lookupZip(form.zip)}
									/>
									{#if zipLookupState === 'loading'}
										<div class="absolute top-1/2 right-3 -translate-y-1/2">
											<Spinner class="h-4 w-4" />
										</div>
									{/if}
								</div>
								{#if errors.zip}<p class="text-destructive text-xs">{errors.zip}</p>{/if}
							</div>
							<div class="space-y-1.5">
								<Label for="city">{m.shop_city()} *</Label>
								<Input
									id="city"
									bind:value={form.city}
									list="city-suggestions"
									class={errors.city ? 'border-destructive' : ''}
									autocomplete="address-level2"
								/>
								{#if citySuggestions.length > 0}
									<datalist id="city-suggestions">
										{#each citySuggestions as city (city)}
											<option value={city}></option>
										{/each}
									</datalist>
								{/if}
								{#if errors.city}<p class="text-destructive text-xs">{errors.city}</p>{/if}
							</div>
							<div class="space-y-1.5">
								<Label for="state">{m.shop_state()} *</Label>
								<Select
									id="state"
									bind:value={form.state}
									class={errors.state ? 'border-destructive' : ''}
									autocomplete="address-level1"
								>
									<option value="" disabled>{m.shop_state()}</option>
									{#each BUNDESLAENDER as bl (bl)}
										<option value={bl}>{bl}</option>
									{/each}
								</Select>
								{#if errors.state}<p class="text-destructive text-xs">{errors.state}</p>{/if}
							</div>
							<div class="space-y-1.5">
								<Label>{m.shop_country()}</Label>
								<div
									class="border-input bg-muted text-muted-foreground flex h-10 w-full items-center rounded-md border px-3 text-sm"
								>
									Deutschland
								</div>
							</div>
							<div class="col-span-2 space-y-1.5">
								<Label for="notes"
									>{m.shop_notes()}
									<span class="text-muted-foreground text-xs">({m.common_optional()})</span></Label
								>
								<Textarea id="notes" bind:value={form.notes} rows={2} />
							</div>
							<div class="col-span-2 space-y-1.5">
								<Label for="giftMessage"
									>{m.shop_gift_message()}
									<span class="text-muted-foreground text-xs">({m.common_optional()})</span></Label
								>
								<Textarea
									id="giftMessage"
									bind:value={form.giftMessage}
									rows={2}
									placeholder={m.shop_gift_message_hint()}
								/>
							</div>
						</div>
					</div>

					{#if errors.submit}
						<p
							class="text-destructive border-destructive/30 bg-destructive/10 rounded-lg border px-4 py-3 text-sm"
						>
							{errors.submit}
						</p>
					{/if}

					<Button type="submit" size="lg" class="w-full" disabled={submitting}>
						{#if submitting}<Spinner class="mr-2" />{/if}
						{m.shop_to_payment()}
					</Button>
				</form>
			{:else}
				<div class="space-y-6">
					<!-- Address summary -->
					<div class="border-border bg-card rounded-lg border p-4">
						<div class="flex items-start justify-between gap-4">
							<div class="text-sm">
								<p class="font-medium">{form.firstName} {form.lastName}</p>
								<p class="text-muted-foreground">{form.street}, {form.zip} {form.city}</p>
								<p class="text-muted-foreground">{form.email}</p>
							</div>
							<button
								type="button"
								onclick={goBackToShipping}
								class="text-primary shrink-0 text-xs hover:underline"
							>
								{m.shop_back_to_shipping()}
							</button>
						</div>
					</div>

					<!-- Stripe Payment Element -->
					<div class="border-border bg-card rounded-lg border p-6">
						<h2 class="mb-5 font-semibold">{m.shop_payment_details()}</h2>
						<div bind:this={paymentContainerEl}></div>
					</div>

					{#if errors.payment}
						<p
							class="text-destructive border-destructive/30 bg-destructive/10 rounded-lg border px-4 py-3 text-sm"
						>
							{errors.payment}
						</p>
					{/if}

					<Button
						type="button"
						onclick={handlePaymentSubmit}
						size="lg"
						class="w-full"
						disabled={submitting}
					>
						{#if submitting}<Spinner class="mr-2" />{/if}
						{m.shop_pay_now()} - {formatPrice(total)}
					</Button>
				</div>
			{/if}
		</div>

		<!-- Order summary (#56 with thumbnails) -->
		<div class="border-border bg-card sticky top-24 h-fit space-y-4 rounded-lg border p-5">
			<h2 class="font-semibold">{m.shop_order_summary()}</h2>
			<div class="space-y-2 text-sm">
				{#each cart.items as item (item.productId)}
					{@const lineName = localizedName(item, data.locale)}
					<div class="flex items-center gap-2">
						{#if item.imageUrl}
							<img
								src={item.imageUrl}
								alt={lineName}
								class="h-9 w-9 shrink-0 rounded object-cover"
								loading="lazy"
							/>
						{:else}
							<div class="bg-secondary h-9 w-9 shrink-0 rounded"></div>
						{/if}
						<span class="text-muted-foreground min-w-0 flex-1 truncate"
							>{lineName} ×{item.quantity}</span
						>
						<span class="shrink-0">{formatPrice(item.price * item.quantity)}</span>
					</div>
				{/each}
			</div>
			<Separator />
			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">{m.shop_shipping_cost()}</span>
					<span>{shipping === 0 ? m.shop_free_shipping() : formatPrice(shipping)}</span>
				</div>
				<div class="flex justify-between text-base font-semibold">
					<span>{m.shop_total()}</span>
					<span>{formatPrice(total)}</span>
				</div>
				<p class="text-muted-foreground text-right text-xs">{m.shop_vat_included()}</p>
			</div>
		</div>
	</div>
</div>
