<script lang="ts">
	import { toasts } from '$lib/states.svelte';
	import { fly } from 'svelte/transition';
	import { CheckCircle, XCircle, Info, X } from '@lucide/svelte';
</script>

<div class="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-full max-w-sm flex-col gap-2">
	{#each toasts.items as toast (toast.id)}
		<div
			transition:fly={{ x: 80, duration: 200 }}
			class="pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg
				{toast.type === 'success' ? 'bg-card border-primary/40' : ''}
				{toast.type === 'error' ? 'bg-card border-destructive/40' : ''}
				{toast.type === 'info' ? 'bg-card border-border' : ''}"
		>
			{#if toast.type === 'success'}
				<CheckCircle size={16} class="text-primary mt-0.5 shrink-0" />
			{:else if toast.type === 'error'}
				<XCircle size={16} class="text-destructive mt-0.5 shrink-0" />
			{:else}
				<Info size={16} class="text-muted-foreground mt-0.5 shrink-0" />
			{/if}
			<p class="flex-1 text-sm">{toast.message}</p>
			<button
				onclick={() => toasts.remove(toast.id)}
				class="text-muted-foreground hover:text-foreground -mt-0.5 -mr-1 flex shrink-0 cursor-pointer items-center justify-center rounded p-1.5 transition-colors hover:bg-black/5"
				aria-label="Schließen"
			>
				<X size={14} />
			</button>
		</div>
	{/each}
</div>
