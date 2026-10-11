import type { ProviderId } from "../types";
import { openai } from "./openai";
import { anthropic } from "./anthropic";
import { gemini } from "./gemini";
import { openrouter } from "./openrouter";
import { opencodeGo } from "./opencode-go";
import type { Provider } from "./types";

export const providerList: Provider[] = [
  openai,
  gemini,
  openrouter,
  opencodeGo,
  anthropic,
];

export const providers: Record<ProviderId, Provider> = {
  openai,
  gemini,
  openrouter,
  "opencode-go": opencodeGo,
  anthropic,
};

export function getProvider(id: ProviderId): Provider {
  return providers[id] ?? openai;
}

export type { Provider, ProviderRequest } from "./types";
export { extractJson, friendlyError } from "./util";
