<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { Button, Input, Label, Textarea, Separator } from '$lib/components/ui';
	import BackLink from '$lib/components/BackLink.svelte';
	import { ALLERGENS, hasAllergen, PRODUCT_TAGS, hasTag } from '$lib/types';
	import * as m from '$lib/messages';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const isNew = $derived(data.product === null);

	const nutrition = $derived(
		data.product?.nutrition ? JSON.parse(data.product.nutrition as unknown as string) : null
	);
</script>

<svelte:head
	><title>{isNew ? m.admin_new_product() : m.admin_edit_product()} - Admin</title></svelte:head
>

<BackLink href="/admin/products" />

<h1 class="mb-6 text-2xl font-semibold tracking-tight">
	{isNew ? m.admin_new_product() : m.admin_edit_product()}
</h1>

{#if form?.success}
	<div
		class="bg-primary/10 border-primary/20 text-primary mb-4 rounded-lg border px-4 py-3 text-sm font-medium"
	>
		{m.admin_product_saved()}
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
		<Label for="name_de">Name Deutsch *</Label>
		<Input id="name_de" name="name_de" required value={data.product?.name_de ?? ''} />
	</div>
	<div class="space-y-1.5">
		<Label for="name_en">Name Englisch</Label>
		<Input id="name_en" name="name_en" value={data.product?.name_en ?? ''} />
	</div>
	<div class="space-y-1.5">
		<Label for="name_tr">Name Türkisch *</Label>
		<Input id="name_tr" name="name_tr" required value={data.product?.name_tr ?? ''} />
	</div>

	<div class="space-y-1.5">
		<Label for="slug">Slug (URL) *</Label>
		<Input
			id="slug"
			name="slug"
			required
			value={data.product?.slug ?? ''}
			placeholder="z.b. doppel-rosenblatt-lokum"
			class="font-mono text-sm"
		/>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-1.5">
			<Label for="price">{m.admin_product_price()} (€) *</Label>
			<Input
				id="price"
				name="price"
				type="number"
				step="0.01"
				min="0"
				required
				value={data.product ? (data.product.price / 100).toFixed(2) : ''}
			/>
		</div>
		<div class="space-y-1.5">
			<Label for="originalPrice">{m.admin_original_price()}</Label>
			<Input
				id="originalPrice"
				name="originalPrice"
				type="number"
				step="0.01"
				min="0"
				value={data.product?.originalPrice ? (data.product.originalPrice / 100).toFixed(2) : ''}
			/>
		</div>
		<div class="space-y-1.5">
			<Label for="weight">{m.shop_weight()} (g)</Label>
			<Input id="weight" name="weight" type="number" min="0" value={data.product?.weight ?? ''} />
		</div>
		<div class="space-y-1.5">
			<Label for="stockQuantity">{m.admin_stock_quantity()}</Label>
			<Input
				id="stockQuantity"
				name="stockQuantity"
				type="number"
				min="0"
				value={data.product?.stockQuantity ?? ''}
			/>
		</div>
	</div>

	<div class="space-y-1.5">
		<Label for="imageUrl">{m.admin_image_url()}</Label>
		<Input
			id="imageUrl"
			name="imageUrl"
			type="url"
			value={data.product?.imageUrl ?? ''}
			placeholder="https://..."
		/>
	</div>

	<!-- Additional images (#29) -->
	<div class="space-y-1.5">
		<Label for="additionalImages">{m.admin_additional_images()}</Label>
		<textarea
			id="additionalImages"
			name="additionalImages"
			rows={3}
			class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-md border px-3 py-2 font-mono text-xs focus-visible:ring-1 focus-visible:outline-none"
			placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
			>{data.product?.images
				? JSON.parse(data.product.images as unknown as string).join('\n')
				: ''}</textarea
		>
	</div>

	<!-- Origin + Pairing (#34) -->
	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-1.5">
			<Label for="originRegion">{m.admin_origin_region()}</Label>
			<Input
				id="originRegion"
				name="originRegion"
				value={data.product?.originRegion ?? ''}
				placeholder="Istanbul"
			/>
		</div>
		<div class="space-y-1.5">
			<Label for="pairingSuggestion">{m.admin_pairing()}</Label>
			<Input
				id="pairingSuggestion"
				name="pairingSuggestion"
				value={data.product?.pairingSuggestion ?? ''}
				placeholder="Tee, Kaffee"
			/>
		</div>
	</div>

	<div class="space-y-1.5">
		<Label for="description">{m.common_description()}</Label>
		<Textarea
			id="description"
			name="description"
			rows={4}
			value={data.product?.description ?? ''}
		/>
	</div>

	<Separator />

	<!-- Tags / Badges (#32) -->
	<div class="space-y-3">
		<Label>{m.admin_tags()}</Label>
		<div class="grid grid-cols-2 gap-x-6 gap-y-2">
			{#each PRODUCT_TAGS as { key, bit } (bit)}
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input
						type="checkbox"
						name="tag"
						value={bit}
						class="border-input h-4 w-4 rounded"
						checked={hasTag(data.product?.tags, bit)}
					/>
					{m[`admin_tag_${key}`]()}
				</label>
			{/each}
		</div>
	</div>

	<!-- Allergens -->
	<div class="space-y-3">
		<Label>{m.admin_allergens()}</Label>
		<div class="grid grid-cols-2 gap-x-6 gap-y-2">
			{#each ALLERGENS as { key, bit } (bit)}
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input
						type="checkbox"
						name="allergen"
						value={bit}
						class="border-input h-4 w-4 rounded"
						checked={hasAllergen(data.product?.allergens ?? null, bit)}
					/>
					{m[`allergen_${key}`]()}
				</label>
			{/each}
		</div>
	</div>

	<!-- Ingredients -->
	<div class="space-y-3">
		<Label>{m.admin_ingredients()}</Label>
		<div class="space-y-2">
			<div class="space-y-1">
				<p class="text-muted-foreground text-xs">Deutsch</p>
				<Textarea name="ingredients_de" rows={2} value={data.product?.ingredientsDe ?? ''} />
			</div>
			<div class="space-y-1">
				<p class="text-muted-foreground text-xs">Englisch</p>
				<Textarea name="ingredients_en" rows={2} value={data.product?.ingredientsEn ?? ''} />
			</div>
			<div class="space-y-1">
				<p class="text-muted-foreground text-xs">Türkisch</p>
				<Textarea name="ingredients_tr" rows={2} value={data.product?.ingredientsTr ?? ''} />
			</div>
		</div>
	</div>

	<!-- Shelf life + storage -->
	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-1.5">
			<Label for="shelf_life_months">{m.admin_shelf_life()}</Label>
			<Input
				id="shelf_life_months"
				name="shelf_life_months"
				type="number"
				min="1"
				value={data.product?.shelfLifeMonths ?? ''}
			/>
		</div>
	</div>
	<div class="space-y-3">
		<Label>{m.admin_storage()}</Label>
		<div class="space-y-2">
			<div class="space-y-1">
				<p class="text-muted-foreground text-xs">Deutsch</p>
				<Input name="storage_de" value={data.product?.storageDe ?? ''} />
			</div>
			<div class="space-y-1">
				<p class="text-muted-foreground text-xs">Englisch</p>
				<Input name="storage_en" value={data.product?.storageEn ?? ''} />
			</div>
			<div class="space-y-1">
				<p class="text-muted-foreground text-xs">Türkisch</p>
				<Input name="storage_tr" value={data.product?.storageTr ?? ''} />
			</div>
		</div>
	</div>

	<!-- Nutrition per 100g -->
	<div class="space-y-3">
		<Label>{m.admin_nutrition_per_100g()}</Label>
		<div class="grid grid-cols-2 gap-3">
			{#each [['nutrition_energy_kj', 'Energie (kJ)'], ['nutrition_energy_kcal', 'Energie (kcal)'], ['nutrition_fat', 'Fett (g)'], ['nutrition_fat_saturated', 'davon gesättigt (g)'], ['nutrition_carbs', 'Kohlenhydrate (g)'], ['nutrition_sugar', 'davon Zucker (g)'], ['nutrition_fiber', 'Ballaststoffe (g)'], ['nutrition_protein', 'Eiweiß (g)'], ['nutrition_salt', 'Salz (g)']] as [field, label] (field)}
				<div class="space-y-1">
					<p class="text-muted-foreground text-xs">{label}</p>
					<Input
						name={field}
						type="number"
						step="0.1"
						min="0"
						value={nutrition?.[field.replace('nutrition_', '')] ?? ''}
					/>
				</div>
			{/each}
		</div>
	</div>

	<Separator />

	<div class="flex items-center gap-3">
		<input
			type="checkbox"
			id="isActive"
			name="isActive"
			class="border-input h-4 w-4 rounded"
			checked={data.product?.isActive ?? true}
		/>
		<Label for="isActive" class="cursor-pointer font-normal">{m.admin_product_active()}</Label>
	</div>

	<div class="flex gap-3 pt-2">
		<Button type="submit">{m.common_save()}</Button>
		{#if !isNew}
			<Button
				type="submit"
				formaction="?/delete"
				variant="destructive"
				onclick={(e: MouseEvent) => {
					if (!confirm(m.admin_confirm_delete_product())) e.preventDefault();
				}}
			>
				{m.common_delete()}
			</Button>
		{/if}
	</div>
</form>
