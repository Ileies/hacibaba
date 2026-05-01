<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { Button, Input, Label, Textarea } from '$lib/components/ui';
	import BackLink from '$lib/components/BackLink.svelte';
	import * as m from '$lib/messages';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const isNew = $derived(data.testimonial === null);
</script>

<svelte:head
	><title>{isNew ? m.admin_new_testimonial() : m.admin_edit_testimonial()} - Admin</title
	></svelte:head
>

<BackLink href="/admin/testimonials" />

<h1 class="mb-6 text-2xl font-semibold tracking-tight">
	{isNew ? m.admin_new_testimonial() : m.admin_edit_testimonial()}
</h1>

{#if form?.success}
	<div
		class="bg-primary/10 border-primary/20 text-primary mb-4 rounded-lg border px-4 py-3 text-sm font-medium"
	>
		{m.admin_testimonial_saved()}
	</div>
{/if}
{#if form?.error}
	<div
		class="bg-destructive/10 border-destructive/20 text-destructive mb-4 rounded-lg border px-4 py-3 text-sm"
	>
		{m.common_error()}
	</div>
{/if}

<form method="POST" action="?/save" use:enhance class="max-w-xl space-y-5">
	<div class="space-y-1.5">
		<Label for="name">{m.admin_testimonial_name()} *</Label>
		<Input
			id="name"
			name="name"
			required
			value={data.testimonial?.name ?? ''}
			placeholder="Maria M."
		/>
	</div>

	<div class="space-y-1.5">
		<Label for="location">{m.admin_testimonial_location()}</Label>
		<Input
			id="location"
			name="location"
			value={data.testimonial?.location ?? ''}
			placeholder="Berlin"
		/>
	</div>

	<div class="space-y-1.5">
		<Label for="text">{m.admin_testimonial_text()} *</Label>
		<Textarea
			id="text"
			name="text"
			rows={4}
			required
			value={data.testimonial?.text ?? ''}
			placeholder="Das beste Lokum, das ich je probiert habe..."
		/>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-1.5">
			<Label for="rating">{m.admin_testimonial_rating()}</Label>
			<Input
				id="rating"
				name="rating"
				type="number"
				min="1"
				max="5"
				value={data.testimonial?.rating ?? 5}
			/>
		</div>
		<div class="space-y-1.5">
			<Label for="sortOrder">{m.admin_sort_order()}</Label>
			<Input
				id="sortOrder"
				name="sortOrder"
				type="number"
				value={data.testimonial?.sortOrder ?? 0}
			/>
		</div>
	</div>

	<div class="flex items-center gap-3">
		<input
			type="checkbox"
			id="isActive"
			name="isActive"
			class="border-input h-4 w-4 rounded"
			checked={data.testimonial?.isActive ?? true}
		/>
		<Label for="isActive" class="cursor-pointer font-normal"
			>{m.admin_active()} (sichtbar auf Homepage)</Label
		>
	</div>

	<div class="flex gap-3 pt-2">
		<Button type="submit">{m.common_save()}</Button>
		{#if !isNew}
			<Button
				type="submit"
				formaction="?/delete"
				variant="destructive"
				onclick={(e: MouseEvent) => {
					if (!confirm(m.admin_confirm_delete_testimonial())) e.preventDefault();
				}}
			>
				{m.common_delete()}
			</Button>
		{/if}
	</div>
</form>
