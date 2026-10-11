import type { Provider, ProviderRequest } from "./types";
import { ProviderError, readError } from "./util";

const HEADERS = (apiKey: string) => ({
  "Content-Type": "application/json",
  "x-api-key": apiKey.trim(),
  "anthropic-version": "2023-06-01",
  // Required to allow direct browser calls without a server proxy.
  "anthropic-dangerous-direct-browser-access": "true",
});

export const anthropic: Provider = {
  id: "anthropic",
  label: "Anthropic (Claude)",
  keyLabel: "Anthropic API key",
  keyHint: "Starts with sk-ant-… Create one at console.anthropic.com.",
  docsUrl: "https://console.anthropic.com/settings/keys",
  models: [
    "claude-sonnet-4-5",
    "claude-haiku-4-5",
    "claude-3-7-sonnet-latest",
    "claude-3-5-haiku-latest",
  ],
  fallbacks: ["claude-haiku-4-5"],

  async complete({ system, user, settings, signal }: ProviderRequest) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: HEADERS(settings.apiKey),
      body: JSON.stringify({
        model: settings.model.trim(),
        max_tokens: 4096,
        temperature: 0.2,
        system,
        messages: [
          { role: "user", content: user },
          // Prefill so the reply begins as JSON and stays on-schema.
          { role: "assistant", content: "{" },
        ],
      }),
      signal,
    });

    if (!res.ok) throw new ProviderError(await readError(res), res.status);
    const data = await res.json();
    const text =
      (data?.content ?? [])
        .map((part: { text?: string }) => part?.text ?? "")
        .join("") || "";
    return text.startsWith("{") ? text : `{${text}`;
  },

  async listModels(settings, signal) {
    const res = await fetch("https://api.anthropic.com/v1/models?limit=100", {
      headers: HEADERS(settings.apiKey),
      signal,
    });
    if (!res.ok) throw new ProviderError(await readError(res), res.status);
    const data = await res.json();
    const list = (data?.data ?? []) as Array<{ id?: string }>;
    return list.map((m) => m.id ?? "").filter(Boolean);
  },
};
