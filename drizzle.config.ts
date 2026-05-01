import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: './db.sqlite' },
	verbose: true,
	strict: true
});
