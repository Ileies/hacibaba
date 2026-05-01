# Hacibaba - Webshop

Premium Lokum (Turkish delight) webshop for the German B2B market. Built with SvelteKit, Bun, SQLite, and Drizzle ORM.

## Quick Start

```bash
cp .env.template .env
bun install
bun run drizzle:push
bun run dev
```

Then open [http://localhost:5173](http://localhost:5173) for the shop and [http://localhost:5173/admin](http://localhost:5173/admin) for the admin panel.

## Tech Stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes)
- **Runtime:** Bun
- **Database:** SQLite via Drizzle ORM
- **Styling:** Tailwind CSS v4 + shadcn-svelte components
- **i18n:** Custom Vite plugin (DE/EN/TR)
- **Auth:** Customer auth (email/password + Google OAuth) + static admin via `.env`
- **Payments:** Stripe Payment Element
- **Email:** Nodemailer (order confirmations, optional SMTP config)

## Project Structure

See [CLAUDE.md](CLAUDE.md) for full architecture documentation.

## Production

```bash
bun run build
bun build/index.js
```
