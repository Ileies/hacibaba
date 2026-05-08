<script lang="ts">
	import { Globe, Check } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let { locale, variant = 'dropdown' }: { locale: string; variant?: 'dropdown' | 'inline' } =
		$props();

	const locales = [
		{ code: 'de', flag: '🇩🇪', label: 'Deutsch' },
		{ code: 'en', flag: '🇬🇧', label: 'English' },
		{ code: 'tr', flag: '🇹🇷', label: 'Türkçe' }
	];

	let open = $state(false);
	let container: HTMLElement = $state()!;

	async function switchLocale(code: string) {
		open = false;
		await fetch('/api/locale', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale: code })
		});
		location.reload();
	}
</script>

<svelte:window
	onclick={(e) => {
		if (open && !container?.contains(e.target as Node)) open = false;
	}}
/>

{#if variant === 'inline'}
	<div class="flex items-center gap-1">
		{#each locales as l (l.code)}
			<button
				onclick={() => switchLocale(l.code)}
				class={cn(
					'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
					locale === l.code
						? 'bg-primary/10 text-primary font-medium'
						: 'text-muted-foreground hover:bg-accent hover:text-foreground'
				)}
			>
				<span class="text-lg leading-none">{l.flag}</span>
				<span>{l.label}</span>
			</button>
		{/each}
	</div>
{:else}
	<div class="relative" bind:this={container}>
		<button
			onclick={() => (open = !open)}
			aria-expanded={open}
			aria-haspopup="listbox"
			aria-label="Sprache wählen"
			class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors"
		>
			<Globe size={18} />
		</button>

		{#if open}
			<div
				role="listbox"
				aria-label="Sprache wählen"
				class="border-border bg-background absolute top-full right-0 z-50 mt-1.5 min-w-[148px] overflow-hidden rounded-lg border shadow-lg"
			>
				{#each locales as l (l.code)}
					<button
						role="option"
						aria-selected={locale === l.code}
						onclick={() => switchLocale(l.code)}
						class={cn(
							'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition-colors',
							locale === l.code
								? 'bg-primary/10 text-primary font-medium'
								: 'text-foreground hover:bg-accent'
						)}
					>
						<span class="text-base leading-none">{l.flag}</span>
						<span>{l.label}</span>
						{#if locale === l.code}
							<Check size={12} class="ml-auto" />
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
