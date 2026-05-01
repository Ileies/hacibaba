<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as m from '$lib/messages';

	let {
		children,
		subtitle = m.shop_tagline(),
		subtitleClass = 'text-muted-foreground text-sm',
		fullScreen = false
	}: {
		children: Snippet;
		subtitle?: string;
		subtitleClass?: string;
		fullScreen?: boolean;
	} = $props();
</script>

<div
	class="{fullScreen
		? 'min-h-screen'
		: 'min-h-[calc(100vh-4rem)]'} bg-secondary/30 flex items-center justify-center px-4 py-12"
>
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<a href="/" class="text-2xl font-bold tracking-tight">{m.shop_title()}</a>
			<p class="{subtitleClass} mt-1">{subtitle}</p>
		</div>
		{@render children()}
	</div>
</div>
