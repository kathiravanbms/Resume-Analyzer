import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button, CATEGORY_HUE, Panel, PanelHeader, Readout, Tag } from "../components/ui";
import { HeroVisual } from "../components/HeroVisual";
import { CATEGORY_META } from "../lib/types";

const STEPS = [
  {
    n: "01",
    title: "Add the resume",
    body: "Drop a PDF or DOCX, or paste the text. It is parsed into fields in your browser, exactly where an ATS would start.",
  },
  {
    n: "02",
    title: "Point it at the job",
    body: "Paste the posting you are targeting. Keyword match is then scored against that posting, not a generic list.",
  },
  {
    n: "03",
    title: "Work the fix queue",
    body: "Read the scored dimensions, then apply the queue in priority order. Each entry names the problem, why it matters, and the fix.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="border-b border-brand bg-brand">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
          <div className="lg:pt-6">
            <h1 className="text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.03em] text-brand-ink sm:text-6xl">
              Your resume,
              <br />
              as the <span className="bg-mark px-1.5 text-mark-ink">machine</span>
              <br />
              reads it.
            </h1>

            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-brand-ink/80">
              An applicant tracking system does not read your resume the way a
              person does. It flattens it into fields. Resume Analyzer shows you
              that flat view, scores what it finds, and hands you the fixes in
              priority order.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/analyze">
                <Button size="lg">
                  Analyze my resume
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href="#scored">
                <Button size="lg" variant="outline">
                  What gets scored
                </Button>
              </a>
            </div>

            <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-brand-ink/60">
              <div className="flex gap-2">
                <dt>Account</dt>
                <dd className="text-brand-ink">optional</dd>
              </div>
              <div className="flex gap-2">
                <dt>Files</dt>
                <dd className="text-brand-ink">parsed locally</dd>
              </div>
              <div className="flex gap-2">
                <dt>Key</dt>
                <dd className="text-brand-ink">yours</dd>
              </div>
            </dl>
          </div>

          <Panel className="lg:mt-2">
            <PanelHeader label="Resume scan — sample report" right="live" />
            <div className="p-3 sm:p-4">
              <HeroVisual />
            </div>
            <div className="border-t border-rule bg-field px-4 py-5">
              <Readout score={63} />
            </div>
          </Panel>
        </div>
      </section>

      <section id="scored" className="mx-auto w-full max-w-6xl px-5 py-14 lg:py-20">
        <h2 className="max-w-[24ch] text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          Six dimensions, one honest verdict
        </h2>
        <p className="mt-3 max-w-[65ch] text-ink-soft">
          Every review scores the same dimensions a screening pass would, so you
          know what to fix first.
        </p>

        <Panel className="mt-8">
          <PanelHeader label="Scored dimensions" right="0–100 each" />
          <dl>
            {(
              Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>
            ).map((key, i) => (
              <div
                key={key}
                className="decode grid gap-1 border-t border-rule px-4 py-4 transition-colors first:border-t-0 hover:bg-field/50 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:gap-6"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <dt className="flex items-center gap-2.5 font-semibold text-ink">
                  <span
                    aria-hidden
                    className="size-2.5 rounded-[1px]"
                    style={{ backgroundColor: CATEGORY_HUE[key] }}
                  />
                  {CATEGORY_META[key].label}
                </dt>
                <dd className="text-sm leading-relaxed text-muted">
                  {CATEGORY_META[key].blurb}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
      </section>

      <section className="border-y border-rule bg-surface">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
            How it works
          </h2>
          <div className="mt-8 border-t border-rule">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="grid gap-2 border-b border-rule py-6 transition-colors hover:bg-paper sm:grid-cols-[4rem_minmax(0,15rem)_minmax(0,1fr)] sm:gap-6"
              >
                <span className="tabular font-mono text-sm text-link">
                  {step.n}
                </span>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 lg:py-20">
        <div className="grid items-center gap-8 border border-rule bg-field p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="max-w-[24ch] text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
              Get your resume read before a recruiter does.
            </h2>
            <p className="mt-3 max-w-[60ch] text-ink-soft">
              Bring your own API key and run as many reviews as you want. Your
              account is handled by Supabase; resume files never leave this
              browser.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Tag tone="neutral">PDF · DOCX · TXT</Tag>
              <Tag tone="neutral">OpenAI · Gemini · Claude</Tag>
              <Tag tone="neutral">Account optional</Tag>
              <Tag tone="mark">Runs in your browser</Tag>
            </div>
          </div>
          <Link to="/analyze" className="justify-self-start lg:justify-self-end">
            <Button size="lg">
              Start a review
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
