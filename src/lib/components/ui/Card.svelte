<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	class={cn('border-border bg-card text-card-foreground rounded-lg border shadow-sm', className)}
	{...rest}
>
	{@render children?.()}
</div>
