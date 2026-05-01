<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<h3 class={cn('text-2xl leading-none font-semibold tracking-tight', className)} {...rest}>
	{@render children?.()}
</h3>
