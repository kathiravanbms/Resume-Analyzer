import type { AnalysisRecord, Settings } from "./types";

const SETTINGS_KEY = "ra.settings.v1";
const HISTORY_KEY = "ra.history.v1";
const LAST_KEY = "ra.last.v1";

export const defaultSettings: Settings = {
  provider: "gemini",
  model: "gemini-3.8-flash",
  apiKey: "",
  baseUrl: "",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

export function loadSettings(): Settings {
  return { ...defaultSettings, ...read<Partial<Settings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: Settings) {
  write(SETTINGS_KEY, settings);
}

export function loadHistory(): AnalysisRecord[] {
  const list = read<AnalysisRecord[]>(HISTORY_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function saveHistory(list: AnalysisRecord[]) {
  write(HISTORY_KEY, list.slice(0, 50));
}

export function loadLast(): AnalysisRecord | null {
  return read<AnalysisRecord | null>(LAST_KEY, null);
}

export function saveLast(record: AnalysisRecord | null) {
  write(LAST_KEY, record);
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
