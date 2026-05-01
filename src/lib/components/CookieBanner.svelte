<script lang="ts">
	import { tick } from 'svelte';
	import * as m from '$lib/messages';

	let { show = false }: { show: boolean } = $props();
	let visible = $state(false);
	let acceptBtn = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		visible = show;
		if (visible) {
			tick().then(() => acceptBtn?.focus());
		}
	});

	async function accept() {
		await fetch('/api/cookie-consent', { method: 'POST' });
		visible = false;
	}
</script>

{#if visible}
	<div
		class="border-border bg-background/95 fixed right-0 bottom-0 left-0 z-50 border-t px-4 py-3 shadow-lg backdrop-blur"
		role="dialog"
		aria-label="Cookie-Einstellungen"
	>
		<div
			class="container mx-auto flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
		>
			<p class="text-muted-foreground text-sm">
				{m.cookie_banner_text()}
				<a
					href="/datenschutz"
					class="text-foreground underline underline-offset-2 hover:no-underline"
				>
					{m.cookie_banner_learn_more()}
				</a>
			</p>
			<button
				bind:this={acceptBtn}
				onclick={accept}
				class="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
			>
				{m.cookie_banner_accept()}
			</button>
		</div>
	</div>
{/if}
