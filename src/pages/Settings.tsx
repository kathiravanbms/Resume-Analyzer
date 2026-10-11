import { useCallback, useEffect, useState } from "react";
import { Button, Field, Input, Panel, PanelHeader, Select, Spinner, Tag } from "../components/ui";
import { useApp } from "../context/AppContext";
import { getProvider, providerList } from "../lib/providers";
import type { ProviderId, Settings } from "../lib/types";

/** Chosen when the current model is not in the provider's live list. */
const PREFERRED: Record<ProviderId, string[]> = {
  gemini: ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"],
  openai: ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o", "gpt-4.1"],
  anthropic: ["claude-haiku-4-5", "claude-sonnet-4-5"],
  openrouter: ["google/gemini-3.8-flash", "google/gemini-3.5-flash"],
  "opencode-go": ["deepseek-v4-flash", "deepseek-v4.1-flash", "glm-5.3"],
};

const NON_CHAT = /(image|tts|audio|embed|embedding|whisper|realtime|transcribe|live|vision|moderation|dall-e|sora|veo|robotics|omni|lyria|:batch|:free)/i;

/** Google still lists these but refuses to generate with them for new keys. */
const RETIRED = /^(gemini-2\.5|gemini-2\.0|gemini-1\.5|gemini-1\.0)/i;

function pickDefaultModel(list: string[], provider: ProviderId): string | undefined {
  for (const want of PREFERRED[provider]) {
    if (list.includes(want)) return want;
  }
  return list.find((m) => !NON_CHAT.test(m)) ?? list[0];
}

