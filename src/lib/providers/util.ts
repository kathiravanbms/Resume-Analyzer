export async function readError(res: Response): Promise<string> {
  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      const message =
        json?.error?.message ??
        json?.message ??
        json?.error?.status ??
        json?.error;
      if (typeof message === "string") return message;
      if (message) return JSON.stringify(message);
    } catch {
      /* not json */
    }
    return text.slice(0, 400) || `${res.status} ${res.statusText}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

/** HTTP statuses worth retrying: rate limits and transient provider faults. */
const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

export class ProviderError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
  }
  get retryable(): boolean {
    return RETRYABLE_STATUS.has(this.status);
  }
}

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** True for errors a retry or a different model could plausibly fix. */
export function isTransient(err: unknown): boolean {
  if (err instanceof ProviderError) return err.retryable;
  if (err instanceof TypeError) return true; // network / CORS blip
  const m = err instanceof Error ? err.message : String(err);
  return /high demand|overloaded|over capacity|temporarily|try again|unavailable|rate limit|timeout|timed out/i.test(
    m,
  );
}

export function friendlyError(err: unknown, providerLabel: string): Error {
  if (err instanceof DOMException && err.name === "AbortError") {
    return new Error("Analysis cancelled.");
  }
  if (err instanceof TypeError) {
    return new Error(
      `Could not reach ${providerLabel}. Check your network connection, or the browser may be blocking the request (CORS).`,
    );
  }
  if (err instanceof Error) {
    const m = err.message;
    if (/denied access|PERMISSION_DENIED/i.test(m)) {
      return new Error(
        `${m}\n\nThe Google Cloud project behind this API key is blocked from generating content. This is set on Google's side, not by this app. Create a new API key in a new project at aistudio.google.com/app/apikey, then retry.`,
      );
    }
    if (/no longer available to new users|not found for API version|is not supported/i.test(m)) {
      return new Error(
        `${m}\n\nThis model has been retired. Open Settings and use "Load models" to pick a current one.`,
      );
    }
    if (/API key not valid|invalid.?x-api-key|Incorrect API key/i.test(m)) {
      return new Error(
        `${m}\n\nCheck that the key was pasted correctly and belongs to the selected provider.`,
      );
    }
    if (/high demand|overloaded|over capacity|temporarily|try again later|unavailable|rate limit/i.test(m)) {
      return new Error(
        `${m}\n\nThis is a temporary capacity limit on the provider. The app already retried and tried a fallback model. Wait a moment and run it again, or pick a different model in Settings.`,
      );
    }
    return err;
  }
  return new Error(String(err));
}

/**
 * Pull the first JSON object/array out of a model response that may be wrapped
 * in prose or fenced code blocks.
 */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    /* fall through to brace scan */
  }

  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error("The model did not return JSON.");
  const open = candidate[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        return JSON.parse(candidate.slice(start, i + 1));
      }
    }
  }
  throw new Error("The model returned malformed JSON.");
}
