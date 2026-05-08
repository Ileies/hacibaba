<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { Button, Separator, Input, Label, Select } from '$lib/components/ui';
	import { formatPrice } from '$lib/types';
	import {
		User,
		Package,
		Lock,
		Mail,
		Download,
		Trash2,
		ExternalLink,
		LogOut,
		ChevronRight,
		MapPin
	} from 'lucide-svelte';
	import * as m from '$lib/messages';
	import { cart } from '$lib/states.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function vatAmount(total: number) {
		return Math.round((total * 7) / 107);
	}
	function netAmount(total: number) {
		return total - vatAmount(total);
	}
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

	let deleting = $state(false);
	let changingPassword = $state(false);
	let expandedOrders = new SvelteSet<number>();
	let activeSection = $state('orders');
	let showAddressForm = $state(false);
	let editingAddressId = $state<number | null>(null);
	let addressFormData = $state({
		label: '',
		firstName: '',
		lastName: '',
		street: '',
		city: '',
		zip: '',
		state: '',
		isDefault: false
	});

	type Section = 'orders' | 'addresses' | 'profile' | 'security' | 'newsletter' | 'privacy';

	const navItems: { id: Section; label: string; icon: typeof User }[] = [
		{ id: 'orders', label: m.shop_my_orders(), icon: Package },
		{ id: 'addresses', label: m.account_addresses_heading(), icon: MapPin },
		{ id: 'profile', label: 'Profil', icon: User },
		{ id: 'security', label: m.account_password_change_heading(), icon: Lock },
		{ id: 'newsletter', label: m.account_newsletter_heading(), icon: Mail },
		{ id: 'privacy', label: m.account_export_heading(), icon: Download }
	];

	function toggleOrder(id: number) {
		if (expandedOrders.has(id)) {
			expandedOrders.delete(id);
		} else {
			expandedOrders.add(id);
		}
	}

	function setSection(id: Section) {
		activeSection = id;
		if (typeof window !== 'undefined') {
			history.replaceState(null, '', `#${id}`);
		}
	}

	onMount(() => {
		const hash = window.location.hash.slice(1) as Section;
		const valid: Section[] = [
			'orders',
			'addresses',
			'profile',
			'security',
			'newsletter',
			'privacy'
		];
		if (valid.includes(hash)) activeSection = hash;
	});

	$effect(() => {
		if (form?.passwordSuccess) activeSection = 'security';
	});

	$effect(() => {
		if (form?.addressSaved) {
			showAddressForm = false;
			editingAddressId = null;
		}
	});
</script>

<svelte:head><title>{m.shop_my_account()} - {m.shop_title()}</title></svelte:head>

