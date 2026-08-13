import type { AppProfile } from '../types';

export type StoredSession = {
  id: string;
  demographics: AppProfile;
  created_at: string;
};

export const SESSION_STORAGE_KEY = 'dialago-session-id';

export function readSessionId(): string | null {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeSessionId(id: string): void {
  localStorage.setItem(SESSION_STORAGE_KEY, id);
}

export function clearSessionId(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function createSession(profile: AppProfile): Promise<StoredSession> {
  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    throw new Error(`Failed to create session (${res.status})`);
  }

  return res.json() as Promise<StoredSession>;
}

export async function fetchSession(id: string): Promise<StoredSession | null> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch session (${res.status})`);
  }
  return res.json() as Promise<StoredSession>;
}
