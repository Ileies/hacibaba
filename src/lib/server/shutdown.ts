import { sqlite } from '$lib/server/db';

export function registerShutdownHandler(): void {
	process.once('SIGTERM', () => {
		sqlite.close();
		process.exit(0);
	});
	process.once('SIGINT', () => {
		sqlite.close();
		process.exit(0);
	});
}
