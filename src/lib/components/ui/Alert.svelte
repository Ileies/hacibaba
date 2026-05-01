<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const alertVariants = tv({
		base: 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
		variants: {
			variant: {
				default: 'bg-background text-foreground border-border',
				destructive: 'border-destructive/50 text-destructive [&>svg]:text-destructive'
			}
		},
		defaultVariants: { variant: 'default' }
	});

	export type AlertVariant = VariantProps<typeof alertVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: AlertVariant;
		class?: string;
	}

	let { variant, class: className, children, ...rest }: Props = $props();
</script>

<div role="alert" class={alertVariants({ variant, class: className })} {...rest}>
	{@render children?.()}
</div>
