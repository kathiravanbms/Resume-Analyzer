import type { ProviderId, Settings } from "../types";

export interface ProviderRequest {
  system: string;
  user: string;
  settings: Settings;
  signal?: AbortSignal;
}

export interface Provider {
  id: ProviderId;
  label: string;
  keyLabel: string;
  keyHint: string;
  docsUrl: string;
  models: string[];
  /** Models tried, in order, when the primary returns a transient error. */
  fallbacks?: string[];
  complete(req: ProviderRequest): Promise<string>;
  /** Fetch the models this key can currently use. Optional per provider. */
  listModels?(settings: Settings, signal?: AbortSignal): Promise<string[]>;
}
