---
name: Resume Analyzer
description: An ATS parse view of your resume — scored across six dimensions, with fixes in priority order.
colors:
  brand: "#0b4f4a"
  brand-soft: "#0f6a62"
  brand-ink: "#e9f7f4"
  flame: "#ff5a3c"
  flame-ink: "#ffffff"
  flame-soft: "#ffe3dc"
  mark: "#ffd23f"
  mark-ink: "#241c00"
  ink: "#07201d"
  ink-soft: "#2c4a46"
  muted: "#557370"
  paper: "#e9f2f0"
  surface: "#ffffff"
  rule: "#c7ded9"
  rule-strong: "#98bcb6"
  field: "#e2f0ed"
  pass: "#16875a"
  warn: "#b0720a"
  fail: "#d9412b"
  link: "#0b6f68"
  cat-ats: "#2563eb"
  cat-impact: "#7c3aed"
  cat-structure: "#0891b2"
  cat-keywords: "#d97706"
  cat-readability: "#16a34a"
  cat-formatting: "#db2777"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label-2xs:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.6rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  label-xs:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.62rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  label-sm:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.64rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  label-md:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.66rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.68rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.12em"
  label-lg:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.7rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  label-xl:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  label-2xl:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
    letterSpacing: "0.12em"
rounded:
  control: "2px"
  sheet: "0px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.mark-ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  tag-neutral:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
    padding: "2px 6px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
---

# Design System: Resume Analyzer

## Overview

**Creative North Star: "The Parse Sheet"**

Resume Analyzer looks like the machine's own readout. An applicant tracking system does not read a resume the way a person does — it flattens it into fields — and this interface adopts exactly that flat, ruled, measured view rather than dressing it up as a friendly dashboard. The product's whole claim is a calibrated, honest screen, so the surface is a working sheet: hairline rules, fixed columns, monospace field labels, tabular numerals, and square corners. Density is the point, not a cost.

The palette is cool and instrumental. A near-black ink sits on a cool off-white ground, and a single highlighter-lime mark is the only committed accent — used for marked emphasis and the primary action, always carrying black text. Nothing is decorated to look impressive; every rule, tick, and meter is doing measurement work. Depth is expressed with hairlines and a single filled field tone, never with shadow or gloss.

The tone is technical but not cold-by-default: generous vertical rhythm, plain-language verdicts, and a fix queue that reads as instructions rather than a scoreboard. Colour is used as data: each scored dimension owns a hue and the state colours carry meaning, while the highlighter mark stays reserved for action and emphasis. Motion is one short vocabulary — parsed fields and rows decode in on a stagger, routes rise, meters grow from their origin, scores count up, and the dropzone border pulses under a dragged file — always brief and always reduced-motion aware.

**Key Characteristics:**
- Ruled sheets with hairline separators instead of floating rounded cards.
- Monospace for every field label, tag, and measurement; Archivo for headings and running text.
- One highlighter accent on black for action; six dimension hues and three state colours employed as data.
- Linear ticked meters, animated from the origin, with large count-up tabular numerals — never progress rings.
- Flat by construction: no shadows, no gradients, no pill shapes.
- Motion is brief, staggered, and switched off under `prefers-reduced-motion`.

## Colors

A cool, near-monochrome instrument palette interrupted by one deliberate highlighter.

