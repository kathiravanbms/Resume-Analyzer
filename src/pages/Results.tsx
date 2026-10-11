import { Link } from "react-router-dom";
import { Download, Printer } from "lucide-react";
import {
  Button,
  CATEGORY_HUE,
  Meter,
  Panel,
  PanelHeader,
  Readout,
  Tag,
  cn,
  scoreTone,
} from "../components/ui";
import { useApp } from "../context/AppContext";
import { getProvider } from "../lib/providers";
import {
  CATEGORY_META,
  type AnalysisResult,
  type Suggestion,
} from "../lib/types";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function priorityTagTone(priority: string): "fail" | "warn" | "pass" {
  if (priority === "high") return "fail";
  if (priority === "low") return "pass";
  return "warn";
}

function SuggestionRow({ index, suggestion }: { index: number; suggestion: Suggestion }) {
  return (
    <details
      className="group border-t border-rule transition-colors first:border-t-0 hover:bg-field/40"
      open={suggestion.priority === "high"}
    >
      <summary className="flex cursor-pointer list-none items-start gap-4 px-4 py-4">
        <span className="tabular pt-0.5 font-mono text-[0.7rem] text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <Tag tone={priorityTagTone(suggestion.priority)}>
              {suggestion.priority}
            </Tag>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
              {suggestion.category}
            </span>
          </span>
          <span className="mt-2 block font-medium text-ink">{suggestion.issue}</span>
        </span>
        <span className="pt-0.5 font-mono text-sm text-muted transition group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="space-y-3 border-t border-rule px-4 py-4 pl-4 sm:pl-[3.25rem]">
        <p className="text-sm leading-relaxed text-ink-soft">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
            Why /{" "}
          </span>
          {suggestion.why}
        </p>
        <p className="text-sm leading-relaxed text-ink-soft">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
            Fix /{" "}
          </span>
          {suggestion.fix}
        </p>
        {suggestion.example ? (
          <div className="border border-rule bg-field px-3 py-3">
            <p className="mb-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
              Rewrite
            </p>
            <p className="font-mono text-[0.78rem] leading-relaxed text-ink">
              {suggestion.example}
            </p>
          </div>
        ) : null}
      </div>
    </details>
  );
}

export default function Results() {
  const { current } = useApp();

  if (!current) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">
          No review loaded
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Run a review, or open a saved one from your history.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/analyze">
            <Button>Analyze a resume</Button>
          </Link>
          <Link to="/history">
            <Button variant="outline">History</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { result } = current;
  const provider = getProvider(current.provider);
  const high = result.suggestions.filter((s) => s.priority === "high").length;
  const categories = Object.keys(
    CATEGORY_META,
  ) as Array<keyof AnalysisResult["categories"]>;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 lg:py-16">
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <Link to="/analyze">
          <Button variant="ghost" size="sm">
            ← New review
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              downloadJson(
                `${current.fileName.replace(/\.[^.]+$/, "")}-analysis.json`,
                current,
              )
            }
          >
            <Download className="size-3.5" />
            JSON
          </Button>
        </div>
      </div>

      <header className="mt-8">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          {current.jobTitle || "Resume review"}
        </h1>
        <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
          {current.fileName} · {formatDate(current.createdAt)} · {provider.label}/
          {current.model}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {current.hasJobDescription ? (
            <Tag tone="ink">Matched to a job description</Tag>
          ) : (
            <Tag tone="neutral">No job description supplied</Tag>
          )}
        </div>
      </header>

      <Panel className="mt-8">
        <PanelHeader label="Verdict" right={`${result.overallScore}/100`} />
        <div className="grid sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
          <div className="border-b border-rule p-5 sm:border-b-0 sm:border-r">
            <Readout score={result.overallScore} />
          </div>
          <div className="p-5">
            <p className="text-lg leading-relaxed text-ink-soft">
              {result.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Tag tone={high > 0 ? "fail" : "pass"}>
                {high > 0
                  ? `${high} high-priority fix${high > 1 ? "es" : ""}`
                  : "No high-priority issues"}
              </Tag>
              <Tag tone="neutral">{result.suggestions.length} suggestions</Tag>
              <Tag tone="neutral">{result.skillsFound.length} skills detected</Tag>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="mt-6">
        <PanelHeader label="Scored dimensions" right="0–100 each" />
        <div>
          {categories.map((key, i) => {
            const cat = result.categories[key];
            const tone = scoreTone(cat.score);
            const hue = CATEGORY_HUE[key];
            return (
              <div
                key={key}
                className="decode border-t border-rule px-4 py-5 transition-colors first:border-t-0 hover:bg-field/40"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="flex items-center gap-2.5 font-semibold text-ink">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-[1px]"
                      style={{ backgroundColor: hue }}
                    />
                    {CATEGORY_META[key].label}
                  </h3>
                  <span className={cn("tabular font-mono text-sm", tone.text)}>
                    {cat.score}
                  </span>
                </div>
                <Meter value={cat.score} tone={tone} color={hue} className="mt-2" />
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {cat.rationale}
                </p>
                {cat.findings.length ? (
                  <ul className="mt-3 space-y-1.5">
                    {cat.findings.map((finding, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-muted"
                      >
                        <span className="font-mono text-rule-strong">/</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel className="mt-6">
        <PanelHeader label="Signals" right="detected / missing" />
        <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-rule">
          <div className="border-b border-rule p-4 sm:border-b-0">
            <h3 className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
              <span aria-hidden className="size-2 rounded-[1px] bg-pass" />
              Working
            </h3>
            <ul className="mt-3 space-y-2">
              {result.strengths.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-soft">
                  <span className="font-mono text-pass">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-b border-rule p-4 sm:border-b-0">
            <h3 className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
              <span
                aria-hidden
                className="size-2 rounded-[1px]"
                style={{ backgroundColor: "#0891b2" }}
              />
              Skills found
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.skillsFound.length ? (
                result.skillsFound.map((skill, i) => (
                  <Tag key={i} tone="neutral">
                    {skill}
                  </Tag>
                ))
              ) : (
                <p className="text-sm text-muted">None detected.</p>
              )}
            </div>
          </div>
          <div className="p-4">
            <h3 className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
              <span aria-hidden className="size-2 rounded-[1px] bg-warn" />
              Keyword gaps
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.keywordGaps.length ? (
                result.keywordGaps.map((gap, i) => (
                  <Tag key={i} tone="warn">
                    {gap}
                  </Tag>
                ))
              ) : (
                <p className="text-sm text-muted">No gaps found.</p>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="mt-6">
        <PanelHeader
          label="Fix queue"
          right={`${result.suggestions.length} entries · priority order`}
        />
        <div>
          {result.suggestions.length ? (
            result.suggestions.map((suggestion, i) => (
              <SuggestionRow key={i} index={i} suggestion={suggestion} />
            ))
          ) : (
            <p className="px-4 py-6 text-sm text-muted">
              No specific suggestions were returned. Add a job description and
              run it again.
            </p>
          )}
        </div>
      </Panel>

      <div className="no-print mt-10 flex flex-col items-start justify-between gap-4 border border-rule bg-surface p-6 sm:flex-row sm:items-center">
        <p className="max-w-[52ch] text-sm text-ink-soft">
          Apply the high-priority entries, then run the review again to see the
          score move.
        </p>
        <Link to="/analyze">
          <Button>Analyze another</Button>
        </Link>
      </div>
    </div>
  );
}
