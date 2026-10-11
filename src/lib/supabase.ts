import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True when both public Supabase values are present in the environment. */
export const supabaseConfigured = Boolean(url?.trim() && anonKey?.trim());

let client: SupabaseClient | null = null;

/**
 * Returns the shared Supabase client, or throws a message the UI can show.
 * Kept lazy so the app builds and runs without credentials configured.
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment (see .env.example).",
    );
  }
  if (!client) {
    client = createClient(url!.trim(), anonKey!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
