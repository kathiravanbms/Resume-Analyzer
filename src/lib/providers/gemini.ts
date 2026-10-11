import type { Provider, ProviderRequest } from "./types";
import { ProviderError, readError } from "./util";

const BASE = "https://generativelanguage.googleapis.com/v1beta";

export const gemini: Provider = {
  id: "gemini",
  label: "Google Gemini",
  keyLabel: "Gemini API key",
  keyHint: "Create one for free at aistudio.google.com/app/apikey.",
  docsUrl: "https://aistudio.google.com/app/apikey",
  models: [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-pro-preview",
  ],
  fallbacks: ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash"],

  async complete({ system, user, settings, signal }: ProviderRequest) {
    const model = settings.model.trim().replace(/^models\//, "");
    const res = await fetch(
      `${BASE}/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": settings.apiKey.trim(),
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
        signal,
      },
    );

    if (!res.ok) throw new ProviderError(await readError(res), res.status);
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    return parts.map((p: { text?: string }) => p?.text ?? "").join("");
  },

  async listModels(settings, signal) {
    const res = await fetch(`${BASE}/models?pageSize=200`, {
      headers: { "x-goog-api-key": settings.apiKey.trim() },
      signal,
    });
    if (!res.ok) throw new ProviderError(await readError(res), res.status);
    const data = await res.json();
    const models = (data?.models ?? []) as Array<{
      name?: string;
      supportedGenerationMethods?: string[];
    }>;
    return models
      .filter(
        (m) =>
          !m.supportedGenerationMethods ||
          m.supportedGenerationMethods.includes("generateContent"),
      )
      .map((m) => (m.name ?? "").replace(/^models\//, ""))
      .filter(Boolean);
  },
};
