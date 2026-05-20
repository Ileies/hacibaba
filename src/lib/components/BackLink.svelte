<script lang="ts">
	import { cn } from '$lib/utils';
	import { ArrowLeft } from '@lucide/svelte';
	import * as m from '$lib/messages';

	let {
		href,
		label = m.common_back(),
		class: className
	}: { href: string; label?: string; class?: string } = $props();
</script>

<a
	{href}
	class={cn(
		'text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors',
		className
	)}
>
	<ArrowLeft size={14} />
	{label}
</a>
