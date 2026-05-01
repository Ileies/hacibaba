<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	let { children, ...rest }: HTMLAttributes<HTMLTableSectionElement> = $props();
</script>

<tbody class="[&_tr:last-child]:border-0" {...rest}>{@render children?.()}</tbody>
