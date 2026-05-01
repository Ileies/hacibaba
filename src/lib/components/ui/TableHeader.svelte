<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	let { children, ...rest }: HTMLAttributes<HTMLTableSectionElement> = $props();
</script>

<thead class="[&_tr]:border-b" {...rest}>{@render children?.()}</thead>
