import type {
  AnalysisResult,
  CategoryScore,
  Priority,
  Suggestion,
} from "../types";
import { extractJson } from "../providers/util";

function num(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function str(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim();
  if (value == null) return fallback;
  return String(value);
}

function strArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => str(v)).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function category(value: unknown): CategoryScore {
  const v = (value ?? {}) as Record<string, unknown>;
  return {
    score: num(v.score),
    rationale: str(v.rationale, "No detail provided."),
    findings: strArray(v.findings),
  };
}

function priority(value: unknown): Priority {
  return value === "high" || value === "medium" || value === "low"
    ? value
    : "medium";
}

export function normalizeResult(raw: unknown): AnalysisResult {
  const root = (raw ?? {}) as Record<string, unknown>;
  const cats = (root.categories ?? {}) as Record<string, unknown>;
  const suggestionsRaw = Array.isArray(root.suggestions) ? root.suggestions : [];

  const suggestions: Suggestion[] = suggestionsRaw
    .map((s) => {
      const v = (s ?? {}) as Record<string, unknown>;
      const example = str(v.example);
      return {
        priority: priority(v.priority),
        category: str(v.category, "General"),
        issue: str(v.issue),
        why: str(v.why),
        fix: str(v.fix),
        example: example || undefined,
      };
    })
    .filter((s) => s.issue || s.fix);

  const order: Priority[] = ["high", "medium", "low"];
  suggestions.sort(
    (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority),
  );

  const categories = {
    atsCompatibility: category(cats.atsCompatibility),
    contentImpact: category(cats.contentImpact),
    structure: category(cats.structure),
    keywordMatch: category(cats.keywordMatch),
    readability: category(cats.readability),
    formatting: category(cats.formatting),
  };

  return {
    overallScore: num(root.overallScore),
    summary: str(root.summary, "Analysis complete."),
    categories,
    strengths: strArray(root.strengths),
    keywordGaps: strArray(root.keywordGaps),
    skillsFound: strArray(root.skillsFound),
    suggestions,
  };
}

export function parseResult(text: string): AnalysisResult {
  return normalizeResult(extractJson(text));
}
