<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';

	let {
		items
	}: {
		items: { label: string; href?: string }[];
	} = $props();
</script>

<nav aria-label="Breadcrumb" class="mb-6">
	<ol class="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
		{#each items as item, i (i)}
			{#if i > 0}
				<li aria-hidden="true"><ChevronRight size={14} class="text-muted-foreground/50" /></li>
			{/if}
			<li>
				{#if item.href && i < items.length - 1}
					<a href={item.href} class="hover:text-foreground transition-colors">{item.label}</a>
				{:else}
					<span class="text-foreground font-medium">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