export default function SettingsPage() {
  const { settings, updateSettings, isConfigured, clearHistory, history } =
    useApp();
  const [draft, setDraft] = useState(settings);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const provider = getProvider(draft.provider);
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
  const suggestions = models.length ? models : provider.models;
  const currentMissing =
    models.length > 0 &&
    (!models.includes(draft.model.trim()) ||
      (draft.provider === "gemini" && RETIRED.test(draft.model.trim())));

  const loadModels = useCallback(async (src: Settings) => {
    const p = getProvider(src.provider);
    if (!p.listModels) return;
    // OpenRouter's and OpenCode Go's catalogues are public; others need the key.
    if (
      !src.apiKey.trim() &&
      src.provider !== "openrouter" &&
      src.provider !== "opencode-go"
    ) {
      setModelError("Add an API key to load the model list.");
      return;
    }
    setLoadingModels(true);
    setModelError(null);
    try {
      const list = await p.listModels(src);
      setModels(list);
      const current = src.model.trim().replace(/^models\//, "");
      const retired = src.provider === "gemini" && RETIRED.test(current);
      if (list.length && (!list.includes(current) || retired)) {
        const pick = pickDefaultModel(list, src.provider);
        if (pick && pick !== current) setDraft((d) => ({ ...d, model: pick }));
      }
    } catch (err) {
      setModelError(
        err instanceof Error ? err.message : "Could not load models.",
      );
      setModels([]);
    } finally {
      setLoadingModels(false);
    }
  }, []);

  // Load the live model list once on mount when a key is already present.
  useEffect(() => {
    if (settings.apiKey.trim()) void loadModels(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeProvider(id: ProviderId) {
    const next = getProvider(id);
    const nextDraft: Settings = {
      ...draft,
      provider: id,
      model: next.models.includes(draft.model) ? draft.model : next.models[0],
      baseUrl:
        id === "openai" || id === "openrouter" || id === "opencode-go"
          ? draft.baseUrl
          : "",
    };
    setDraft(nextDraft);
    setModels([]);
    setModelError(null);
    setSaved(false);
    if (nextDraft.apiKey.trim()) void loadModels(nextDraft);
  }

  function save() {
    updateSettings(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
        Settings
      </h1>
      <p className="mt-3 max-w-[65ch] text-ink-soft">
        Bring your own API key. It is stored only in this browser and sent
        directly to the provider you choose — never to us.
      </p>

      <Panel className="mt-8">
        <PanelHeader
          label="Provider"
          right={
            isConfigured ? (
              <Tag tone="pass">Ready</Tag>
            ) : (
              <Tag tone="warn">Not configured</Tag>
            )
          }
        />
        <div className="space-y-5 p-4">
          <Field label="Provider" htmlFor="provider">
            <Select
              id="provider"
              value={draft.provider}
              onChange={(e) => changeProvider(e.target.value as ProviderId)}
            >
              {providerList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </Select>
          </Field>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                Model
              </span>
              <button
                type="button"
                onClick={() => void loadModels(draft)}
                disabled={
                  loadingModels ||
                  (!draft.apiKey.trim() &&
                    draft.provider !== "openrouter" &&
                    draft.provider !== "opencode-go")
                }
                className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-link transition-colors hover:text-ink disabled:opacity-40"
              >
                {loadingModels ? <Spinner className="size-3" /> : null}
                {loadingModels ? "Loading…" : "Load models"}
              </button>
            </div>
            <Input
              id="model"
              list="model-suggestions"
              value={draft.model}
              onChange={(e) =>
                setDraft((d) => ({ ...d, model: e.target.value }))
              }
              placeholder={suggestions[0]}
            />
            <datalist id="model-suggestions">
              {suggestions.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <p className="mt-1.5 font-mono text-[0.68rem] leading-relaxed text-muted">
              {models.length
                ? `${models.length} models available on this key. `
                : "Pick a suggestion or type any model ID. "}
              <a
                href={provider.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link underline"
              >
                Get a {provider.label} key
              </a>
            </p>
            {modelError ? (
              <p className="mt-1.5 font-mono text-[0.68rem] leading-relaxed text-fail">
                {modelError}
              </p>
            ) : null}
            {currentMissing ? (
              <p className="mt-1.5 font-mono text-[0.68rem] leading-relaxed text-warn">
                “{draft.model}” is not in this key's list — pick one from the
                suggestions.
              </p>
            ) : null}
          </div>

          <Field label={provider.keyLabel} htmlFor="api-key" hint={provider.keyHint}>
            <div className="flex">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                value={draft.apiKey}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, apiKey: e.target.value }))
                }
                onBlur={() => {
                  if (draft.apiKey.trim() && draft.apiKey !== settings.apiKey) {
                    void loadModels(draft);
                  }
                }}
                placeholder="sk-…"
                className="border-r-0"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="shrink-0 border border-rule px-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </Field>

          {draft.provider === "openai" ||
          draft.provider === "openrouter" ||
          draft.provider === "opencode-go" ? (
            <Field
              label="API base URL (optional)"
              htmlFor="base-url"
              hint={
                draft.provider === "opencode-go"
                  ? "OpenCode Go blocks browser requests (no CORS). Enter a proxy URL that forwards to opencode.ai and adds CORS headers."
                  : "Override for Azure, a proxy, or another OpenAI-compatible endpoint. Leave blank for the default."
              }
            >
              <Input
                id="base-url"
                value={draft.baseUrl}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, baseUrl: e.target.value }))
                }
                placeholder="https://api.openai.com/v1"
              />
            </Field>
          ) : null}
        </div>

        <div className="flex items-center gap-3 border-t border-rule p-4">
          <Button onClick={save} disabled={!dirty && !saved}>
            Save settings
          </Button>
          {saved ? (
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-pass">
              Saved
            </span>
          ) : dirty ? (
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
              Unsaved changes
            </span>
          ) : null}
        </div>
      </Panel>

      <Panel className="mt-6">
        <PanelHeader label="Privacy" />
        <ul className="divide-y divide-rule">
          {[
            "Resume files are parsed in your browser. Nothing is uploaded to a Resume Analyzer server — there isn't one.",
            `Running a review sends your resume text to ${provider.label} under your own account and their terms.`,
            "Your key and history live in this browser's local storage. Clearing them removes all local data.",
          ].map((line) => (
            <li key={line} className="flex gap-3 px-4 py-3 text-sm text-ink-soft">
              <span className="font-mono text-pass">+</span>
              {line}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="mt-6 border-fail/40">
        <PanelHeader label="Delete" right="cannot be undone" />
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <p className="text-sm text-ink-soft">
            Delete all saved reviews ({history.length}) from this browser.
          </p>
          <Button
            variant="danger"
            onClick={() => {
              if (
                window.confirm(
                  "Delete all saved reviews from this browser? This can't be undone.",
                )
              ) {
                clearHistory();
              }
            }}
            disabled={!history.length}
          >
            Clear history
          </Button>
        </div>
      </Panel>
    </div>
  );
}
