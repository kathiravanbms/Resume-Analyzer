import type { Provider, ProviderRequest } from "./types";
import type { Settings } from "../types";
import { ProviderError, readError } from "./util";

const DEFAULT_BASE = "https://opencode.ai/zen/go/v1";

/**
 * OpenCode Go sends no CORS headers, so a browser cannot call it directly.
 * In local dev the Vite server exposes a same-origin proxy at /api/opencode;
 * use it automatically when no base URL is set. Any explicit value wins.
 */
function resolveBase(settings: Settings): string {
  const explicit = settings.baseUrl.trim().replace(/\/+$/, "");
  if (explicit) return explicit;
  // Same-origin proxy for OpenCode Go: the Vite dev server locally, or the
  // serverless function (api/opencode) on Vercel / Netlify in production.
  return "/api/opencode";
}

/**
 * OpenCode Go asks clients to send a stable session id in x-opencode-session
 * so it can optimize routing and prompt caching. Persist one per browser.
 */
const SESSION_KEY = "ra.opencode.session.v1";

function sessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        globalThis.crypto?.randomUUID?.() ??
        Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "resume-analyzer-session";
  }
}

/** Multimodal-only entries aren't usable for a text review. */
const SKIP = /vision|image|tts|audio|embed/i;

export const opencodeGo: Provider = {
  id: "opencode-go",
  label: "OpenCode Go",
  keyLabel: "OpenCode API key",
  keyHint: "Create one at opencode.ai. In the browser this endpoint needs a CORS proxy.",
  docsUrl: "https://opencode.ai/docs/go",
  models: [
    "deepseek-v4-flash",
    "deepseek-v4.1-flash",
    "deepseek-v4-pro",
    "glm-5.3",
    "kimi-k3",
    "qwen3.8-max",
    "gpt-6-luna",
    "grok-4.7",
  ],
  fallbacks: ["deepseek-v4.1-flash", "glm-5.3", "qwen3.8-flash"],

  async complete({ system, user, settings, signal }: ProviderRequest) {
    const base = resolveBase(settings);
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey.trim()}`,
        "x-opencode-session": sessionId(),
      },
      body: JSON.stringify({
        model: settings.model.trim(),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
      }),
      signal,
    });

    if (!res.ok) throw new ProviderError(await readError(res), res.status);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  },

  async listModels(settings, signal) {
    const base = resolveBase(settings);
    const headers: Record<string, string> = { "x-opencode-session": sessionId() };
    if (settings.apiKey.trim()) {
      headers.Authorization = `Bearer ${settings.apiKey.trim()}`;
    }
    const res = await fetch(`${base}/models`, { headers, signal });
    if (!res.ok) throw new ProviderError(await readError(res), res.status);
    const data = await res.json();
    const list = (data?.data ?? []) as Array<{ id?: string }>;
    return list
      .map((m) => m.id ?? "")
      .filter((id) => id && !SKIP.test(id))
      .sort((a, b) => a.localeCompare(b));
  },
};
