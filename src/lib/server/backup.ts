import { unlink } from 'fs/promises';
import { join } from 'path';

const DB_PATH = process.env.DB_PATH ?? join(process.cwd(), 'db.sqlite');
const BACKUPS_DIR = join(process.cwd(), 'backups');
const MAX_BACKUPS = 10;
const MIN_INTERVAL_MS = 24 * 60 * 60 * 1000;

async function getLatestBackupTime(): Promise<number> {
	const files: string[] = [];
	for await (const f of new Bun.Glob('db-*.sqlite').scan(BACKUPS_DIR)) files.push(f);
	if (files.length === 0) return 0;
	files.sort();
	const latest = files[files.length - 1];
	const match = latest.match(/db-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/);
	if (!match) return 0;
	return new Date(match[1].replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3')).getTime();
}

export async function backupDatabase() {
	await Bun.$`mkdir -p ${BACKUPS_DIR}`.quiet();

	const lastBackup = await getLatestBackupTime();
	if (Date.now() - lastBackup < MIN_INTERVAL_MS) {
		console.log('[backup] Skipped - last backup less than 24h ago.');
		return;
	}

	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
	const dest = join(BACKUPS_DIR, `db-${timestamp}.sqlite`);
	await Bun.write(dest, Bun.file(DB_PATH));
	console.log(`[backup] Database backed up to backups/db-${timestamp}.sqlite`);

	const files: string[] = [];
	for await (const f of new Bun.Glob('db-*.sqlite').scan(BACKUPS_DIR)) files.push(f);
	files.sort();
	for (const old of files.slice(0, -MAX_BACKUPS)) {
		await unlink(join(BACKUPS_DIR, old)).catch(() => {});
	}
}
