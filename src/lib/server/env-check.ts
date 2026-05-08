import { env } from '$env/dynamic/private';

const REQUIRED_ENV_VARS: Array<keyof typeof env> = ['ADMIN_USERNAME', 'ADMIN_PASSWORD'];

export function checkRequiredEnvVars(): void {
	const missing = REQUIRED_ENV_VARS.filter((key) => !env[key]);
	if (missing.length > 0) {
		console.error(`[startup] Missing required environment variables: ${missing.join(', ')}`);
		console.error('[startup] Copy .env.template to .env and fill in the values.');
		process.exit(1);
	}
}
