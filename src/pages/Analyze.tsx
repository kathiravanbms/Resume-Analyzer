import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Field, Input, Panel, PanelHeader, Spinner, Tag, Textarea, cn } from "../components/ui";
import { Dropzone } from "../components/Dropzone";
import { useApp } from "../context/AppContext";
import { extractResume } from "../lib/parsing/extract";
import { analyzeResume } from "../lib/analysis/analyze";
import { getProvider } from "../lib/providers";
import { uid } from "../lib/storage";
import type { AnalysisRecord } from "../lib/types";

type Mode = "upload" | "paste";

const MODES = [
  { id: "upload" as const, label: "Upload" },
  { id: "paste" as const, label: "Paste" },
];

export default function Analyze() {
  const navigate = useNavigate();
  const { settings, isConfigured, setCurrent, addRecord } = useApp();
  const provider = getProvider(settings.provider);

  const [mode, setMode] = useState<Mode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const resumeName = mode === "paste" ? "Pasted resume" : file?.name ?? "Resume";

  async function handleFile(next: File) {
    setError(null);
    setWarning(null);
    setFile(next);
    setResumeText("");
    setExtracting(true);
    try {
      const { text, warning: warn } = await extractResume(next);
      setResumeText(text);
      setWarning(warn ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that file.");
      setFile(null);
    } finally {
      setExtracting(false);
    }
  }

  function reset() {
    setFile(null);
    setResumeText("");
    setWarning(null);
    setError(null);
  }

  async function run() {
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const { result, model } = await analyzeResume({
        resumeText,
        jobDescription: jd,
        settings,
        signal: controller.signal,
      });
      const record: AnalysisRecord = {
        id: uid(),
        createdAt: Date.now(),
        fileName: resumeName,
        jobTitle: jobTitle.trim(),
        hasJobDescription: Boolean(jd.trim()),
        provider: settings.provider,
        model,
        result,
      };
      setCurrent(record);
      addRecord(record);
      navigate("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  }

  const canAnalyze =
    !loading && !extracting && isConfigured && resumeText.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
        Analyze a resume
      </h1>
      <p className="mt-3 max-w-[65ch] text-ink-soft">
        Add a resume and, optionally, the job you are targeting. The file is
        parsed in your browser; only the extracted text is sent to your
        provider.
      </p>

      {!isConfigured ? (
        <Panel className="mt-8 border-warn/50">
          <div className="flex flex-wrap items-center gap-3 px-4 py-4">
            <Tag tone="warn">No provider</Tag>
            <p className="text-sm text-ink-soft">
              Add an API key and model in{" "}
              <Link to="/settings" className="font-medium text-ink underline">
                Settings
              </Link>{" "}
              to run a review.
            </p>
          </div>
        </Panel>
      ) : null}

      <Panel className="mt-6">
        <PanelHeader
          label="Source"
          right={
            <span className="flex border border-rule">
              {MODES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    setMode(id);
                    reset();
                  }}
                  className={cn(
                    "px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition",
                    mode === id ? "bg-ink text-paper" : "text-muted hover:text-ink",
                  )}
                >
                  {label}
                </button>
              ))}
            </span>
          }
        />

        {mode === "upload" ? (
          <div className="p-4">
            {file && resumeText ? (
              <div className="flex flex-wrap items-center gap-4 border border-rule px-4 py-3">
                <Tag tone="pass">Parsed</Tag>
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm text-ink">{file.name}</p>
                  <p className="font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted">
                    {resumeText.length.toLocaleString()} characters extracted
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="ml-auto"
                >
                  Remove
                </Button>
              </div>
            ) : extracting ? (
              <div className="flex items-center gap-3 border border-rule px-4 py-6">
                <Spinner className="size-4 text-muted" />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                  Reading {file?.name}…
                </span>
              </div>
            ) : (
              <Dropzone onFile={handleFile} disabled={extracting} />
            )}

            {warning ? (
              <div className="mt-3 flex items-start gap-3 border border-warn/50 bg-warn-soft px-3 py-2.5">
                <Tag tone="warn">Notice</Tag>
                <p className="text-sm text-ink-soft">{warning}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="p-4">
            <Textarea
              rows={12}
              placeholder="Paste your full resume text here…"
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setWarning(null);
              }}
            />
            <p className="mt-2 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted">
              {resumeText.length.toLocaleString()} characters
            </p>
          </div>
        )}
      </Panel>

      <Panel className="mt-6">
        <PanelHeader label="Target — optional" right="improves keyword match" />
        <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Field label="Role title" htmlFor="job-title" hint="e.g. Senior Backend Engineer">
            <Input
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Senior Backend Engineer"
            />
          </Field>
          <Field label="Job description" htmlFor="jd" hint="Paste the full posting">
            <Textarea
              id="jd"
              rows={5}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here…"
            />
          </Field>
        </div>
      </Panel>

      {error ? (
        <Panel className="mt-6 border-fail/50">
          <div className="flex flex-wrap items-start gap-3 px-4 py-4">
            <Tag tone="fail">Failed</Tag>
            <p className="min-w-0 flex-1 whitespace-pre-wrap text-sm text-ink-soft">
              {error}
            </p>
          </div>
        </Panel>
      ) : null}

      <div className="mt-6 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
          {isConfigured ? (
            <>
              {provider.label} / {settings.model}
            </>
          ) : (
            "No provider configured"
          )}
        </p>
        <div className="flex gap-3">
          {loading ? (
            <Button
              variant="outline"
              size="lg"
              onClick={() => controllerRef.current?.abort()}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            size="lg"
            disabled={!canAnalyze}
            onClick={run}
            className="w-full sm:w-auto"
          >
            {loading ? "Working…" : "Run the review"}
          </Button>
        </div>
      </div>

      {loading ? (
        <Panel className="mt-6">
          <PanelHeader label="Analyzing" right={`${provider.label} / ${settings.model}`} />
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <Spinner className="size-4 text-ink" />
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-soft">
                Parsing fields and scoring…
              </span>
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="shimmer h-3"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
            <p className="pt-1 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted">
              Usually 10–30 seconds
            </p>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
