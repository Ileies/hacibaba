# Hacibaba - Webshop

German e-commerce store for a Turkish Lokum manufacturer. SvelteKit + Bun + SQLite + Drizzle. UI in German, shadcn-svelte components (no DaisyUI). Customer auth: email/password + Google OAuth. Admin auth: static .env credentials. Sells exclusively Lokum (Turkish delight).

## Target Audience

**B2B customers** - primarily small businesses: confectioneries, bakeries, and supermarkets. Typical order: 5-10 kg per product. Where possible, optimize the shop for business buyers (bulk quantities, professional tone, easy repeat ordering).

**Shipping:** Delivery to Germany only.

## Commands

```bash
bun install                          # Install dependencies
bun run dev                          # Dev server (Vite, default :5173)
bun run build                        # Production build → build/index.js
bun run preview                      # Preview production build
bun run check                        # Type-check (svelte-check + tsc)
bun run lint                         # Prettier check + ESLint
bun run format                       # Auto-format with Prettier
bun run drizzle:push                 # Push schema changes to db.sqlite
```

Production: `bun build/index.js`

## Architecture

```
src/
├── routes/
│   ├── +layout.svelte / +layout.server.ts  - Nav, cart icon, footer; loads locale + cookie banner flag
│   ├── +page.svelte / +page.server.ts      - Homepage (hero, featured products)
│   ├── products/                            - Product listing + detail
│   │   ├── +page.svelte / +page.server.ts  - Catalog with search
│   │   └── [slug]/                         - Product detail page
│   ├── cart/
│   │   └── +page.svelte                    - Cart (client-side state)
│   ├── checkout/
│   │   ├── +page.svelte                    - Checkout form (POST to /api/orders)
│   │   └── confirmation/                   - Order confirmation page
│   ├── account/
│   │   └── +page.svelte / +page.server.ts  - Customer profile + order history + delete account
│   ├── admin/                              - Protected admin panel
│   │   ├── +layout.svelte                  - Admin sidebar nav
│   │   ├── +page.svelte / +page.server.ts  - Dashboard (stats, recent orders)
│   │   ├── login/                          - Admin login (username/password from .env)
│   │   ├── logout/                         - POST handler, clears admin session
│   │   ├── products/                       - Product list + CRUD
│   │   │   ├── +page.svelte / +page.server.ts  - Products listing
│   │   │   └── [id]/                       - Edit/create product (allergens, nutrition, ingredients)
│   │   └── orders/                         - Order management
│   │       ├── +page.svelte / +page.server.ts  - Orders listing
│   │       └── [id]/                       - Order detail + status/payment updates
│   ├── auth/
│   │   ├── login/                          - Customer login (email/password + Google button)
│   │   ├── register/                       - Customer registration
│   │   ├── google/                         - Initiate Google OAuth (PKCE)
│   │   ├── google/callback/                - Google OAuth callback
│   │   └── logout/                         - POST handler, clears customer session
│   ├── api/
│   │   ├── orders/+server.ts               - POST: create order + Stripe PaymentIntent
│   │   ├── stripe/webhook/+server.ts       - Stripe webhook (payment_intent events)
│   │   ├── locale/+server.ts               - POST: set locale cookie
│   │   ├── newsletter/+server.ts           - POST: subscribe email to newsletter
│   │   ├── health/+server.ts               - GET: health check (SELECT 1)
│   │   ├── account/export/+server.ts       - GET: GDPR data export as JSON (requires login)
│   │   └── cookie-consent/+server.ts       - POST: set cookie consent cookie (1-year)
│   └── (legal pages - static)
│       ├── agb/+page.svelte                - AGB (Terms of Service)
│       ├── datenschutz/+page.svelte        - Privacy Policy
│       ├── impressum/+page.svelte          - Imprint / Legal notice
│       ├── lieferbedingungen/+page.svelte  - Shipping terms
│       └── widerruf/+page.svelte           - Right of withdrawal
├── lib/
│   ├── i18n-plugin.ts        - Vite plugin: generates messages.ts from messages/*.json
│   ├── messages.ts           - Auto-generated. Never edit directly.
│   ├── states.svelte.ts      - CartStore + ToastStore (Svelte 5 $state, localStorage)
│   ├── types.ts              - TypeScript interfaces + helpers (formatPrice, localizedName, hasAllergen, ...)
│   ├── utils.ts              - cn() utility (clsx + tailwind-merge)
│   ├── components/
│   │   ├── ui/               - shadcn-svelte components
│   │   ├── AuthLayout.svelte
│   │   ├── BackLink.svelte
│   │   ├── CookieBanner.svelte
│   │   ├── GoogleOAuthButton.svelte
│   │   ├── ProductCard.svelte
│   │   ├── Spinner.svelte
│   │   ├── StatusBadge.svelte
│   │   └── Toaster.svelte
│   └── server/
│       ├── schema.ts         - Drizzle ORM table definitions
│       ├── db.ts             - SQLite connection (WAL + FK enforcement)
│       ├── auth.ts           - Customer + admin session auth (cookie-based)
│       ├── queries.ts        - DB query helpers: parseProductData, withLocalizedName
│       ├── email.ts          - Nodemailer email sending + order confirmation templates
│       ├── backup.ts         - Auto DB backup (startup + daily, keeps 10)
│       ├── seed.ts           - One-time seed: 5 product categories
│       ├── session-cleanup.ts - Clean expired sessions (startup + daily)
│       ├── env-check.ts      - Validate required env vars at startup
│       └── shutdown.ts       - Graceful shutdown handler
└── app.css                   - Tailwind CSS v4 + shadcn color theme (@theme block)
```

