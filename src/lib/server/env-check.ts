const REQUIRED_ENV_VARS = [
	'ADMIN_USERNAME',
	'ADMIN_PASSWORD'
	//'STRIPE_SECRET_KEY',
	//'STRIPE_WEBHOOK_SECRET'
];

export function checkRequiredEnvVars(): void {
	const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
	if (missing.length > 0) {
		console.error(`[startup] Missing required environment variables: ${missing.join(', ')}`);
		console.error('[startup] Copy .env.template to .env and fill in the values.');
		process.exit(1);
	}
}
