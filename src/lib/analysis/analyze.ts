import type { AnalysisResult, Settings } from "../types";
import { getProvider } from "../providers";
import { friendlyError, isTransient, sleep } from "../providers/util";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import { parseResult } from "./validate";

export interface AnalyzeInput {
  resumeText: string;
  jobDescription?: string;
  settings: Settings;
  signal?: AbortSignal;
}

export interface AnalyzeOutput {
  result: AnalysisResult;
  /** The model that actually produced the result (may be a fallback). */
  model: string;
}

const MAX_ATTEMPTS = 3;

export async function analyzeResume({
  resumeText,
  jobDescription,
  settings,
  signal,
}: AnalyzeInput): Promise<AnalyzeOutput> {
  const provider = getProvider(settings.provider);

  if (!settings.apiKey.trim()) {
    throw new Error(
      `Add your ${provider.label} API key in Settings before running an analysis.`,
    );
  }
  if (!settings.model.trim()) {
    throw new Error("Choose a model in Settings before running an analysis.");
  }
  if (resumeText.trim().length < 120) {
    throw new Error(
      "The resume text is too short to analyze. Upload a full resume or paste more content.",
    );
  }

  // Primary model first, then the provider's fallbacks (deduplicated).
  const chain = [settings.model.trim(), ...(provider.fallbacks ?? [])]
    .map((m) => m.trim())
    .filter((m, i, all) => m.length > 0 && all.indexOf(m) === i);

  const system = buildSystemPrompt();
  const user = buildUserPrompt(resumeText, jobDescription);

  let lastError: unknown = null;

  for (const model of chain) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const text = await provider.complete({
          system,
          user,
          settings: { ...settings, model },
          signal,
        });
        if (!text.trim()) {
          throw new Error(`${provider.label} returned an empty response.`);
        }
        return { result: parseResult(text), model };
      } catch (err) {
        lastError = err;
        if (signal?.aborted) throw friendlyError(err, provider.label);
        // A non-transient error (bad key, blocked project) won't fix itself.
        if (!isTransient(err)) throw friendlyError(err, provider.label);
        // Back off before retrying the same model.
        if (attempt < MAX_ATTEMPTS - 1) await sleep(700 * 2 ** attempt);
      }
    }
    // This model stayed overloaded; move on to the next one in the chain.
  }

  throw friendlyError(lastError, provider.label);
}
