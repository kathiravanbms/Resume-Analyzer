import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Button,
  Field,
  Input,
  Meter,
  Panel,
  PanelHeader,
  ParseRow,
  Spinner,
  scoreTone,
} from "../components/ui";
import {
  AuthShell,
  LiveParse,
  Notice,
  PasswordInput,
} from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { isEmail, passwordStrength } from "../lib/auth-utils";

export default function Signup() {
  const navigate = useNavigate();
  const { user, backend, signUp, resendConfirmation } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (user) navigate("/analyze", { replace: true });
  }, [user, navigate]);

  const strength = passwordStrength(password);
  const tone = scoreTone(strength);

  const status = submitting
    ? "creating"
    : error
      ? "rejected"
      : sent
        ? "confirmation sent"
        : user
          ? "signed in"
          : email.trim() && password && confirm
            ? "ready"
            : "idle";

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setResent(false);

    if (!isEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Choose a password of at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError, needsConfirmation } = await signUp(
      email.trim(),
      password,
    );
    setSubmitting(false);
    if (signUpError) setError(signUpError);
    else if (needsConfirmation) setSent(true);
  }

  async function resend() {
    setResending(true);
    const { error: resendError } = await resendConfirmation(email.trim());
    setResending(false);
    if (resendError) setError(resendError);
    else setResent(true);
  }

  return (
    <AuthShell
      title="Create your record."
      lede="An account identifies you to Resume Analyzer. Resume files are still parsed in this browser and sent only to the provider you choose."
      readout={<LiveParse email={email} password={password} status={status} />}
    >
      <Panel>
        <PanelHeader
          label="Access"
          right={sent ? "confirm email" : "create account"}
        />

        {sent ? (
          <div className="space-y-5 p-4">
            <Notice tone="pass" label="Check inbox">
              We sent a confirmation link to{" "}
              <strong className="text-ink">{email.trim()}</strong>. Open it to
              finish creating your account, then sign in.
            </Notice>
            {resent ? (
              <Notice tone="pass" label="Re-sent">
                A fresh confirmation link is on its way.
              </Notice>
            ) : null}
            {error ? (
              <Notice tone="fail" label="Failed">
                {error}
              </Notice>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={resend}
                disabled={resending}
              >
                {resending ? <Spinner className="size-4" /> : null}
                {resending ? "Sending…" : "Resend email"}
              </Button>
              <Link
                to="/login"
                className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-link transition-colors hover:text-ink"
              >
                Back to sign in
              </Link>
            </div>
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

              <div>
                <Field label="Password" htmlFor="password">
                  <PasswordInput
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                  />
                </Field>
                <div className="mt-2">
                  <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.14em]">
                    <span className={password ? tone.text : "text-muted"}>
                      {password ? tone.word : "Strength"}
                    </span>
                    <span className="text-muted">min 8 characters</span>
                  </div>
                  <Meter value={strength} tone={tone} className="mt-1.5" />
                </div>
              </div>

              <Field label="Confirm password" htmlFor="confirm">
                <PasswordInput
                  id="confirm"
                  name="confirm"
                  autoComplete="new-password"
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                />
              </Field>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? <Spinner className="size-4" /> : null}
                {submitting ? "Creating account…" : "Create account"}
              </Button>

              <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                Already have an account?{" "}
                <Link to="/login" className="text-link transition-colors hover:text-ink">
                  Sign in
                </Link>
              </p>
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
