import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { productsTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

function parseOptionalFloat(value: FormDataEntryValue | null): number | null {
	if (value === null) return null;
	const str = String(value).trim();
	if (str === '') return null;
	const n = parseFloat(str);
	return isNaN(n) ? null : n;
}
export const load: PageServerLoad = ({ params }) => {
	if (params.id === 'new') {
		return { product: null };
	}

	const id = parseInt(params.id);
	if (isNaN(id)) error(404);

	const product = db.select().from(productsTable).where(eq(productsTable.id, id)).get();
	if (!product) error(404, 'Produkt nicht gefunden');

	return { product };
};

export const actions: Actions = {
	save: async ({ params, request }) => {
		const data = await request.formData();
		const name_tr = String(data.get('name_tr') ?? '').trim();
		const name_de = String(data.get('name_de') ?? '').trim() || null;
		const name_en = String(data.get('name_en') ?? '').trim() || null;
		const slug = String(data.get('slug') ?? '').trim();
		const priceStr = String(data.get('price') ?? '');
		const weightStr = String(data.get('weight') ?? '');
		const imageUrl = String(data.get('imageUrl') ?? '').trim() || null;
		const description = String(data.get('description') ?? '').trim() || null;
		const isActive = data.has('isActive');

		// Allergen bit flags - each checkbox submits its bit value
		const allergenBits = data.getAll('allergen').map((v) => parseInt(String(v)));
		const allergens = allergenBits.length > 0 ? allergenBits.reduce((acc, b) => acc | b, 0) : null;

		// Tag bit flags
		const tagBits = data.getAll('tag').map((v) => parseInt(String(v)));
		const tags = tagBits.reduce((acc, b) => acc | b, 0);

		// Food info fields
		const ingredientsDe = String(data.get('ingredients_de') ?? '').trim() || null;
		const ingredientsEn = String(data.get('ingredients_en') ?? '').trim() || null;
		const ingredientsTr = String(data.get('ingredients_tr') ?? '').trim() || null;
		const shelfLifeStr = String(data.get('shelf_life_months') ?? '').trim();
		const shelfLifeMonths = shelfLifeStr ? parseInt(shelfLifeStr) : null;
		const storageDe = String(data.get('storage_de') ?? '').trim() || null;
		const storageEn = String(data.get('storage_en') ?? '').trim() || null;
		const storageTr = String(data.get('storage_tr') ?? '').trim() || null;

		// Nutrition per 100g — store as JSON, omit if all fields empty
		const nutritionFields = {
			energy_kj: parseOptionalFloat(data.get('nutrition_energy_kj')),
			energy_kcal: parseOptionalFloat(data.get('nutrition_energy_kcal')),
			fat: parseOptionalFloat(data.get('nutrition_fat')),
			fat_saturated: parseOptionalFloat(data.get('nutrition_fat_saturated')),
			carbs: parseOptionalFloat(data.get('nutrition_carbs')),
			sugar: parseOptionalFloat(data.get('nutrition_sugar')),
			fiber: parseOptionalFloat(data.get('nutrition_fiber')),
			protein: parseOptionalFloat(data.get('nutrition_protein')),
			salt: parseOptionalFloat(data.get('nutrition_salt'))
		};
		const hasNutrition = Object.values(nutritionFields).some((v) => v !== null);
		const nutrition = hasNutrition ? JSON.stringify(nutritionFields) : null;

		// New fields
		const originalPriceStr = String(data.get('originalPrice') ?? '').trim();
		const originalPrice = originalPriceStr ? Math.round(parseFloat(originalPriceStr) * 100) : null;
		const stockQuantityStr = String(data.get('stockQuantity') ?? '').trim();
		const stockQuantity = stockQuantityStr ? parseInt(stockQuantityStr) : null;
		const originRegion = String(data.get('originRegion') ?? '').trim() || null;
		const pairingSuggestion = String(data.get('pairingSuggestion') ?? '').trim() || null;

		// Additional images - one URL per line
		const additionalImagesRaw = String(data.get('additionalImages') ?? '').trim();
		const additionalImages = additionalImagesRaw
			? JSON.stringify(
					additionalImagesRaw
						.split('\n')
						.map((u) => u.trim())
						.filter(Boolean)
				)
			: null;

		if (!name_tr || !slug || !priceStr) return fail(400, { error: true });

		const price = Math.round(parseFloat(priceStr) * 100);
		if (isNaN(price) || price < 0) return fail(400, { error: true });

		const weight = weightStr ? parseInt(weightStr) : null;

		const values = {
			name_tr,
			name_de,
			name_en,
			slug,
			price,
			originalPrice,
			weight,
			stockQuantity,
			imageUrl,
			images: additionalImages,
			description,
			isActive,
			allergens,
			ingredientsDe,
			ingredientsEn,
			ingredientsTr,
			nutrition,
			shelfLifeMonths,
			storageDe,
			storageEn,
			storageTr,
			originRegion,
			pairingSuggestion,
			tags
		};

		if (params.id === 'new') {
			db.insert(productsTable).values(values).run();
		} else {
			const id = parseInt(params.id);
			db.update(productsTable)
				.set({ ...values, updatedAt: new Date().toISOString() })
				.where(eq(productsTable.id, id))
				.run();
		}

		return { success: true };
	},

	delete: async ({ params }) => {
		const id = parseInt(params.id);
		if (isNaN(id)) return fail(400);
		db.delete(productsTable).where(eq(productsTable.id, id)).run();
		redirect(302, '/admin/products');
	}
};