<div class="mx-auto max-w-5xl px-4 py-10">
	<div class="flex min-h-[calc(100svh-9rem)] gap-8">
		<!-- Sidebar -->
		<aside class="w-56 shrink-0">
			<!-- Profile card -->
			<div class="bg-card border-border mb-4 rounded-lg border p-4">
				<div
					class="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
				>
					<User size={20} class="text-primary" />
				</div>
				<p class="text-center text-sm font-semibold">{data.customer.name}</p>
				<p class="text-muted-foreground mt-0.5 text-center text-xs">{data.customer.email}</p>
			</div>

			<!-- Nav -->
			<nav class="space-y-0.5">
				{#each navItems as item (item.id)}
					<button
						onclick={() => setSection(item.id)}
						class="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
						{activeSection === item.id
							? 'bg-primary/10 text-primary'
							: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
					>
						<item.icon size={15} class="shrink-0" />
						<span class="truncate">{item.label}</span>
						{#if activeSection === item.id}
							<ChevronRight size={14} class="ml-auto shrink-0" />
						{/if}
					</button>
				{/each}
			</nav>

			<Separator class="my-3" />

			<form
				action="/auth/logout"
				method="POST"
				use:enhance={() => {
					cart.clear();
				}}
			>
				<button
					type="submit"
					class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
				>
					<LogOut size={15} class="shrink-0" />
					{m.shop_logout()}
				</button>
			</form>
		</aside>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<!-- Orders -->
			{#if activeSection === 'orders'}
				<div>
					<h2 class="mb-5 text-xl font-semibold">{m.shop_my_orders()}</h2>

					{#if data.orders.length === 0}
						<div
							class="border-border bg-card text-muted-foreground rounded-lg border p-10 text-center text-sm"
						>
							<Package size={32} class="mx-auto mb-3 opacity-30" />
							<p>{m.shop_no_orders()}</p>
							<Button href="/products" variant="outline" size="sm" class="mt-4"
								>{m.shop_shop_now()}</Button
							>
						</div>
					{:else}
						<div class="space-y-2">
							{#each data.orders as order (order.id)}
								<div class="border-border bg-card rounded-lg border">
									<button
										class="flex w-full cursor-pointer items-center gap-4 p-4 text-left"
										onclick={() => toggleOrder(order.id)}
									>
										<div class="min-w-0 flex-1">
											<p class="font-mono text-sm font-medium">{order.orderNumber}</p>
											<p class="text-muted-foreground mt-0.5 text-xs">
												{new Date(order.createdAt).toLocaleDateString('de-DE')}
											</p>
										</div>
										<div class="flex items-center gap-3">
											<span class="text-sm font-medium">{formatPrice(order.total)}</span>
											<span
												class="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
											>
												{order.status}
											</span>
											<ChevronRight
												size={14}
												class="text-muted-foreground transition-transform {expandedOrders.has(
													order.id
												)
													? 'rotate-90'
													: ''}"
											/>
										</div>
									</button>
									{#if expandedOrders.has(order.id)}
										<div class="border-border border-t px-4 pb-4">
											<div class="space-y-1.5 pt-3">
												<div
													class="text-muted-foreground mb-1 grid grid-cols-[1fr_auto_auto] gap-x-4 text-xs font-medium tracking-wide uppercase"
												>
													<span>Produkt</span>
													<span class="text-right">{m.shop_unit_price()}</span>
													<span class="text-right">Gesamt</span>
												</div>
												{#each order.items as item (item.id)}
													<div class="grid grid-cols-[1fr_auto_auto] gap-x-4 text-sm">
														<span class="text-muted-foreground truncate"
															>{item.productName} × {item.quantity}</span
														>
														<span class="text-muted-foreground text-right"
															>{formatPrice(item.unitPrice)}</span
														>
														<span class="text-right">{formatPrice(item.totalPrice)}</span>
													</div>
												{/each}
												<Separator class="my-1" />
												<div class="flex justify-between text-sm">
													<span class="text-muted-foreground">{m.shop_shipping_cost()}</span>
													<span
														>{order.shippingCost === 0
															? m.shop_free_shipping()
															: formatPrice(order.shippingCost)}</span
													>
												</div>
												<Separator class="my-1" />
												<div class="text-muted-foreground flex justify-between text-xs">
													<span>{m.shop_net_amount()}</span>
													<span>{formatPrice(netAmount(order.total))}</span>
												</div>
												<div class="text-muted-foreground flex justify-between text-xs">
													<span>{m.shop_vat_7_pct()}</span>
													<span>{formatPrice(vatAmount(order.total))}</span>
												</div>
												<div class="flex justify-between text-sm font-semibold">
													<span>{m.shop_total()}</span>
													<span>{formatPrice(order.total)}</span>
												</div>
											</div>
											{#if order.trackingNumber}
												<a
													href="https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?idc={order.trackingNumber}"
													target="_blank"
													rel="noopener noreferrer"
													class="text-primary mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs hover:underline"
												>
													<ExternalLink size={12} />
													{m.account_order_track()} ({order.trackingNumber})
												</a>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Addresses -->
			{:else if activeSection === 'addresses'}
				<div>
					<div class="mb-5 flex items-center justify-between">
						<h2 class="text-xl font-semibold">{m.account_addresses_heading()}</h2>
						{#if !showAddressForm}
							<Button
								onclick={() => {
									showAddressForm = true;
									editingAddressId = null;
									addressFormData = {
										label: '',
										firstName: '',
										lastName: '',
										street: '',
										city: '',
										zip: '',
										state: '',
										isDefault: false
									};
								}}
								size="sm">{m.account_address_add()}</Button
							>
						{/if}
					</div>

					{#if form?.addressSaved}
						<div class="bg-primary/10 text-primary mb-4 rounded-md px-4 py-3 text-sm">
							{m.account_address_saved()}
						</div>
					{/if}
					{#if form?.addressDeleted}
						<div class="bg-primary/10 text-primary mb-4 rounded-md px-4 py-3 text-sm">
							{m.account_address_deleted()}
						</div>
					{/if}

					{#if showAddressForm}
						<form
							method="POST"
							action={editingAddressId ? '?/updateAddress' : '?/addAddress'}
							use:enhance={() => {
								return async ({ update }) => {
									await update();
								};
							}}
							class="border-border bg-card mb-6 space-y-4 rounded-lg border p-5"
						>
							{#if editingAddressId}
								<input type="hidden" name="id" value={editingAddressId} />
							{/if}
							<h3 class="font-medium">
								{editingAddressId ? m.account_address_edit() : m.account_address_add()}
							</h3>
							<div class="space-y-1.5">
								<Label for="addrLabel"
									>{m.account_address_label()}
									<span class="text-muted-foreground text-xs">({m.common_optional()})</span></Label
								>
								<Input
									id="addrLabel"
									name="label"
									bind:value={addressFormData.label}
									placeholder={m.account_address_label_hint()}
								/>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div class="space-y-1.5">
									<Label for="addrFirstName">{m.shop_first_name()} *</Label>
									<Input
										id="addrFirstName"
										name="firstName"
										bind:value={addressFormData.firstName}
										required
									/>
								</div>
								<div class="space-y-1.5">
									<Label for="addrLastName">{m.shop_last_name()} *</Label>
									<Input
										id="addrLastName"
										name="lastName"
										bind:value={addressFormData.lastName}
										required
									/>
								</div>
								<div class="col-span-2 space-y-1.5">
									<Label for="addrStreet">{m.shop_street()} *</Label>
									<Input
										id="addrStreet"
										name="street"
										bind:value={addressFormData.street}
										required
									/>
								</div>
								<div class="space-y-1.5">
									<Label for="addrZip">{m.shop_zip()} *</Label>
									<Input id="addrZip" name="zip" bind:value={addressFormData.zip} required />
								</div>
								<div class="space-y-1.5">
									<Label for="addrCity">{m.shop_city()} *</Label>
									<Input id="addrCity" name="city" bind:value={addressFormData.city} required />
								</div>
								<div class="col-span-2 space-y-1.5">
									<Label for="addrState">{m.shop_state()}</Label>
									<Select id="addrState" name="state" bind:value={addressFormData.state}>
										<option value="">{m.shop_state()}</option>
										{#each BUNDESLAENDER as bl (bl)}
											<option value={bl}>{bl}</option>
										{/each}
									</Select>
								</div>
							</div>
							<label class="flex cursor-pointer items-center gap-2 text-sm">
								<input type="checkbox" name="setDefault" bind:checked={addressFormData.isDefault} />
								<span>{m.account_address_set_default()}</span>
							</label>
							{#if form?.addressError === 'missing_fields'}
								<p class="text-destructive text-sm">Bitte alle Pflichtfelder ausfüllen.</p>
							{/if}
							<div class="flex gap-2">
								<Button type="submit">{m.common_save()}</Button>
								<Button
									type="button"
									variant="outline"
									onclick={() => {
										showAddressForm = false;
										editingAddressId = null;
									}}>{m.common_cancel()}</Button
								>
							</div>
						</form>
					{/if}

					{#if data.addresses.length === 0 && !showAddressForm}
						<div
							class="border-border bg-card text-muted-foreground rounded-lg border p-10 text-center text-sm"
						>
							<MapPin size={32} class="mx-auto mb-3 opacity-30" />
							<p>{m.account_addresses_empty()}</p>
						</div>
					{:else if data.addresses.length > 0}
						<div class="space-y-3">
							{#each data.addresses as addr (addr.id)}
								<div class="border-border bg-card rounded-lg border p-4">
									<div class="flex items-start justify-between gap-4">
										<div class="text-sm">
											<div class="mb-1 flex items-center gap-2">
												{#if addr.label}
													<span class="font-medium">{addr.label}</span>
												{/if}
												{#if addr.isDefault}
													<span
														class="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium"
														>{m.account_address_default_badge()}</span
													>
												{/if}
											</div>
											<p>{addr.firstName} {addr.lastName}</p>
											<p class="text-muted-foreground">{addr.street}</p>
											<p class="text-muted-foreground">
												{addr.zip}
												{addr.city}{addr.state ? `, ${addr.state}` : ''}
											</p>
										</div>
										<div class="flex shrink-0 flex-col items-end gap-1.5">
											{#if !addr.isDefault}
												<form method="POST" action="?/setDefaultAddress" use:enhance>
													<input type="hidden" name="id" value={addr.id} />
													<button
														type="submit"
														class="text-primary cursor-pointer text-xs hover:underline"
														>{m.account_address_set_default()}</button
													>
												</form>
											{/if}
											<button
												type="button"
												onclick={() => {
													editingAddressId = addr.id;
													addressFormData = {
														label: addr.label ?? '',
														firstName: addr.firstName,
														lastName: addr.lastName,
														street: addr.street,
														city: addr.city,
														zip: addr.zip,
														state: addr.state ?? '',
														isDefault: addr.isDefault
													};
													showAddressForm = true;
												}}
												class="text-muted-foreground hover:text-foreground cursor-pointer text-xs hover:underline"
											>
												{m.common_edit()}
											</button>
											<form method="POST" action="?/deleteAddress" use:enhance>
												<input type="hidden" name="id" value={addr.id} />
												<button
													type="submit"
													class="text-destructive cursor-pointer text-xs hover:underline"
													>{m.common_delete()}</button
												>
											</form>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Profile -->
			{:else if activeSection === 'profile'}
				<div class="max-w-md">
					<h2 class="mb-1 text-xl font-semibold">Profil bearbeiten</h2>
					<p class="text-muted-foreground mb-6 text-sm">
						Dein Name wird beim Checkout automatisch eingetragen.
					</p>

					{#if form?.profileSuccess}
						<div class="bg-primary/10 text-primary mb-4 rounded-md px-4 py-3 text-sm font-medium">
							Name erfolgreich aktualisiert.
						</div>
					{/if}
					{#if form?.profileError === 'missing_fields'}
						<div class="bg-destructive/10 text-destructive mb-4 rounded-md px-4 py-3 text-sm">
							Bitte Vor- und Nachname ausfüllen.
						</div>
					{/if}

					<form method="POST" action="?/updateProfile" use:enhance class="space-y-4">
						<div class="space-y-1.5">
							<Label for="profileFirstName">{m.shop_first_name()}</Label>
							<Input
								id="profileFirstName"
								name="firstName"
								type="text"
								value={data.customer.name.split(' ')[0]}
								autocomplete="given-name"
								required
							/>
						</div>
						<div class="space-y-1.5">
							<Label for="profileLastName">{m.shop_last_name()}</Label>
							<Input
								id="profileLastName"
								name="lastName"
								type="text"
								value={data.customer.name.split(' ').slice(1).join(' ')}
								autocomplete="family-name"
								required
							/>
						</div>
						<div class="space-y-1.5">
							<Label>{m.shop_email()}</Label>
							<div
								class="border-input bg-muted text-muted-foreground flex h-10 w-full items-center rounded-md border px-3 text-sm"
							>
								{data.customer.email}
							</div>
						</div>
						<Button type="submit">{m.common_save()}</Button>
					</form>
				</div>

				<!-- Security -->
			{:else if activeSection === 'security'}
				<div class="max-w-md">
					<h2 class="mb-1 text-xl font-semibold">{m.account_password_change_heading()}</h2>
					<p class="text-muted-foreground mb-6 text-sm">
						Vergib ein neues sicheres Passwort fur deinen Account.
					</p>

					{#if form?.passwordSuccess}
						<div class="bg-primary/10 text-primary mb-4 rounded-md px-4 py-3 text-sm font-medium">
							{m.account_password_changed()}
						</div>
					{/if}
					{#if form?.passwordError === 'wrong'}
						<div class="bg-destructive/10 text-destructive mb-4 rounded-md px-4 py-3 text-sm">
							{m.account_password_wrong()}
						</div>
					{:else if form?.passwordError === 'mismatch'}
						<div class="bg-destructive/10 text-destructive mb-4 rounded-md px-4 py-3 text-sm">
							{m.account_password_mismatch()}
						</div>
					{:else if form?.passwordError === 'invalid'}
						<div class="bg-destructive/10 text-destructive mb-4 rounded-md px-4 py-3 text-sm">
							{m.shop_password_min_8()}
						</div>
					{/if}

					<form
						method="POST"
						action="?/changePassword"
						use:enhance={() => {
							changingPassword = true;
							return async ({ update }) => {
								await update();
								changingPassword = false;
							};
						}}
						class="space-y-4"
					>
						<div class="space-y-1.5">
							<Label for="currentPassword">{m.account_current_password()}</Label>
							<Input
								id="currentPassword"
								name="currentPassword"
								type="password"
								autocomplete="current-password"
							/>
						</div>
						<div class="space-y-1.5">
							<Label for="newPassword">{m.account_new_password()}</Label>
							<Input
								id="newPassword"
								name="newPassword"
								type="password"
								autocomplete="new-password"
							/>
						</div>
						<div class="space-y-1.5">
							<Label for="confirmPassword">{m.account_confirm_password()}</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autocomplete="new-password"
							/>
						</div>
						<Button type="submit" disabled={changingPassword}>{m.common_save()}</Button>
					</form>
				</div>

				<!-- Newsletter -->
			{:else if activeSection === 'newsletter'}
				<div class="max-w-md">
					<h2 class="mb-1 text-xl font-semibold">{m.account_newsletter_heading()}</h2>
					<p class="text-muted-foreground mb-6 text-sm">
						{data.isNewsletterSubscribed ? m.account_newsletter_on() : m.account_newsletter_off()}
					</p>

					<div class="bg-card border-border rounded-lg border p-5">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium">{m.account_newsletter_heading()}</p>
								<p class="text-muted-foreground mt-0.5 text-xs">
									{data.isNewsletterSubscribed ? 'Aktiv' : 'Inaktiv'}
								</p>
							</div>
							<form method="POST" action="?/toggleNewsletter" use:enhance>
								<Button
									type="submit"
									variant={data.isNewsletterSubscribed ? 'outline' : 'default'}
									size="sm"
								>
									{data.isNewsletterSubscribed
										? m.account_newsletter_unsubscribe_btn()
										: m.account_newsletter_subscribe_btn()}
								</Button>
							</form>
						</div>
					</div>
				</div>

				<!-- Privacy -->
			{:else if activeSection === 'privacy'}
				<div class="max-w-md">
					<h2 class="mb-6 text-xl font-semibold">Daten & Datenschutz</h2>

					<!-- Export -->
					<div class="bg-card border-border mb-4 rounded-lg border p-5">
						<div class="mb-3 flex items-start gap-3">
							<div class="bg-muted mt-0.5 flex h-8 w-8 items-center justify-center rounded-md">
								<Download size={15} />
							</div>
							<div>
								<p class="text-sm font-semibold">{m.account_export_heading()}</p>
								<p class="text-muted-foreground mt-0.5 text-sm">{m.account_export_desc()}</p>
							</div>
						</div>
						<Button href="/api/account/export" variant="outline" size="sm">
							{m.account_export_button()}
						</Button>
					</div>

					<!-- Delete -->
					<div class="border-destructive/30 rounded-lg border p-5">
						<div class="mb-3 flex items-start gap-3">
							<div
								class="bg-destructive/10 mt-0.5 flex h-8 shrink-0 items-center justify-center rounded-md px-2.5"
							>
								<Trash2 size={15} class="text-destructive" />
							</div>
							<div>
								<p class="text-destructive text-sm font-semibold">{m.account_delete_heading()}</p>
								<p class="text-muted-foreground mt-0.5 text-sm">{m.account_delete_warning()}</p>
							</div>
						</div>
						<form
							method="POST"
							action="?/deleteAccount"
							use:enhance={() => {
								deleting = true;
								cart.clear();
								return async ({ update }) => {
									await update();
									deleting = false;
								};
							}}
						>
							<label class="mb-4 flex cursor-pointer items-start gap-2 text-sm">
								<input type="checkbox" name="confirmed" class="mt-0.5 shrink-0" required />
								<span>{m.account_delete_confirm_label()}</span>
							</label>
							<Button type="submit" variant="destructive" size="sm" disabled={deleting}>
								{m.account_delete_button()}
							</Button>
						</form>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
