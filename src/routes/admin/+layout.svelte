<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		LayoutDashboard,
		Package,
		ShoppingBag,
		LogOut,
		ExternalLink,
		Users,
		Star
	} from '@lucide/svelte';
	import * as m from '$lib/messages';

	let { children }: { children: Snippet } = $props();

	const navItems = [
		{ href: '/admin', label: m.admin_dashboard(), icon: LayoutDashboard },
		{ href: '/admin/products', label: m.admin_products(), icon: Package },
		{ href: '/admin/orders', label: m.admin_orders(), icon: ShoppingBag },
		{ href: '/admin/customers', label: m.admin_customers(), icon: Users },
		{ href: '/admin/testimonials', label: m.admin_testimonials(), icon: Star }
	];
</script>

<div class="bg-background flex min-h-screen">
	<aside class="border-border bg-card flex w-60 shrink-0 flex-col border-r">
		<div class="border-border border-b px-4 py-5">
			<p class="text-sm font-semibold">Hacibaba</p>
			<p class="text-muted-foreground mt-0.5 text-xs">{m.admin_title()}</p>
		</div>

		<nav class="flex-1 space-y-0.5 p-3">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
				>
					<item.icon size={16} class="shrink-0" />
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="border-border space-y-0.5 border-t p-3">
			<a
				href="/"
				target="_blank"
				class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
			>
				<ExternalLink size={16} class="shrink-0" />
				{m.admin_view_shop()}
			</a>
			<form action="/admin/logout" method="POST">
				<button
					class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
				>
					<LogOut size={16} class="shrink-0" />
					{m.admin_logout()}
				</button>
			</form>
		</div>
	</aside>

	<main class="flex-1 overflow-auto">
		<div class="p-8">
			{@render children()}
		</div>
	</main>
</div>
