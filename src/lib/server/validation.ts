import { z } from 'zod';
import { locales } from '$lib/messages';

export const orderSchema = z.object({
	customer: z.object({
		firstName: z.string().min(1).max(100),
		lastName: z.string().min(1).max(100),
		email: z.string().email(),
		phone: z.string().max(50).optional(),
		street: z.string().min(1).max(200),
		city: z.string().min(1).max(100),
		zip: z.string().regex(/^\d{5}$/, 'Invalid German ZIP code'),
		state: z.string().max(100).optional(),
		country: z.string().length(2).default('DE'),
		notes: z.string().max(1000).optional()
	}),
	items: z
		.array(
			z.object({
				productId: z.number().int().positive(),
				name: z.string().min(1),
				price: z.number().int().positive(),
				quantity: z.number().int().positive().max(9999),
				imageUrl: z.string().nullable().optional()
			})
		)
		.min(1),
	shippingCost: z.number().int().nonnegative(),
	giftMessage: z.string().max(500).optional()
});

export const cartHydrateSchema = z.object({
	items: z
		.array(
			z.object({
				productId: z.number().int().positive(),
				quantity: z.number().int().min(1).max(9999)
			})
		)
		.max(100)
});

export const newsletterSchema = z.object({
	email: z.string().email()
});

export const localeSchema = z.object({
	locale: z.string().refine((v) => (locales as readonly string[]).includes(v), {
		message: 'Invalid locale'
	})
});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1)
});

export const registerSchema = z.object({
	name: z.string().min(1).max(100),
	email: z.string().email(),
	password: z.string().min(8)
});

export const passwordResetRequestSchema = z.object({
	email: z.string().email()
});

export const passwordResetConfirmSchema = z
	.object({
		password: z.string().min(8),
		confirm: z.string()
	})
	.refine((d) => d.password === d.confirm, { path: ['confirm'], message: 'mismatch' });

export const adminLoginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1)
});
