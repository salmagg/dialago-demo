import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DB_DIR = path.join(process.cwd(), 'db');
const DB_PATH = path.join(DB_DIR, 'sessions.sqlite');
const SCHEMA_PATH = path.join(DB_DIR, 'schema.sql');

export type SessionDemographics = {
  profession: { presetId: string; manual: boolean; customText: string };
  location: { presetId: string; manual: boolean; customText: string };
  nativeLanguage: { presetId: string; manual: boolean; customText: string };
  focus: { presetId: string; manual: boolean; customText: string };
  goal: { presetId: string; manual: boolean; customText: string };
  hometown: string;
};

export type SessionRow = {
  id: string;
  demographics: SessionDemographics;
  created_at: string;
};

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);

  return db;
}

export function createSession(demographics: SessionDemographics): SessionRow {
  const conn = getDb();
  const id = randomUUID();
  const demographicsJson = JSON.stringify(demographics);

  conn
    .prepare('INSERT INTO sessions (id, demographics) VALUES (?, ?)')
    .run(id, demographicsJson);

  const row = conn.prepare('SELECT id, demographics, created_at FROM sessions WHERE id = ?').get(id) as {
    id: string;
    demographics: string;
    created_at: string;
  };

  return {
    id: row.id,
    demographics: JSON.parse(row.demographics) as SessionDemographics,
    created_at: row.created_at,
  };
}

export function getSession(id: string): SessionRow | null {
  const conn = getDb();
  const row = conn.prepare('SELECT id, demographics, created_at FROM sessions WHERE id = ?').get(id) as
    | { id: string; demographics: string; created_at: string }
    | undefined;

  if (!row) return null;

  return {
    id: row.id,
    demographics: JSON.parse(row.demographics) as SessionDemographics,
    created_at: row.created_at,
  };
}
