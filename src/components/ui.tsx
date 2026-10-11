import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* The six scored dimensions each own a hue. */
export const CATEGORY_HUE: Record<string, string> = {
  atsCompatibility: "#2563eb",
  contentImpact: "#7c3aed",
  structure: "#0891b2",
  keywordMatch: "#d97706",
  readability: "#16a34a",
  formatting: "#db2777",
};

/* ---------------------------------------------------------------- motion */

function useCountUp(target: number, duration = 750): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return <span className={cn("tabular", className)}>{useCountUp(value)}</span>;
}

/* ---------------------------------------------------------------- buttons */

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border border-flame bg-flame text-flame-ink hover:brightness-95 hover:border-brand",
  secondary: "border border-ink bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-rule-strong bg-surface text-ink hover:border-ink",
  ghost: "border border-transparent text-ink-soft hover:border-rule hover:text-ink",
  danger: "border border-fail/40 bg-surface text-fail hover:bg-fail-soft",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[0.68rem]",
  md: "h-10 px-4 text-[0.72rem]",
  lg: "h-12 px-6 text-[0.78rem]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[2px] font-mono font-medium uppercase tracking-[0.12em] transition-all duration-150 active:translate-y-px",
        "disabled:pointer-events-none disabled:opacity-40",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...rest}
    />
  );
}

/* ----------------------------------------------------------------- panels */

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-[2px] border border-rule bg-surface", className)}>
      {children}
    </div>
  );
}

export function PanelHeader({
  label,
  right,
  hue,
}: {
  label: ReactNode;
  right?: ReactNode;
  hue?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-rule bg-field px-4 py-2.5">
      <span className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-brand">
        {hue ? (
          <span
            aria-hidden
            className="size-2 rounded-[1px]"
            style={{ backgroundColor: hue }}
          />
        ) : null}
        {label}
      </span>
      {right ? (
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
          {right}
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------- tags */

type TagTone = "neutral" | "pass" | "warn" | "fail" | "mark" | "ink";

const TAG_TONES: Record<TagTone, string> = {
  neutral: "border-rule-strong text-ink-soft",
  pass: "border-pass/40 text-pass",
  warn: "border-warn/40 text-warn",
  fail: "border-fail/40 text-fail",
  mark: "border-mark bg-mark text-mark-ink",
  ink: "border-ink bg-ink text-paper",
};

export function Tag({
  tone = "neutral",
  color,
  className,
  children,
}: {
  tone?: TagTone;
  color?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] border px-1.5 py-0.5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.12em] transition-colors",
        TAG_TONES[tone],
        className,
      )}
      style={color ? { borderColor: color, color } : undefined}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ parse row */

/**
 * The signature `LABEL · dotted rule · VALUE` row: the literal shape of the
 * machine extracting a field. Colours are overridable so it reads on the
 * teal rail as well as on a sheet.
 */
export function ParseRow({
  label,
  value,
  className,
  labelClassName,
  leaderClassName,
  valueClassName,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  leaderClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <span
        className={cn(
          "shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted",
          labelClassName,
        )}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={cn(
          "min-w-4 flex-1 border-b border-dotted border-rule-strong/70",
          leaderClassName,
        )}
      />
      <span
        className={cn(
          "tabular min-w-0 max-w-[70%] truncate text-right font-mono text-[0.7rem] text-ink",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------- score / meter */

export interface Tone {
  word: string;
  text: string;
  fill: string;
}

export function scoreTone(score: number): Tone {
  if (score >= 80) {
    return { word: "Strong", text: "text-pass", fill: "#0f7a4a" };
  }
  if (score >= 60) {
    return { word: "Marginal", text: "text-warn", fill: "#966000" };
  }
  return { word: "Weak", text: "text-fail", fill: "#cf3218" };
}

export function priorityTone(priority: string): Tone {
  if (priority === "high") return scoreTone(40);
  if (priority === "low") return scoreTone(85);
  return scoreTone(70);
}

export function Meter({
  value,
  tone,
  color,
  ticks = true,
  className,
}: {
  value: number;
  tone: Tone;
  color?: string;
  ticks?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "relative h-2.5 w-full overflow-hidden border border-rule bg-field",
        className,
      )}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="meter-fill absolute inset-y-0 left-0 w-full"
        style={{
          backgroundColor: color ?? tone.fill,
          transform: `scaleX(${clamped / 100})`,
        }}
      />
      {ticks ? <div className="meter-ticks absolute inset-0 opacity-50" /> : null}
    </div>
  );
}

export function Readout({ score }: { score: number }) {
  const tone = scoreTone(score);
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div className="w-full">
      <div className="flex items-end gap-2">
        <CountUp
          value={clamped}
          className="text-7xl font-semibold leading-none text-ink"
        />
        <span className="tabular pb-1.5 font-mono text-sm text-muted">/100</span>
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[0.66rem] uppercase tracking-[0.16em]">
        <span className={tone.text}>{tone.word}</span>
        <span className="text-muted">overall</span>
      </div>
      <Meter value={clamped} tone={tone} className="mt-2" />
      <div className="mt-1 flex justify-between font-mono text-[0.6rem] text-muted">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- fields */

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block font-mono text-[0.68rem] leading-relaxed text-muted">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

const CONTROL =
  "w-full rounded-[2px] border border-rule bg-surface px-3 py-2.5 font-mono text-sm text-ink outline-none transition-colors placeholder:text-muted hover:border-rule-strong focus:border-link";

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, className)} {...rest} />;
}

export function Textarea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(CONTROL, "resize-y leading-relaxed", className)} {...rest} />
  );
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL, "cursor-pointer pr-8", className)} {...rest}>
      {children}
    </select>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
    </svg>
  );
}