## To-Do-List

Feature-Backlog and price calculation: `todo.md` in project root

## Database

- **ORM:** Drizzle ORM with SQLite (`better-sqlite3`)
- **File:** `db.sqlite` at project root (relative path - run commands from project root)
- **Schema:** `src/lib/server/schema.ts` - edit here, then `bun run drizzle:push`
- **Tables:** `products`, `customers`, `customer_sessions`, `oauth_accounts`, `admin_sessions`, `orders`, `order_items`, `newsletter_subscribers`, `password_reset_tokens`
- **Booleans:** Stored as integers (0/1).
- **JSON fields:** `products.images` (string[]), `products.nutrition` (NutritionInfo), and `orders.shippingAddress`/`billingAddress` (ShippingAddress) are stored as JSON text strings. Parse on read.
- **Prices:** Always stored as EUR cents (integer). Use `formatPrice()` from `$lib/types` for display.
- **Localized product names:** `name_de`, `name_en`, `name_tr` columns - use `localizedName(product, locale)` from `$lib/types` to get the right one.
- **Allergens:** Stored as integer bit flags on `products.allergens`. 14 EU LMIV allergens (gluten=1, milk=64, nuts=128, etc.). Use `hasAllergen(flags, bit)` and `activeAllergens(flags)` from `$lib/types`.
- **No cascades on product delete:** Order items store `productId` as nullable - deleting a product sets it to NULL but keeps the order history (`productName` snapshot is preserved).

## Authentication

### Customer auth

- **Registration:** `/auth/register` - email + password (bcrypt via `Bun.password`)
- **Login:** `/auth/login` - email/password OR Google OAuth button
- **Google OAuth:** `GET /auth/google` → Google → `GET /auth/google/callback`
- **Logout:** `POST /auth/logout`
- **Session cookie:** `session` (httpOnly, sameSite=lax, 30-day expiry)
- **Protected routes:** Call `requireCustomer(event)` in `+page.server.ts` `load` functions
- `loadCustomerSession()` in `hooks.server.ts` sets `locals.customerId/customerName/customerEmail` on every request

Google OAuth env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.  
Set up credentials at console.cloud.google.com. Add `http://localhost:5173/auth/google/callback` as authorized redirect URI for dev.

`findOrCreateOauthCustomer()` in `auth.ts` links Google accounts to existing customers by email, or creates a new customer record.

### Admin auth

