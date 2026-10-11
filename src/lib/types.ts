export type ProviderId = "openai" | "anthropic" | "gemini" | "openrouter" | "opencode-go";

export interface Settings {
  provider: ProviderId;
  model: string;
  apiKey: string;
  /** Optional override for OpenAI-compatible endpoints. */
  baseUrl: string;
}

export type Priority = "high" | "medium" | "low";

export interface CategoryScore {
  score: number;
  rationale: string;
  findings: string[];
}

export interface Suggestion {
  priority: Priority;
  category: string;
  issue: string;
  why: string;
  fix: string;
  example?: string;
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  categories: {
    atsCompatibility: CategoryScore;
    contentImpact: CategoryScore;
    structure: CategoryScore;
    keywordMatch: CategoryScore;
    readability: CategoryScore;
    formatting: CategoryScore;
  };
  strengths: string[];
  keywordGaps: string[];
  skillsFound: string[];
  suggestions: Suggestion[];
}

export interface AnalysisRecord {
  id: string;
  createdAt: number;
  fileName: string;
  jobTitle: string;
  hasJobDescription: boolean;
  provider: ProviderId;
  model: string;
  result: AnalysisResult;
}

export interface ExtractedResume {
  text: string;
  warning?: string;
}

export const CATEGORY_META: Record<
  keyof AnalysisResult["categories"],
  { label: string; blurb: string }
> = {
  atsCompatibility: {
    label: "ATS compatibility",
    blurb: "Parseability, standard headings, and clean formatting.",
  },
  contentImpact: {
    label: "Content & impact",
    blurb: "Action verbs, quantified results, and achievement framing.",
  },
  structure: {
    label: "Structure",
    blurb: "Section order, length, and information architecture.",
  },
  keywordMatch: {
    label: "Keyword match",
    blurb: "Coverage of terms from the target job description.",
  },
  readability: {
    label: "Readability",
    blurb: "Sentence length, clarity, and scanability.",
  },
  formatting: {
    label: "Formatting",
    blurb: "Consistency, hierarchy, and typographic hygiene.",
  },
};
