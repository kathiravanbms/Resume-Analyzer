---
version: 1
slug: "src-pages-login-tsx"
primary_target: "src/pages/Login.tsx"
related_targets: ["src/pages/Signup.tsx"]
---

# Auth surface — login / signup

- **Scope:** `/login` and `/signup`, standalone; the analyzer stays usable signed out.
- **Visitor mode:** Operate.
- **Audience & job:** A job seeker who wants an account, or a returning one. They sign in, create an account, recover a forgotten password, or go back to the tool, in one short pass.
- **Action:** Email + password auth through Supabase; recover a password; resend a confirmation; continue without an account.
- **Content / proof:** An honest split of what is remote (credentials → Supabase Auth) and what stays local (resume files parsed on this device). No invented claims or stats.
- **Constraints:** Established "Parse Sheet" world; must work when Supabase env is missing; no route gating; WCAG AA; no shadow, gradient, or pill.

## Direction contract

**THESIS.** The account screen is the machine's operator record, not a marketing card: a credential sheet that parses the operator into fields exactly as the analyzer parses a resume. It refuses the centered glass card, the split hero with testimonial, and the social-login button row.

**OWN-WORLD.** The Parse Sheet — a deep-teal identity rail beside a white ruled sheet; hairline section rules; uppercase JetBrains Mono labels joined to values by a dotted leader; tabular values; 0px sheet and 2px controls; the sun mark reserved for marked emphasis; a field-toned readout footer. Flat: no shadow, gradient, or pill.

**STORY.** The visitor understands this is a private, instrument-grade tool, sees that credentials go to Supabase while resumes stay on this device, and completes sign-in, signup, or recovery in one short pass — or leaves without an account.

**FIRST VIEWPORT.** Desktop is a split: a roughly 45% teal rail carries the wordmark, the headline, an honest lede, and a LIVE PARSE readout mirroring EMAIL · PASSWORD · STATUS as the fields change; the paper side carries the ruled credential sheet with a header strip, monospace-labelled fields, a flame primary action, and the account-switch links. Mobile stacks the rail to a compact band above the sheet and drops the readout as redundant.

**FORM.** Direct shape, no concept roll: the request is a precisely specified narrow extension inside a fully specified world, so composition is decided here rather than dealt. Chosen: the split operator record, its LIVE PARSE readout the signature interaction. Alternatives weighed and set aside: a single centered narrow sheet; a full-bleed ruled form. Seed key: none (no roll run).

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
