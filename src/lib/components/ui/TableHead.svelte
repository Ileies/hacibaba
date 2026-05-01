<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	interface Props extends HTMLAttributes<HTMLTableCellElement> {
		class?: string;
	}
	let { class: className, children, ...rest }: Props = $props();
</script>

<th
	class={cn(
		'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
		className
	)}
	{...rest}>{@render children?.()}</th
>
