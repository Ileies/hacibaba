<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { ShoppingCart, User, Search, ArrowUp, MessageCircle, Menu, X } from 'lucide-svelte';
	import { cart } from '$lib/states.svelte';
	import { Button } from '$lib/components/ui';
	import Toaster from '$lib/components/Toaster.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import * as m from '$lib/messages';
	import { EMAIL_INFO } from '$lib/constants';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let newsletterEmail = $state('');
	let newsletterState = $state<'idle' | 'loading' | 'success' | 'duplicate' | 'invalid'>('idle');
	let scrollY = $state(0);
	let mobileMenuOpen = $state(false);

	async function subscribeNewsletter(e: SubmitEvent) {
		e.preventDefault();
		if (newsletterState === 'loading') return;
		newsletterState = 'loading';
		const res = await fetch('/api/newsletter', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: newsletterEmail })
		});
		const data = await res.json();
		if (res.ok) {
			newsletterState = 'success';
			newsletterEmail = '';
		} else {
			newsletterState = data.error === 'already_subscribed' ? 'duplicate' : 'invalid';
		}
	}

	onMount(() => {
		void cart.load();
	});

	const orgJsonLd = $derived(
		`<script type="application/ld+json">${JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'Hacibaba',
			url: data.siteOrigin,
			logo: `${data.siteOrigin}/logo.webp`,
			foundingDate: '1988',
			contactPoint: {
				'@type': 'ContactPoint',
				contactType: 'customer service',
				email: EMAIL_INFO
			}
		})}<` + `/script>`
	);
</script>

