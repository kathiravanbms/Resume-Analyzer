# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Active job seekers applying to several roles in a short window. They use the product in the gap between finishing a resume and submitting an application — usually on a laptop at a desk, sometimes late at night, under time pressure and mild anxiety about a high-stakes decision.

## Product Purpose

Turn a resume (and optionally a target job description) into an honest, scored screening pass. Success means the user knows exactly what to fix first and applies those fixes before they apply.

## Positioning

A bring-your-own-key analyzer with no analysis backend: files are parsed in the browser and only the resume text is sent to the provider the user chooses. An optional account (Supabase Auth, email + password) identifies the user; resume files, history, and the provider key stay local. Its value is a calibrated, specific review — scoring and suggestions grounded in the actual resume text, with no invented metrics — rather than a reassuring positivity score.

## Operating Context

- Used between editing a resume and hitting submit; often repeated once per application.
- Frequently paired with a specific job posting, so keyword match against that posting matters.
- Primarily desktop, but must hold up on mobile.
- Depends on an external LLM provider the user selects and pays for.
- The user may optionally sign in or create an account; the analyzer stays fully usable signed out.

## Capabilities and Constraints

- Upload PDF / DOCX / TXT / MD or paste text; parsing is client-side.
- AI analysis across six scored categories (ATS, impact, structure, keyword match, readability, formatting), prioritized suggestions, and example rewrites.
- Optional job description drives keyword match.
- Export report (print/PDF, JSON); localStorage history (max 50) and settings.
- Providers: OpenAI, Google Gemini, Anthropic — called directly from the browser with the user's key.
- Optional account via Supabase Auth (email + password, email confirmation) for identity only; password recovery and confirmation re-send are supported. The account is not required and gates nothing.
- Resume parsing, history, and the provider key remain local to the browser. There is no Resume Analyzer server.
- Hard constraint: scores, findings, and feedback must never be obscured. Dense, scannable information is the product.

## Brand Commitments

- Name: "Resume Analyzer" — descriptive and utilitarian.
- No existing logo, palette, or typeface is binding.
- Explicit anti-commitments from the user: reject the generic AI/SaaS template look, and reject decoration that comes at the cost of readability.

## Evidence on Hand

No real testimonials, customers, benchmarks, ratings, or logos exist. Any sample report data shown on marketing surfaces is synthetic and must be presented as illustrative. Future work must not fabricate user counts, ratings, or company names.

## Product Principles

1. The score is the product: every screen serves the numbers and the fixes.
2. Honest and specific: calibrated scoring and grounded recommendations over reassurance.
3. Private by construction: local parsing, the user's own key, no server.
4. Fast to a verdict: resume to prioritized action in one short flow.
5. Readability is non-negotiable: dense feedback stays scannable.

## Accessibility & Inclusion

Web baseline: semantic landmarks, keyboard operability, WCAG AA contrast. Readability of dense scored content is a hard constraint. No additional accessibility standard was confirmed.
