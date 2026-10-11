import type { InputHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input, ParseRow, Tag, cn } from "./ui";

/**
 * Standalone frame for the credential flow: a deep-teal identity rail beside a
 * paper sheet. It deliberately bypasses the app toolbar so signing in is a
 * single focused pass, not a page inside the analyzer.
 */
export function AuthShell({
  title,
  lede,
  readout,
  children,
}: {
  title: ReactNode;
  lede: ReactNode;
  readout?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
      <aside className="flex flex-col gap-8 bg-brand px-6 py-8 text-brand-ink lg:px-12 lg:py-14">
        <Link to="/" className="flex items-center gap-2.5">
          <span aria-hidden className="size-2.5 bg-mark" />
          <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-ink">
            Resume Analyzer
          </span>
        </Link>

        <div>
          <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-brand-ink lg:text-[2.5rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-[44ch] leading-relaxed text-brand-ink/75">
            {lede}
          </p>
        </div>

        {readout ? (
          <div className="mt-auto hidden lg:block">{readout}</div>
        ) : null}
      </aside>

      <main className="flex flex-col bg-paper">
        <div className="flex items-center justify-end border-b border-rule px-5 py-3.5 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            Back to analyzer
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:py-14">
          <div className="w-full max-w-md animate-rise">{children}</div>
        </div>
      </main>
    </div>
  );
}

/**
 * The signature interaction: the machine's live read of the form as it is
 * typed. Decorative — a visual mirror of the real fields, so it is hidden from
 * assistive tech to avoid duplication.
 */
export function LiveParse({
  email,
  password,
  status,
}: {
  email: string;
  password: string;
  status: string;
}) {
  return (
    <div
      aria-hidden
      className="border border-brand-ink/20 bg-brand-soft/25"
    >
      <div className="flex items-center justify-between border-b border-brand-ink/20 px-3 py-2">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-brand-ink/60">
          Live parse
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-mark">
          this form
        </span>
      </div>
      <dl className="space-y-2.5 px-3 py-3">
        {[
          { label: "Email", value: email.trim() || "—", mark: false },
          {
            label: "Password",
            value: password ? "•".repeat(Math.min(password.length, 12)) : "—",
            mark: false,
          },
          { label: "Status", value: status, mark: true },
        ].map((row, i) => (
          <div
            key={row.label}
            className="decode"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <ParseRow
              label={row.label}
              value={row.value}
              labelClassName="text-brand-ink/55"
              valueClassName={row.mark ? "text-mark" : "text-brand-ink"}
              leaderClassName="border-brand-ink/25"
            />
          </div>
        ))}
      </dl>
    </div>
  );
}

const NOTICE_TONES = {
  fail: "border-fail/50 bg-fail-soft",
  warn: "border-warn/50 bg-warn-soft",
  pass: "border-pass/40 bg-pass-soft",
} as const;

export function Notice({
  tone,
  label,
  children,
}: {
  tone: keyof typeof NOTICE_TONES;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "fail" ? "alert" : undefined}
      className={cn("flex items-start gap-3 border px-3 py-2.5", NOTICE_TONES[tone])}
    >
      <Tag tone={tone === "fail" ? "fail" : tone === "warn" ? "warn" : "pass"}>
        {label}
      </Tag>
      <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink-soft">
        {children}
      </p>
    </div>
  );
}

/** Password control with a show/hide toggle, matching the Settings pattern. */
export function PasswordInput({
  show,
  onToggle,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex">
      <Input
        type={show ? "text" : "password"}
        spellCheck={false}
        className={cn("border-r-0", className)}
        {...rest}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={show}
        className="shrink-0 border border-rule px-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
