/**
 * Browser-only fallback auth, used when Supabase is not configured so the
 * login / signup flow stays fully runnable without a backend.
 *
 * Passwords are stored as a salted SHA-256 digest in localStorage. This is a
 * demo convenience, not real security — it never leaves the browser. Add
 * Supabase credentials to switch to real authentication.
 */

export interface LocalSession {
  id: string;
  email: string;
}

interface LocalUser {
  id: string;
  email: string;
  salt: string;
  hash: string;
  createdAt: number;
}

const USERS_KEY = "ra.auth.users.v1";
const SESSION_KEY = "ra.auth.session.v1";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

function id(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2) + Date.now().toString(36)
  );
}

async function digest(password: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  if (globalThis.crypto?.subtle) {
    const out = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(out)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Non-secure-context fallback: not cryptographic, demo only.
  let h = 5381;
  for (const b of bytes) h = ((h << 5) + h + b) >>> 0;
  return h.toString(16);
}

export function getLocalSession(): LocalSession | null {
  return readJSON<LocalSession | null>(SESSION_KEY, null);
}

function setLocalSession(session: LocalSession | null) {
  if (session) {
    writeJSON(SESSION_KEY, session);
  } else {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }
}

export async function signUpLocal(
  email: string,
  password: string,
): Promise<{ error: string | null; needsConfirmation?: boolean }> {
  const normalized = email.trim().toLowerCase();
  const users = readJSON<LocalUser[]>(USERS_KEY, []);
  if (users.some((u) => u.email === normalized)) {
    return { error: "An account with that email already exists. Sign in instead." };
  }
  const salt = id();
  const hash = await digest(password, salt);
  const user: LocalUser = {
    id: id(),
    email: normalized,
    salt,
    hash,
    createdAt: Date.now(),
  };
  writeJSON(USERS_KEY, [...users, user]);
  setLocalSession({ id: user.id, email: user.email });
  return { error: null, needsConfirmation: false };
}

export async function signInLocal(
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  const normalized = email.trim().toLowerCase();
  const users = readJSON<LocalUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.email === normalized);
  if (!user || (await digest(password, user.salt)) !== user.hash) {
    return { error: "Incorrect email or password." };
  }
  setLocalSession({ id: user.id, email: user.email });
  return { error: null };
}

export function signOutLocal() {
  setLocalSession(null);
}

export function resetPasswordLocal(): { error: string | null } {
  return {
    error:
      "Password recovery needs to send email, which local mode can't. Add Supabase keys to enable it.",
  };
}