<svelte:head>
	<meta
		name="description"
		content="Hacibaba - Authentisches türkisches Lokum seit 1988. Traditionelle Familienrezepte, direkt aus der Türkei. Jetzt online bestellen."
	/>
	<meta property="og:site_name" content="Hacibaba" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/logo.webp" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:image" content="/logo.webp" />
	<!-- Hreflang (#80) -->
	<link rel="alternate" hreflang="de" href="{data.siteOrigin}{data.pathname ?? ''}" />
	<link rel="alternate" hreflang="en" href="{data.siteOrigin}{data.pathname ?? ''}" />
	<link rel="alternate" hreflang="tr" href="{data.siteOrigin}{data.pathname ?? ''}" />
	<link rel="alternate" hreflang="x-default" href="{data.siteOrigin}{data.pathname ?? ''}" />
	<!-- Organization JSON-LD (#77) -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html orgJsonLd}
</svelte:head>

<svelte:window bind:scrollY />

<a
	href="#main-content"
	class="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
>
	{m.common_skip_to_content()}
</a>

<div class="bg-background text-foreground flex min-h-screen flex-col">
	<!-- Header -->
	<header
		class="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur transition-shadow duration-200 {scrollY >
		10
			? 'shadow-sm'
			: ''}"
	>
		<div class="container mx-auto flex h-16 items-center gap-4 px-4">
			<a href="/" class="flex shrink-0 items-center gap-3 text-lg font-bold tracking-tight">
				<img src="/logo.webp" alt="Hacibaba" class="h-10 w-auto" />
				Hacibaba
			</a>

			<!-- Desktop search -->
			<form
				action="/products"
				method="get"
				class="relative hidden max-w-sm flex-1 items-center md:flex"
			>
				<Search size={15} class="text-muted-foreground pointer-events-none absolute left-3" />
				<input
					type="search"
					name="q"
					placeholder={m.shop_search_placeholder()}
					aria-label={m.common_search()}
					class="border-input bg-secondary/30 placeholder:text-muted-foreground focus:ring-ring focus:bg-background h-9 w-full rounded-full border pr-3 pl-9 text-sm transition-colors focus:ring-2 focus:outline-none"
				/>
			</form>

			<div class="ml-auto flex items-center gap-1">
				<!-- Language switcher (#86) -->
				<div class="hidden md:flex">
					<LanguageSwitcher locale={data.locale} />
				</div>

				{#if data.customer}
					<a
						href="/account"
						class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors"
					>
						<User size={16} />
						<span class="hidden sm:inline">{data.customer.name.split(' ')[0]}</span>
					</a>
				{:else}
					<a
						href="/auth/login"
						class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors"
					>
						{m.shop_login()}
					</a>
				{/if}

				<a
					href="/products"
					class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors md:hidden"
					aria-label={m.common_search()}
				>
					<Search size={18} />
				</a>

				<!-- Hamburger button (mobile) -->
				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label={mobileMenuOpen ? m.common_menu_close() : m.common_menu_open()}
					aria-expanded={mobileMenuOpen}
					class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors md:hidden"
				>
					{#if mobileMenuOpen}
						<X size={20} />
					{:else}
						<Menu size={20} />
					{/if}
				</button>

				<a
					href="/cart"
					aria-label={m.shop_cart()}
					class="text-muted-foreground hover:text-foreground hover:bg-accent relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
				>
					<ShoppingCart size={18} />
					{#if cart.count > 0}
						<span
							class="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
						>
							{cart.count > 9 ? '9+' : cart.count}
						</span>
					{/if}
				</a>
			</div>
		</div>
	</header>

	<!-- Mobile nav drawer (#108) -->
	{#if mobileMenuOpen}
		<div
			class="fixed inset-0 z-40 md:hidden"
			role="dialog"
			aria-modal="true"
			aria-label={m.common_menu()}
		>
			<!-- Backdrop -->
			<button
				class="absolute inset-0 cursor-pointer bg-black/30"
				onclick={() => (mobileMenuOpen = false)}
				aria-label={m.common_menu_close()}
				tabindex="-1"
			></button>
			<!-- Drawer -->
			<nav class="bg-background absolute top-16 right-0 bottom-0 left-0 overflow-y-auto shadow-xl">
				<div class="divide-border flex flex-col divide-y">
					<a
						href="/products"
						onclick={() => (mobileMenuOpen = false)}
						class="hover:bg-accent px-6 py-4 text-base font-medium transition-colors"
					>
						{m.shop_nav_products()}
					</a>
					<a
						href="/faq"
						onclick={() => (mobileMenuOpen = false)}
						class="hover:bg-accent px-6 py-4 text-base font-medium transition-colors"
					>
						{m.shop_nav_faq()}
					</a>
					<a
						href="/kontakt"
						onclick={() => (mobileMenuOpen = false)}
						class="hover:bg-accent px-6 py-4 text-base font-medium transition-colors"
					>
						{m.shop_nav_contact()}
					</a>
					<div class="px-6 py-4">
						{#if data.customer}
							<a
								href="/account"
								onclick={() => (mobileMenuOpen = false)}
								class="text-muted-foreground flex items-center gap-2 text-sm"
							>
								<User size={16} />
								{data.customer.name}
							</a>
						{:else}
							<a
								href="/auth/login"
								onclick={() => (mobileMenuOpen = false)}
								class="text-muted-foreground text-sm"
							>
								{m.shop_login()}
							</a>
						{/if}
					</div>
					<!-- Language switcher in drawer -->
					<div class="px-3 py-3">
						<LanguageSwitcher locale={data.locale} variant="inline" />
					</div>
				</div>
			</nav>
		</div>
	{/if}

	<main id="main-content" tabindex="-1" class="flex-1">{@render children()}</main>
	<Toaster />
	<CookieBanner show={data.showCookieBanner} />

	<!-- WhatsApp floating button (#138) -->
	<a
		href="https://wa.me/4915123456789"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="WhatsApp"
		class="fixed right-4 bottom-20 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:bg-[#1ebe5e] md:right-6 md:bottom-6"
	>
		<MessageCircle size={22} />
	</a>

	<!-- Back to top button (#114) -->
	{#if scrollY > 300}
		<button
			onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			aria-label={m.common_back_to_top()}
			class="bg-background border-border text-muted-foreground hover:text-foreground fixed right-4 bottom-36 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border shadow-md transition-all duration-200 md:right-6 md:bottom-20"
		>
			<ArrowUp size={18} />
		</button>
	{/if}

	<!-- Footer -->
	<footer class="border-border bg-secondary/30 border-t text-sm">
		<!-- Main columns -->
		<div
			class="container mx-auto grid grid-cols-2 gap-x-8 gap-y-8 px-4 py-10 md:grid-cols-[2fr_1fr]"
		>
			<!-- Brand + Newsletter -->
			<div class="col-span-2 flex flex-col gap-5 md:col-span-1">
				<div>
					<a href="/" class="mb-2 flex items-center gap-2.5 font-semibold">
						<img src="/logo.webp" alt="Hacibaba" class="h-8 w-auto" />
						Hacibaba
					</a>
					<p class="text-muted-foreground">
						{m.footer_brand_desc({ years: new Date().getFullYear() - 1988 })}
					</p>
				</div>

				<div>
					<p class="mb-2 font-medium">{m.footer_newsletter_heading()}</p>
					<form onsubmit={subscribeNewsletter} class="flex max-w-[260px] gap-2">
						<input
							type="email"
							bind:value={newsletterEmail}
							placeholder={m.footer_newsletter_placeholder()}
							required
							disabled={newsletterState === 'loading' || newsletterState === 'success'}
							class="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-8 min-w-0 flex-1 rounded-md border px-3 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
						/>
						<Button
							type="submit"
							size="sm"
							class="h-8 shrink-0 px-3 text-xs"
							disabled={newsletterState === 'loading' || newsletterState === 'success'}
						>
							{m.footer_newsletter_cta()}
						</Button>
					</form>
					{#if newsletterState === 'success'}
						<p class="text-primary mt-1.5 text-xs">{m.footer_newsletter_check_inbox()}</p>
					{:else if newsletterState === 'duplicate'}
						<p class="text-muted-foreground mt-1.5 text-xs">{m.footer_newsletter_duplicate()}</p>
					{:else if newsletterState === 'invalid'}
						<p class="text-destructive mt-1.5 text-xs">{m.footer_newsletter_invalid()}</p>
					{/if}
				</div>
			</div>

			<!-- Rechtliches -->
			<div class="col-span-2 md:col-span-1">
				<h3 class="mb-4 font-semibold">{m.footer_legal()}</h3>
				<div class="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
					<a href="/faq" class="text-muted-foreground hover:text-foreground transition-colors"
						>FAQ</a
					>
					<a href="/agb" class="text-muted-foreground hover:text-foreground transition-colors"
						>{m.footer_terms()}</a
					>
					<a href="/kontakt" class="text-muted-foreground hover:text-foreground transition-colors"
						>{m.footer_contact()}</a
					>
					<a
						href="/widerruf"
						class="text-muted-foreground hover:text-foreground transition-colors"
						>{m.footer_withdrawal()}</a
					>
					<a
						href="/impressum"
						class="text-muted-foreground hover:text-foreground transition-colors"
						>{m.footer_imprint()}</a
					>
					<a
						href="/lieferbedingungen"
						class="text-muted-foreground hover:text-foreground transition-colors"
						>{m.footer_shipping()}</a
					>
					<a
						href="/datenschutz"
						class="text-muted-foreground hover:text-foreground transition-colors"
						>{m.footer_privacy()}</a
					>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="border-border border-t">
			<div
				class="text-muted-foreground container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-3 text-xs sm:flex-row"
			>
				<span>&copy; {new Date().getFullYear()} Hacibaba. {m.footer_copyright()}</span>

				<div class="flex flex-wrap items-center justify-center gap-3">
					<span class="flex items-center gap-1.5">
						<span class="text-primary">🔒</span>
						{m.footer_trust_ssl()}
					</span>
					<span class="flex items-center gap-1.5">
						<span>↩</span>
						{m.footer_trust_returns()}
					</span>
					<span class="flex items-center gap-1.5">
						<span class="text-green-600">🌿</span>
						{m.footer_trust_gogreen()}
					</span>

					<span class="opacity-20">|</span>

					<!-- Payment methods -->
					<div class="flex items-center gap-1.5">
						<!-- Visa -->
						<span
							class="border-border inline-flex h-[22px] items-center rounded border bg-white px-1.5 text-[9px] font-black tracking-wide italic"
							style="color:#1a1f71">VISA</span
						>
						<!-- Mastercard -->
						<span
							class="border-border inline-flex h-[22px] w-9 items-center justify-center rounded border bg-white"
						>
							<span class="h-3.5 w-3.5 rounded-full bg-[#EB001B]"></span>
							<span class="-ml-2 h-3.5 w-3.5 rounded-full bg-[#F79E1B]"></span>
						</span>
						<!-- Amex -->
						<span
							class="border-border inline-flex h-[22px] items-center rounded border bg-[#016fcf] px-1.5 text-[8px] font-bold tracking-wide text-white"
							>AMEX</span
						>
					</div>

					<span class="opacity-20">|</span>

					<!-- Language switcher (mobile only - desktop is in header) -->
					<div class="md:hidden">
						<LanguageSwitcher locale={data.locale} />
					</div>
				</div>
			</div>
		</div>
	</footer>
</div>
