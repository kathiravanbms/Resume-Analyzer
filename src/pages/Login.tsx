import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Button,
  Field,
  Input,
  Panel,
  PanelHeader,
  ParseRow,
  Spinner,
} from "../components/ui";
import {
  AuthShell,
  LiveParse,
  Notice,
  PasswordInput,
} from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { isEmail } from "../lib/auth-utils";

type Mode = "signin" | "reset" | "reset-sent";

export default function Login() {
  const navigate = useNavigate();
  const { user, backend, signIn, resetPassword } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate("/analyze", { replace: true });
  }, [user, navigate]);

  const status = submitting
    ? "checking"
    : error
      ? "rejected"
      : mode === "reset-sent"
        ? "link sent"
        : user
          ? "signed in"
          : email.trim() && password
            ? "ready"
            : "idle";

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setError(null);

    if (!isEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (mode === "reset") {
      setSubmitting(true);
      const { error: resetError } = await resetPassword(email.trim());
      setSubmitting(false);
      if (resetError) setError(resetError);
      else setMode("reset-sent");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) setError(signInError);
  }

  const title = mode === "signin" ? "Sign in to your record." : "Reset your password.";
  const lede =
    mode === "signin"
      ? "An account identifies you to Resume Analyzer. Resume files are still parsed in this browser and sent only to the provider you choose."
      : "Enter the email on your account and Supabase will send a reset link.";

  return (
    <AuthShell
      title={title}
      lede={lede}
      readout={<LiveParse email={email} password={password} status={status} />}
    >
      <Panel>
        <PanelHeader
          label="Access"
          right={mode === "signin" ? "sign in" : "recovery"}
        />

        {mode === "reset-sent" ? (
          <div className="space-y-5 p-4">
            <Notice tone="pass" label="Sent">
              If an account exists for <strong className="text-ink">{email.trim()}</strong>,
              a reset link is on its way from Supabase. Follow it to set a new
              password.
            </Notice>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
            >
              Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="space-y-5 p-4">
              {error ? (
                <Notice tone="fail" label="Failed">
                  {error}
                </Notice>
              ) : null}

              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@work.com"
                />
              </Field>

              {mode === "signin" ? (
                <Field label="Password" htmlFor="password">
                  <PasswordInput
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    show={show}
                    onToggle={() => setShow((v) => !v)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                  />
                </Field>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? <Spinner className="size-4" /> : null}
                {mode === "signin"
                  ? submitting
                    ? "Signing in…"
                    : "Sign in"
                  : submitting
                    ? "Sending…"
                    : "Send reset link"}
              </Button>

              <div className="flex flex-wrap items-center justify-between gap-3">
                {mode === "signin" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("reset");
                      setError(null);
                    }}
                    className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-link transition-colors hover:text-ink"
                  >
                    Forgot password?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-link transition-colors hover:text-ink"
                  >
                    Back to sign in
                  </button>
                )}
                <Link
                  to="/signup"
                  className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-link transition-colors hover:text-ink"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        )}

        <div className="border-t border-rule bg-field px-4 py-4">
          <dl className="space-y-2.5">
            <ParseRow
              label="Session"
              value={user ? user.email ?? "signed in" : "signed out"}
              labelClassName="text-ink-soft"
            />
            <ParseRow
              label="Credentials"
              value={backend === "local" ? "local browser store" : "Supabase Auth"}
              labelClassName="text-ink-soft"
            />
            <ParseRow
              label="Resume data"
              value="local to this device"
              labelClassName="text-ink-soft"
            />
          </dl>
        </div>

        <div className="border-t border-rule px-4 py-3.5">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink transition-colors hover:text-link"
          >
            Continue without an account
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </Panel>
    </AuthShell>
  );
}
