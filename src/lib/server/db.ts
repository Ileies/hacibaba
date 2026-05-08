import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

export const sqlite = new Database(process.env.DB_PATH ?? 'db.sqlite');
// FK enforcement and WAL mode for concurrent reads
sqlite.exec('PRAGMA foreign_keys = ON');
sqlite.exec('PRAGMA journal_mode = WAL');

const db = drizzle({ client: sqlite, schema });
export default db;
