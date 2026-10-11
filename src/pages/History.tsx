import { Link, useNavigate } from "react-router-dom";
import { Button, CountUp, Panel, PanelHeader, Tag, scoreTone } from "../components/ui";
import { useApp } from "../context/AppContext";
import { getProvider } from "../lib/providers";
import type { AnalysisRecord } from "../lib/types";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function History() {
  const navigate = useNavigate();
  const { history, setCurrent, removeRecord, clearHistory } = useApp();

  function open(record: AnalysisRecord) {
    setCurrent(record);
    navigate("/results");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
            History
          </h1>
          <p className="mt-3 text-ink-soft">
            {history.length
              ? `${history.length} saved review${history.length === 1 ? "" : "s"}, stored in this browser.`
              : "Your past reviews will appear here."}
          </p>
        </div>
        {history.length ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm("Clear all saved reviews?")) clearHistory();
            }}
          >
            Clear all
          </Button>
        ) : null}
      </div>

      <Panel className="mt-8">
        <PanelHeader label="Saved reviews" right={`${history.length} total`} />
        {history.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
              No entries
            </p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">
              Run a review and it will be saved here for quick reference.
            </p>
            <Link to="/analyze" className="mt-6 inline-block">
              <Button>Analyze a resume</Button>
            </Link>
          </div>
        ) : (
          <div>
            {history.map((record, i) => {
              const tone = scoreTone(record.result.overallScore);
              return (
                <div
                  key={record.id}
                  className="decode flex flex-wrap items-center gap-4 border-t border-rule px-4 py-4 transition-colors first:border-t-0 hover:bg-field/40"
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  <CountUp
                    value={record.result.overallScore}
                    className={`font-mono text-xl ${tone.text}`}
                  />
                  <button
                    onClick={() => open(record)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate font-medium text-ink">
                      {record.jobTitle || record.fileName}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
                      {record.fileName} · {formatDate(record.createdAt)}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-2">
                      <Tag tone="neutral">
                        {getProvider(record.provider).label}/{record.model}
                      </Tag>
                      {record.hasJobDescription ? <Tag tone="ink">JD</Tag> : null}
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => open(record)}>
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeRecord(record.id)}
                      aria-label="Delete review"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
