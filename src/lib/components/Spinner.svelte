<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className }: { class?: string } = $props();
</script>

<span
	class={cn(
		'size-4 animate-spin rounded-full border-2 border-current border-t-transparent',
		className
	)}
></span>
