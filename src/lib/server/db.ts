import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

export const sqlite = new Database(process.env.DB_PATH ?? 'db.sqlite');
// FK enforcement and WAL mode for concurrent reads
sqlite.run('PRAGMA foreign_keys = ON');
sqlite.run('PRAGMA journal_mode = WAL');

const db = drizzle({ client: sqlite, schema });
export default db;