- **Credentials:** In `.env` as `ADMIN_USERNAME` / `ADMIN_PASSWORD` (plaintext, compared at login time). Use HTTPS in production.
- **Login page:** `/admin/login` - clean form, no HTTP Basic Auth
- **Logout:** `POST /admin/logout`
- **Session cookie:** `admin_session` (httpOnly, sameSite=lax, 7-day expiry)
- **No DB table for admin users** - single admin, credentials are static. Sessions are stored in `admin_sessions` table (token only, no FK).
- **Protection:** `handleAdminAuth()` in `hooks.server.ts` - redirects to `/admin/login` for any unauthenticated `/admin/**` request.

### UI components (shadcn-svelte)

Components live in `src/lib/components/ui/`. Import from the barrel:

```typescript
import {
	Button,
	Input,
	Label,
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
	CardDescription,
	Badge,
	Separator,
	Textarea,
	Alert,
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell
} from '$lib/components/ui';
```

All components accept a `class` prop for additional Tailwind classes. Variants are handled via `tailwind-variants` (`tv()`). The `cn()` utility in `$lib/utils` merges classes.

**Theme:** Warm amber/copper primary color defined in `src/app.css` via `@theme` (Tailwind v4). Edit `--color-primary` there to change the brand color.

## Cart

Cart is **client-side only** - stored in `localStorage` as JSON, managed by `CartStore` in `src/lib/states.svelte.ts`. No server-side cart session.

- `cart.add(item)` - adds or increments quantity
- `cart.update(productId, qty)` - set quantity (0 = remove)
- `cart.remove(productId)` - remove item
- `cart.clear()` - empty cart (called after successful order)
- `cart.load()` - restore from localStorage (call in `onMount`)
- `cart.total` - subtotal in cents
- `cart.count` - total item count

## Toasts

`ToastStore` in `src/lib/states.svelte.ts` manages non-blocking notifications. Render via `<Toaster />` component in the root layout.

- `toast.add(message, type, duration)` - show a toast ('success' | 'error' | 'info'), auto-removes after 3.5s
- `toast.remove(id)` - remove early

## i18n System

Custom Vite plugin (`src/lib/i18n-plugin.ts`) generates `src/lib/messages.ts` from JSON files in `messages/`. 3 locales: `de` (default), `en`, `tr`.

- **Message files:** `messages/*.json` - one file per feature area
- **Format:** Each key maps to an array of 3 translations `[de, en, tr]`
- **Generated file:** `src/lib/messages.ts` - never edit directly
- **Import:** `import * as m from '$lib/messages'`
- **Usage:** `m.shop_add_to_cart()` or `m.shop_free_shipping_notice({ threshold: '50,00 €' })`
- **Locale switching:** POST to `/api/locale` with `{ locale: 'de' | 'en' | 'tr' }`, sets cookie `LOCALE`
- **Adding messages:** Add key to `messages/*.json` (all 3 locales), hot reload updates types

## Shipping Logic

Configured via env vars (see `.env.template`):

- `PUBLIC_FREE_SHIPPING_THRESHOLD` - minimum order value in cents for free shipping (default: 5000 = 50€)
- `PUBLIC_SHIPPING_COST` - flat shipping cost in cents (default: 590 = 5.90€)

Logic lives in `src/routes/cart/+page.svelte` and `checkout/+page.svelte` - both read from `$env/dynamic/public`.

## Order Flow

1. Customer adds products to cart (client-side, localStorage)
2. Customer fills checkout form at `/checkout`
3. Form submits to `POST /api/orders` with `{ customer, items, shippingCost }`
4. Server validates, creates `orders` + `order_items` rows, returns `{ orderNumber }`
5. Cart is cleared, customer redirected to `/checkout/confirmation?order=HB-YYYY-XXXXX`
6. Admin manages orders at `/admin/orders`

**Payment:** Stripe Payment Element. Checkout is two-step: shipping form first, then payment. On submit, `POST /api/orders` creates the order + Stripe PaymentIntent and returns `{ clientSecret, orderNumber }`. The frontend initializes Stripe Elements with the clientSecret, mounts the PaymentElement, then calls `stripe.confirmPayment()` which redirects to the confirmation page. The webhook at `POST /api/stripe/webhook` (`payment_intent.succeeded` / `payment_intent.payment_failed`) updates `paymentStatus` and `status` in the DB.

