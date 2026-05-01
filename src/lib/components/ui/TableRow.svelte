<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	interface Props extends HTMLAttributes<HTMLTableRowElement> {
		class?: string;
	}
	let { class: className, children, ...rest }: Props = $props();
</script>

<tr
	class={cn(
		'border-border hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
		className
	)}
	{...rest}>{@render children?.()}</tr
>
