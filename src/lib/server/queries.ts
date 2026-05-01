import { localizedName, type NutritionInfo } from '$lib/types';

export function parseProductImages<T extends { images: string | null }>(
	product: T
): Omit<T, 'images'> & { images: string[] | null } {
	return {
		...product,
		images: product.images ? (JSON.parse(product.images) as string[]) : null
	};
}

export function parseProductData<T extends { images: string | null; nutrition: string | null }>(
	product: T
): Omit<T, 'images' | 'nutrition'> & { images: string[] | null; nutrition: NutritionInfo | null } {
	return {
		...product,
		images: product.images ? (JSON.parse(product.images) as string[]) : null,
		nutrition: product.nutrition ? (JSON.parse(product.nutrition) as NutritionInfo) : null
	};
}

export function withLocalizedName<
	T extends { name_tr: string; name_de: string | null; name_en: string | null }
>(product: T, locale: string): T & { name: string } {
	return { ...product, name: localizedName(product, locale) };
}
