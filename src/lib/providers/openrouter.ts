import type { Provider, ProviderRequest } from "./types";
import { ProviderError, readError } from "./util";

const DEFAULT_BASE = "https://openrouter.ai/api/v1";

/** Batch, image, speech and embedding models aren't usable for a text review. */
const SKIP = /:batch|:free|image|tts|lyria|embed|audio|video/i;

export const openrouter: Provider = {
  id: "openrouter",
  label: "OpenRouter",
  keyLabel: "OpenRouter API key",
  keyHint: "Starts with sk-or-… Create one at openrouter.ai/keys.",
  docsUrl: "https://openrouter.ai/keys",
  models: [
    "google/gemini-3.8-flash",
    "google/gemini-3.7-flash",
    "google/gemini-3.6-flash",
    "google/gemini-3.5-flash",
    "google/gemini-3.5-flash-lite",
  ],
  fallbacks: [
    "google/gemini-3.7-flash",
    "google/gemini-3.6-flash",
    "google/gemini-3.5-flash",
  ],

  async complete({ system, user, settings, signal }: ProviderRequest) {
    const base =
      settings.baseUrl.trim().replace(/\/+$/, "") || DEFAULT_BASE;
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey.trim()}`,
        // Optional attribution headers OpenRouter uses for rankings.
        "HTTP-Referer": window.location.origin,
        "X-Title": "Resume Analyzer",
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
    const base =
      settings.baseUrl.trim().replace(/\/+$/, "") || DEFAULT_BASE;
    const res = await fetch(`${base}/models`, { signal });
    if (!res.ok) throw new ProviderError(await readError(res), res.status);
    const data = await res.json();
    const list = (data?.data ?? []) as Array<{ id?: string }>;
    return list
      .map((m) => m.id ?? "")
      .filter((id) => id && !SKIP.test(id))
      .sort((a, b) => a.localeCompare(b));
  },
};
