import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "../lib/supabase";
import {
  getLocalSession,
  resetPasswordLocal,
  signInLocal,
  signOutLocal,
  signUpLocal,
} from "../lib/localAuth";

export interface AuthUser {
  id: string;
  email?: string;
}

export interface AuthResult {
  error: string | null;
  /** Supabase signup succeeded but requires email confirmation before sign-in. */
  needsConfirmation?: boolean;
}

/** Which auth backend is live: real Supabase, or the local browser fallback. */
export type AuthBackend = "supabase" | "local";

const BACKEND: AuthBackend = supabaseConfigured ? "supabase" : "local";

interface AuthState {
  backend: AuthBackend;
  /** True while the initial session is being restored. */
  loading: boolean;
  user: AuthUser | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthState | null>(null);

function message(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      const local = getLocalSession();
      setUser(local ? { id: local.id, email: local.email } : null);
      setLoading(false);
      return;
    }

    let active = true;
    const supabase = getSupabase();

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback<AuthState["signIn"]>(async (email, password) => {
    if (!supabaseConfigured) {
      const result = await signInLocal(email, password);
      if (!result.error) {
        const local = getLocalSession();
        setUser(local ? { id: local.id, email: local.email } : null);
      }
      return result;
    }
    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ? error.message : null };
    } catch (err) {
      return { error: message(err) };
    }
  }, []);

  const signUp = useCallback<AuthState["signUp"]>(async (email, password) => {
    if (!supabaseConfigured) {
      const result = await signUpLocal(email, password);
      if (!result.error) {
        const local = getLocalSession();
        setUser(local ? { id: local.id, email: local.email } : null);
      }
      return result;
    }
    try {
      const { data, error } = await getSupabase().auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) return { error: error.message };
      return { error: null, needsConfirmation: !data.session && Boolean(data.user) };
    } catch (err) {
      return { error: message(err) };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabaseConfigured) {
      signOutLocal();
      setUser(null);
      return;
    }
    try {
      await getSupabase().auth.signOut();
    } catch {
      /* ignore */
    }
  }, []);

  const resetPassword = useCallback<AuthState["resetPassword"]>(async (email) => {
    if (!supabaseConfigured) {
      return resetPasswordLocal();
    }
    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return { error: error ? error.message : null };
    } catch (err) {
      return { error: message(err) };
    }
  }, []);

  const resendConfirmation = useCallback<AuthState["resendConfirmation"]>(
    async (email) => {
      if (!supabaseConfigured) {
        return { error: null };
      }
      try {
        const { error } = await getSupabase().auth.resend({
          type: "signup",
          email,
        });
        return { error: error ? error.message : null };
      } catch (err) {
        return { error: message(err) };
      }
    },
    [],
  );

  const value = useMemo<AuthState>(
    () => ({
      backend: BACKEND,
      loading,
      user,
      session,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendConfirmation,
    }),
    [loading, user, session, signIn, signUp, signOut, resetPassword, resendConfirmation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