Local webhook testing - run alongside `bun run dev`:

```bash
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

This prints a `whsec_...` signing secret - use it as `STRIPE_WEBHOOK_SECRET` in `.env` for dev.

## Auto-backup

On startup and every 24h, `db.sqlite` is copied to `backups/db-<timestamp>.sqlite`. Rolling 10-file limit. `backups/` is git-ignored.

## Email

Transactional email via Nodemailer (`src/lib/server/email.ts`). Used for order confirmations.

- `sendMail({ to, subject, html })` - generic sender
- Configured via SMTP env vars (optional - if not set, emails are skipped silently)

## Environment Variables

See `.env.template`. Required for local dev (copy to `.env`):

```
PORT                             # Server port (default 3000)
ADMIN_USERNAME                   # Admin login username (plaintext, compared at login time)
ADMIN_PASSWORD                   # Admin login password (plaintext, use HTTPS in production)
GOOGLE_CLIENT_ID                 # Google OAuth app client ID
GOOGLE_CLIENT_SECRET             # Google OAuth app client secret
GOOGLE_REDIRECT_URI              # e.g. http://localhost:5173/auth/google/callback
STRIPE_SECRET_KEY                # Stripe secret key (sk_test_... or sk_live_...)
STRIPE_WEBHOOK_SECRET            # Stripe webhook signing secret (whsec_...)
PUBLIC_STRIPE_PUBLISHABLE_KEY    # Stripe publishable key (pk_test_... or pk_live_...)
PUBLIC_FREE_SHIPPING_THRESHOLD   # Cents (e.g. 5000 = 50€)
PUBLIC_SHIPPING_COST             # Cents (e.g. 590 = 5.90€)
PUBLIC_SITE_URL                  # For absolute links + Stripe return_url
SMTP_HOST                        # SMTP server hostname (optional)
SMTP_PORT                        # SMTP port, e.g. 587 (optional)
SMTP_USER                        # SMTP username (optional)
SMTP_PASS                        # SMTP password (optional)
SMTP_FROM                        # Sender address, e.g. "Haci Baba <info@hacibaba.de>" (optional)
```

## Git

- Multiple small, thematically separated commits. Independent changes (UI, backend, bugfix) belong in separate commits.
- Do not add `Co-Authored-By` lines to commit messages.

## Code Style

- **TypeScript strict mode** is on - no implicit `any`.
- **Svelte 5 runes** (`$state`, `$derived`, `$effect`, `$props`) throughout.
- **Imports:** Use `$lib/` aliases, not relative paths from `src/`.
- **Prices:** Always integers in EUR cents. Never floats for money.
- **No em dashes:** Use regular hyphens (`-`). Em dashes (`—`) break tool-based text matching.
- **Language:** Variable names, function names, comments, type fields in English. User-facing UI text in German.
- **Formatting:** Prettier + ESLint. Run `bun run format` before committing.

## Key Gotchas

- `messages.ts` is auto-generated - run `bun run dev` once to generate it before `bun run check` works.
- Prices are **always EUR cents** (integer). `formatPrice(cents)` converts for display.
- `products.images` is a JSON string (`string[]`), not a native array. Parse it: `JSON.parse(product.images ?? '[]')`.
- `products.nutrition` is a JSON string (`NutritionInfo`). Parse before use. Use helper `parseProductData()` from `$lib/server/queries` which handles both.
- `orders.shippingAddress` is a JSON string (`ShippingAddress`). Parse before use.
- Product names are localized columns (`name_de`, `name_en`, `name_tr`). Use `localizedName(product, locale)` - never hardcode one column.
- `db.sqlite` path is relative - always run commands from the project root.
- Cart state lives only in the browser (localStorage). Server-side renders don't have cart data.
- Admin session cookie is `httpOnly` - not accessible from JavaScript.
