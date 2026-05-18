import { sqliteTable, integer, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const productsTable = sqliteTable(
	'products',
	{
		id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
		name_tr: text('name_tr').notNull(),
		name_de: text('name_de'),
		name_en: text('name_en'),
		slug: text('slug').notNull().unique(),
		description: text('description'),
		price: integer('price').notNull(), // EUR cents
		weight: integer('weight'), // grams
		imageUrl: text('image_url'),
		images: text('images'), // JSON string[]
		isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
		sortOrder: integer('sort_order').notNull().default(0),
		allergens: integer('allergens'), // EU LMIV bit flags: gluten=1,crustaceans=2,eggs=4,fish=8,peanuts=16,soybeans=32,milk=64,nuts=128,celery=256,mustard=512,sesame=1024,sulphites=2048,lupin=4096,molluscs=8192
		ingredientsDe: text('ingredients_de'),
		ingredientsEn: text('ingredients_en'),
		ingredientsTr: text('ingredients_tr'),
		nutrition: text('nutrition'), // JSON NutritionInfo per 100g
		shelfLifeMonths: integer('shelf_life_months'),
		storageDe: text('storage_de'),
		storageEn: text('storage_en'),
		storageTr: text('storage_tr'),
		originalPrice: integer('original_price'), // EUR cents, for strikethrough display
		originRegion: text('origin_region'), // e.g. "Istanbul"
		pairingSuggestion: text('pairing_suggestion'), // e.g. "Tee, Kaffee"
		stockQuantity: integer('stock_quantity'), // null = unlimited
		tags: integer('tags').default(0), // bit flags: halal=1,vegan=2,glutenfrei=4,nussfrei=8,bestseller=16,neu=32,saisonal=64
		createdAt: text('created_at')
			.default(sql`(CURRENT_TIMESTAMP)`)
			.notNull(),
		updatedAt: text('updated_at')
			.default(sql`(CURRENT_TIMESTAMP)`)
			.notNull()
	},
	(table) => [
		index('products_slug_idx').on(table.slug),
		index('products_active_idx').on(table.isActive)
	]
);

// Customer accounts
export const customersTable = sqliteTable(
	'customers',
	{
		id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
		email: text('email').notNull().unique(),
		name: text('name').notNull(),
		passwordHash: text('password_hash'), // null for OAuth-only accounts
		isBlocked: integer('is_blocked', { mode: 'boolean' }).notNull().default(false),
		emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
		emailVerificationToken: text('email_verification_token'),
		emailVerificationTokenExpiresAt: text('email_verification_token_expires_at'),
		createdAt: text('created_at')
			.default(sql`(CURRENT_TIMESTAMP)`)
			.notNull()
	},
	(table) => [index('customers_email_idx').on(table.email)]
);

export const customerSessionsTable = sqliteTable('customer_sessions', {
	token: text('token').primaryKey().notNull(),
	customerId: integer('customer_id')
		.notNull()
		.references(() => customersTable.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	expiresAt: text('expires_at').notNull()
});

export const oauthAccountsTable = sqliteTable(
	'oauth_accounts',
	{
		provider: text('provider').notNull(), // 'google'
		providerUserId: text('provider_user_id').notNull(),
		customerId: integer('customer_id')
			.notNull()
			.references(() => customersTable.id, { onDelete: 'cascade' }),
		createdAt: text('created_at')
			.default(sql`(CURRENT_TIMESTAMP)`)
			.notNull()
	},
	(table) => [unique('oauth_unique').on(table.provider, table.providerUserId)]
);

// Admin sessions - credentials are in .env, no admin_users table needed
export const adminSessionsTable = sqliteTable('admin_sessions', {
	token: text('token').primaryKey().notNull(),
	createdAt: text('created_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	expiresAt: text('expires_at').notNull()
});

export const ordersTable = sqliteTable(
	'orders',
	{
		id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
		orderNumber: text('order_number').notNull().unique(),
		customerId: integer('customer_id').references(() => customersTable.id, {
			onDelete: 'set null'
		}),
		customerName: text('customer_name').notNull(),
		customerEmail: text('customer_email').notNull(),
		customerPhone: text('customer_phone'),
		shippingAddress: text('shipping_address').notNull(), // JSON: ShippingAddress
		billingAddress: text('billing_address'), // JSON: ShippingAddress | null
		status: text('status', {
			enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
		})
			.notNull()
			.default('pending'),
		paymentStatus: text('payment_status', { enum: ['pending', 'paid', 'failed', 'refunded'] })
			.notNull()
			.default('pending'),
		paymentMethod: text('payment_method'),
		shippingCost: integer('shipping_cost').notNull().default(0), // EUR cents
		subtotal: integer('subtotal').notNull(), // EUR cents
		total: integer('total').notNull(), // EUR cents
		notes: text('notes'),
		giftMessage: text('gift_message'),
		adminNotes: text('admin_notes'),
		trackingNumber: text('tracking_number'),
		stripePaymentIntentId: text('stripe_payment_intent_id'),
		stripeSessionId: text('stripe_session_id'),
		createdAt: text('created_at')
			.default(sql`(CURRENT_TIMESTAMP)`)
			.notNull(),
		updatedAt: text('updated_at')
			.default(sql`(CURRENT_TIMESTAMP)`)
			.notNull()
	},
	(table) => [
		index('orders_status_idx').on(table.status),
		index('orders_created_at_idx').on(table.createdAt),
		index('orders_customer_idx').on(table.customerId),
		index('orders_stripe_pi_idx').on(table.stripePaymentIntentId),
		index('orders_stripe_session_idx').on(table.stripeSessionId)
	]
);

export const customerAddressesTable = sqliteTable(
	'customer_addresses',
	{
		id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
		customerId: integer('customer_id')
			.notNull()
			.references(() => customersTable.id, { onDelete: 'cascade' }),
		label: text('label'),
		firstName: text('first_name').notNull(),
		lastName: text('last_name').notNull(),
		street: text('street').notNull(),
		city: text('city').notNull(),
		zip: text('zip').notNull(),
		state: text('state'),
		country: text('country').notNull().default('DE'),
		isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
		createdAt: text('created_at')
			.default(sql`(CURRENT_TIMESTAMP)`)
			.notNull()
	},
	(table) => [index('addresses_customer_idx').on(table.customerId)]
);

export const newsletterSubscribersTable = sqliteTable('newsletter_subscribers', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	email: text('email').notNull().unique(),
	confirmed: integer('confirmed', { mode: 'boolean' }).notNull().default(false),
	confirmationToken: text('confirmation_token').unique(),
	tokenExpiresAt: text('token_expires_at'),
	createdAt: text('created_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull()
});

export const passwordResetTokensTable = sqliteTable('password_reset_tokens', {
	token: text('token').primaryKey().notNull(),
	email: text('email').notNull(),
	expiresAt: text('expires_at').notNull(),
	createdAt: text('created_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull()
});

export const testimonialsTable = sqliteTable('testimonials', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	name: text('name').notNull(),
	location: text('location'),
	text: text('text').notNull(),
	rating: integer('rating').notNull().default(5), // 1-5
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: text('created_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull()
});

export const orderItemsTable = sqliteTable('order_items', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	orderId: integer('order_id')
		.notNull()
		.references(() => ordersTable.id, { onDelete: 'cascade' }),
	productId: integer('product_id').references(() => productsTable.id, { onDelete: 'set null' }),
	productName: text('product_name').notNull(),
	unitPrice: integer('unit_price').notNull(), // EUR cents
	quantity: integer('quantity').notNull(),
	totalPrice: integer('total_price').notNull() // EUR cents
});
