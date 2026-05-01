<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		value = $bindable(''),
		children,
		...rest
	}: { class?: string; value?: string; children: Snippet; [key: string]: unknown } = $props();
</script>

<select
	class={cn(
		'border-input bg-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none',
		className
	)}
	bind:value
	{...rest}
>
	{@render children()}
</select>
