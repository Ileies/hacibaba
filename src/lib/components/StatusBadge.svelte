<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import type { BadgeVariant } from '$lib/components/ui';

	const variants: Record<string, BadgeVariant> = {
		pending: 'secondary',
		confirmed: 'default',
		shipped: 'default',
		delivered: 'outline',
		cancelled: 'destructive'
	};

	let { status }: { status: string } = $props();
</script>

<Badge variant={variants[status] ?? 'outline'}>{status}</Badge>
