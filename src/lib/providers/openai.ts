import type { Provider, ProviderRequest } from "./types";
import { ProviderError, readError } from "./util";

export const openai: Provider = {
  id: "openai",
  label: "OpenAI",
  keyLabel: "OpenAI API key",
  keyHint: "Starts with sk-… Create one at platform.openai.com.",
  docsUrl: "https://platform.openai.com/api-keys",
  models: [
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-4.1",
    "gpt-4.1-mini",
    "o4-mini",
  ],
  fallbacks: ["gpt-4o-mini", "gpt-4.1-mini"],

  async complete({ system, user, settings, signal }: ProviderRequest) {
    const base =
      settings.baseUrl.trim().replace(/\/+$/, "") || "https://api.openai.com/v1";
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.model.trim(),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
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
      settings.baseUrl.trim().replace(/\/+$/, "") || "https://api.openai.com/v1";
    const res = await fetch(`${base}/models`, {
      headers: { Authorization: `Bearer ${settings.apiKey.trim()}` },
      signal,
    });
    if (!res.ok) throw new ProviderError(await readError(res), res.status);
    const data = await res.json();
    const list = (data?.data ?? []) as Array<{ id?: string }>;
    return list
      .map((m) => m.id ?? "")
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  },
};
