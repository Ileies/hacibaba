import { unlink, readdir, mkdir, copyFile } from 'fs/promises';
import { join } from 'path';

const DB_PATH = process.env.DB_PATH ?? join(process.cwd(), 'db.sqlite');
const BACKUPS_DIR = join(process.cwd(), 'backups');
const MAX_BACKUPS = 10;
const MIN_INTERVAL_MS = 24 * 60 * 60 * 1000;

async function getLatestBackupTime(): Promise<number> {
	let entries: string[];
	try {
		entries = await readdir(BACKUPS_DIR);
	} catch {
		return 0;
	}
	const files = entries.filter((f) => /^db-.*\.sqlite$/.test(f)).sort();
	if (files.length === 0) return 0;
	const latest = files[files.length - 1];
	const match = latest.match(/db-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/);
	if (!match) return 0;
	return new Date(match[1].replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3')).getTime();
}

export async function backupDatabase() {
	await mkdir(BACKUPS_DIR, { recursive: true });

	const lastBackup = await getLatestBackupTime();
	if (Date.now() - lastBackup < MIN_INTERVAL_MS) {
		console.log('[backup] Skipped - last backup less than 24h ago.');
		return;
	}

	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
	const dest = join(BACKUPS_DIR, `db-${timestamp}.sqlite`);
	await copyFile(DB_PATH, dest);
	console.log(`[backup] Database backed up to backups/db-${timestamp}.sqlite`);

	const entries = await readdir(BACKUPS_DIR);
	const files = entries.filter((f) => /^db-.*\.sqlite$/.test(f)).sort();
	for (const old of files.slice(0, -MAX_BACKUPS)) {
		await unlink(join(BACKUPS_DIR, old)).catch(() => {});
	}
}