### Primary
- **Flame** (#ff5a3c): The primary action colour — buttons and the strongest call to action. White text sits on it.
- **Sun Mark** (#ffd23f): Marked emphasis — the highlighted word in the landing headline, the active-nav underline, and selected states. Black text sits on it.

### Secondary
- **Deep Teal Brand** (#0b4f4a): Identity surfaces — the header bar and the landing hero band — with **Brand Ink** (#e9f7f4) for text on it, and **Field** (#e2f0ed) as the tinted panel-header fill.

The six scored dimensions each own a hue so a dimension is recognizable across the report and its history without reading the label. Hues are used as swatches, meter fills, and tag borders — never as large fields or text blocks.
- **ATS Blue** (#2563eb): ATS compatibility; also the interactive link hue family.
- **Impact Violet** (#7c3aed): Content & impact.
- **Structure Cyan** (#0891b2): Structure; also the "skills found" signal.
- **Keywords Amber** (#d97706): Keyword match; also keyword gaps.
- **Readability Green** (#16a34a): Readability.
- **Formatting Pink** (#db2777): Formatting.
- **Link Teal** (#0b6f68): Interactive links and focused-input borders.

### Neutral
- **Ink** (#07201d): Primary text, headings, and the secondary-button fill.
- **Soft Ink** (#2c4a46): Body copy and secondary text.
- **Muted** (#557370): Field labels, metadata, and supporting text.
- **Paper** (#e9f2f0): The page ground.
- **Surface** (#ffffff): Panels and controls.
- **Field** (#e2f0ed): Filled regions inside sheets — readout footers, rewrite blocks, panel headers, skeleton rows.
- **Rule** (#c7ded9): The default hairline separating rows, panels, and columns.
- **Rule Strong** (#98bcb6): Structure that must read as a boundary — dashed dropzone, outlined controls, meter ticks.

### Tertiary
- **Pass** (#0f7a4a): A passing measurement or a strength.
- **Warn** (#966000): A marginal measurement or a missing keyword.
- **Fail** (#cf3218): A failing measurement or an error.

### Named Rules
**The One Mark Rule.** The highlighter accent is the only chromatic accent in the system. It covers a small fraction of any screen and carries black text without exception; it never becomes a large colored field.

**The State-Color Rule.** Pass, warn, and fail are semantic only. They are never used for decoration, brand, or emphasis, and their soft tints appear only as notification grounds.

## Typography

**Display Font:** Archivo (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo (with ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SFMono-Regular, Menlo, monospace)

**Character:** A workmanlike grotesque carries headings and reading text with confidence; a crisp monospace carries every label, tag, and number so measured data is unmistakable for prose. The pairing reads as a technical instrument, not a marketing page.

### Hierarchy
- **Display** (600, 2.5rem, 1.02, -0.03em): The landing headline only; the largest voice on any surface.
- **Headline** (600, 2.25rem, 1.1, -0.02em): Section headings such as "Scored dimensions" and page titles.
- **Title** (600, 1.125rem, 1.3): Row and panel headings inside sheets.
- **Body** (400, 1rem, 1.625, max ~65ch): Prose and rationale text.
- **Label** (500, 0.60–0.78rem micro-scale, uppercase, 0.12–0.16em): Field labels, tags, table headers, and metadata; always monospace. The micro-scale steps are 0.60 / 0.62 / 0.64 / 0.66 / 0.68 / 0.70 / 0.72 / 0.78rem.

### Named Rules
**The Label Rule.** Anything monospace and uppercase is a label or a measurement. Prose never sets in monospace, and labels never set in Archivo.

**The Tabular Rule.** Every number that can be compared vertically (scores, dates) uses tabular figures.

## Layout

A single centered column caps at 72rem (max-w-6xl) for landing bands and at 64rem / 48rem for working pages, with 1.25rem gutters. Content is organized as full-width ruled rows inside bordered sheets rather than as a grid of cards. Where two or more fields share a row, they use fixed-fraction columns (for example `minmax(0,17rem) 1fr` for the verdict readout). The rhythm is one scale: 8 / 12 / 16 / 24 / 40px, with more space above a heading than below it. Mobile collapses multi-column rows to a single stack with the same hairline dividers.

## Elevation & Depth

There are no shadows in this system. Depth is conveyed entirely by hairline rules, a single filled field tone (#eceee9) behind readouts and rewrite examples, and the boundary weight difference between Rule and Rule Strong. A surface that appears to float has been built wrong.

**The Flat Rule.** No `box-shadow` anywhere, including hover and focus. State is shown with border color, border weight, and fill — never with elevation.

## Shapes

The form language is squared and industrial. Sheets use a 0px corner (hard 90°); controls, tags, and buttons use a 2px corner — just enough to avoid looking broken, never rounded enough to read as a pill. Borders are 1px hairlines, except the dropzone which uses a 2px dashed boundary. No circles, no capsules, no large radii.

## Components

### Buttons
- **Shape:** 2px radius, 1px border, square proportion. Labels are monospace, uppercase, 0.12em tracked.
- **Primary:** Highlighter Mark fill (#c9f24a) with Mark Ink text (#10130a).
- **Hover / Focus:** Brightness shift on hover; a 2px ink outline with 2px offset on `:focus-visible`. No shadow, no lift.
- **Secondary / Ghost / Outline:** Ink fill with paper text; outline is a surface fill with a Rule Strong border that darkens to Ink on hover; ghost is borderless until hover.

### Chips / Tags
- **Style:** 1px border, 2px radius, monospace uppercase at 0.66rem with 0.12em tracking. Neutral tags use a Rule Strong border and Soft Ink text; a filled black variant marks matched state; warn/fail tints carry missing keywords and errors.

### Cards / Containers
- **Corner Style:** 0px (sheets).
- **Background:** Surface (#ffffff) on a Paper (#f2f3ef) ground.
- **Shadow Strategy:** none — see Elevation & Depth.
- **Border:** 1px Rule all around, with 1px Rule dividers between rows.
- **Internal Padding:** 16px (24px on wide bands).

### Inputs / Fields
- **Style:** 1px Rule border, 2px radius, surface fill, monospace value, muted uppercase label above.
- **Focus:** Border shifts to Ink; the global 2px ink outline applies on `:focus-visible`. No glow.
- **Error / Disabled:** Errors surface in a Fail-bordered notice row; disabled controls drop to 40% opacity.

### Navigation
- Top toolbar: a 2.5px highlighter square beside an uppercase monospace wordmark; monospace uppercase links whose active state is a 2px Highlighter Mark underline. A primary action button anchors the right end. Below 640px the links collapse into a bordered menu of hairline-separated rows.

### Signature Component: The Readout
The overall score is an instrument reading, not a trophy: a large tabular numeral over `/100`, the tone word (Strong / Marginal / Weak) in monospace, and a filled, tick-marked linear meter with 0 / 50 / 100 endpoints. It appears once per report, in a Field-toned footer inside the parse sheet.

### Signature Component: The Parse Row
`LABEL · dotted rule · VALUE` in monospace: the literal shape of a machine extracting fields from a resume. Landing-page rows decode into view in a short stagger; report rows reuse the same rhythm for dimensions and the fix queue.

## Do's and Don'ts

### Do:
- **Do** separate content with 1px Rule hairlines and full-width rows.
- **Do** set every label, tag, and measurement in monospace uppercase with tabular figures.
- **Do** reserve the highlighter mark for the primary action and marked emphasis, always with black text.
- **Do** keep corners at 0px for sheets and 2px for controls.
- **Do** express state with border and fill, and keep the surface flat.

### Don't:
- **Don't** use `box-shadow` or any elevation to imply depth.
- **Don't** use rounded pills, capsules, or large radii.
- **Don't** use gradients, glass, or blur as decoration.
- **Don't** use the highlighter mark as body text or as a large background field.
- **Don't** use pass/warn/fail colors for anything but state, and never as a left/right border accent.
- **Don't** set running prose in monospace or labels in Archivo.
- **Don't** ship a card grid of icon + heading + text as page structure.
