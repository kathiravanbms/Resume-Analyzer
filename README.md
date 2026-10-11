# Resume Analyzer

An AI screening pass for your resume. Upload a PDF/DOCX or paste text, optionally add a target job description, and get a scored review: ATS compatibility, content impact, structure, keyword match, readability, and formatting — plus a prioritized list of fixes with rewritten examples.

Bring your own API key (OpenAI, Google Gemini, or Anthropic). There is no analysis backend, and an account is optional: files are parsed in your browser, and only the resume text is sent to the AI provider you configure. Create an account (Supabase Auth) to identify yourself — it gates nothing.

## Quick start

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173).

1. Go to **Settings** and add an API key + model for a provider.
2. Go to **Analyze**, upload or paste a resume.
3. Optionally paste a job description to score keyword match against it.
4. Run the analysis and review the report.

## Accounts (optional)

Sign in or create an account at `/login` and `/signup`. Authentication is handled by [Supabase](https://supabase.com); the account identifies you and gates nothing — the analyzer works signed out.

To enable it, copy `.env.example` to `.env.local` and set:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Both values are public (the anon key ships in the browser bundle; row-level security protects your data). Email + password with email confirmation is on by default in Supabase. Without these variables the auth pages still render, with sign-in disabled and a setup notice shown.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |

## Deploy

The app is a static SPA plus one serverless function that proxies OpenCode Go (which blocks browser requests via CORS). Both hosts below are pre-configured.

### Vercel (recommended)

`vercel.json` and `api/opencode/[...path].js` (an Edge Function) are already set up.

```bash
npm i -g vercel
vercel login
vercel          # preview URL
vercel --prod   # production URL
```

Or import the repo at https://vercel.com/new — build command `npm run build`, output `dist`; Vercel auto-detects the `api/` function.

### Netlify

`netlify.toml` and `netlify/functions/opencode.mjs` are already set up.

```bash
npm i -g netlify-cli
netlify login
netlify deploy --build --prod
```

Or import the repo in the Netlify dashboard.

### Notes

- OpenCode Go needs the serverless proxy at `/api/opencode`; it ships for both hosts. **OpenAI, Gemini, Anthropic, and OpenRouter work directly with no proxy.**
- Optional Supabase env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) go in the host's environment settings; without them the app uses the local browser fallback.
- Visitors enter their own API keys in the browser; no key is ever part of the deployment.

## Providers

| Provider | Notes |
| --- | --- |
| Google Gemini | Free tier available. Defaults to `gemini-3.8-flash`. Direct Google API. |
| OpenRouter | One key for many models, including Gemini (`google/gemini-3.8-flash`). Use this if a direct Google key is refused. |
| OpenCode Go | OpenAI-compatible at `https://opencode.ai/zen/go/v1`. **Requires a CORS proxy** — the endpoint sends no CORS headers, so a browser cannot call it directly. Enter your proxy URL in the Base URL field. |
| OpenAI | `gpt-4o-mini` is a good default. Optional base URL for Azure / compatible endpoints. |
| Anthropic | Requires direct browser access, which the app enables via the `anthropic-dangerous-direct-browser-access` header. |

The API key is stored in this browser's `localStorage` and sent only to the selected provider.

### Keeping the model current

Model names are retired over time (for example, Gemini `gemini-2.5-flash` is no longer available to new keys). In **Settings**, use **Load models** to fetch the exact list your key can use. If the saved model is not in that list, the app automatically switches to a current one — save to keep the change. The model field is free text, so any valid ID also works.

## How it works

- **Parsing** — `pdfjs-dist` (PDF), `mammoth` (DOCX), and plain text, all client-side.
- **Analysis** — a single structured-JSON request per run via `src/lib/analysis/prompt.ts`. Results are validated and normalized in `src/lib/analysis/validate.ts` so partial model output never breaks the UI.
- **Storage** — settings, the last report, and up to 50 history entries live in `localStorage`.

## Project structure

```
src/
  components/   Reusable UI (Button, Panel, Tag, Meter, Readout, ParseRow, Dropzone, AuthShell, Layout)
  context/      App-wide settings + history state, Supabase session state
  lib/
    analysis/   Prompt, validation, orchestration
    parsing/    PDF / DOCX / text extraction
    providers/  OpenAI, Gemini, Anthropic adapters
    storage.ts  localStorage persistence
    supabase.ts Supabase client (auth)
    auth-utils.ts Email + password-strength helpers
  pages/        Home, Analyze, Results, Settings, History, Login, Signup
```

## Design system

The visual world is documented in `PRODUCT.md` (product truth) and `DESIGN.md` (the "Parse Sheet" system: ruled sheets, monospace field labels, one highlighter accent, linear meters, flat surfaces). Design tokens live in `src/index.css` under `@theme`; `.impeccable/design.json` is the machine-readable sidecar.

## Privacy

- Resume files never leave the browser.
- Resume text is sent only to the provider you configure, under your own account.
- If you create an account, email and password are handled by Supabase Auth; no Resume Analyzer server stores them.
- Clearing the browser's site data (or **Settings → Clear history**) removes all locally stored data. Sign out to end the Supabase session.
