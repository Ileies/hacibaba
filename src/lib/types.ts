import type { productsTable, ordersTable, orderItemsTable } from '$lib/server/schema';

export type DbProduct = typeof productsTable.$inferSelect;
export type Product = Omit<DbProduct, 'images' | 'nutrition'> & {
	images: string[] | null;
	nutrition: NutritionInfo | null;
};

export interface NutritionInfo {
	energy_kj: number | null;
	energy_kcal: number | null;
	fat: number | null;
	fat_saturated: number | null;
	carbs: number | null;
	sugar: number | null;
	fiber: number | null;
	protein: number | null;
	salt: number | null;
}

export const ALLERGENS = [
	{ key: 'gluten', bit: 1 << 0 },
	{ key: 'crustaceans', bit: 1 << 1 },
	{ key: 'eggs', bit: 1 << 2 },
	{ key: 'fish', bit: 1 << 3 },
	{ key: 'peanuts', bit: 1 << 4 },
	{ key: 'soybeans', bit: 1 << 5 },
	{ key: 'milk', bit: 1 << 6 },
	{ key: 'nuts', bit: 1 << 7 },
	{ key: 'celery', bit: 1 << 8 },
	{ key: 'mustard', bit: 1 << 9 },
	{ key: 'sesame', bit: 1 << 10 },
	{ key: 'sulphites', bit: 1 << 11 },
	{ key: 'lupin', bit: 1 << 12 },
	{ key: 'molluscs', bit: 1 << 13 }
] as const;

export type AllergenKey = (typeof ALLERGENS)[number]['key'];

export const PRODUCT_TAGS = [
	{ key: 'halal', bit: 1 << 0 },
	{ key: 'vegan', bit: 1 << 1 },
	{ key: 'glutenfrei', bit: 1 << 2 },
	{ key: 'nussfrei', bit: 1 << 3 },
	{ key: 'bestseller', bit: 1 << 4 },
	{ key: 'neu', bit: 1 << 5 },
	{ key: 'saisonal', bit: 1 << 6 }
] as const;

export type ProductTagKey = (typeof PRODUCT_TAGS)[number]['key'];

export function hasTag(flags: number | null | undefined, bit: number): boolean {
	return flags !== null && flags !== undefined && (flags & bit) !== 0;
}

export function activeTags(flags: number | null | undefined): ProductTagKey[] {
	if (!flags) return [];
	return PRODUCT_TAGS.filter((t) => (flags & t.bit) !== 0).map((t) => t.key);
}

export function hasAllergen(flags: number | null, bit: number): boolean {
	return flags !== null && (flags & bit) !== 0;
}

export function activeAllergens(flags: number | null): AllergenKey[] {
	if (!flags) return [];
	return ALLERGENS.filter((a) => (flags & a.bit) !== 0).map((a) => a.key);
}
export type DbOrder = typeof ordersTable.$inferSelect;
export type DbOrderItem = typeof orderItemsTable.$inferSelect;

export interface CartItem {
	productId: number;
	name_de: string | null;
	name_en: string | null;
	name_tr: string;
	price: number; // EUR cents
	quantity: number;
	imageUrl: string | null;
}

export interface ShippingAddress {
	firstName: string;
	lastName: string;
	street: string;
	city: string;
	zip: string;
	state?: string;
	country: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer' | 'prepayment';

export function localizedName(
	product: Pick<Product, 'name_tr' | 'name_de' | 'name_en'>,
	locale: string
): string {
	if (locale === 'en') return product.name_en ?? product.name_de ?? product.name_tr;
	if (locale === 'de') return product.name_de ?? product.name_tr;
	return product.name_tr;
}

export function formatPrice(cents: number): string {
	return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

export function generateOrderNumber(): string {
	const year = new Date().getFullYear();
	const random = Math.floor(Math.random() * 90000) + 10000;
	return `HB-${year}-${random}`;
}
