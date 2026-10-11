/**
 * Authored SVG illustration: a resume being scanned while an analyzer extracts
 * its fields. Motion is CSS-driven (hero-scan / hero-chip / hero-spin).
 */
export function HeroVisual() {
  const chips = [
    { y: 140, label: "CONTACT", ok: true, delay: "120ms" },
    { y: 176, label: "SKILLS", ok: true, delay: "280ms" },
    { y: 212, label: "METRICS", ok: false, delay: "440ms" },
  ];

  return (
    <svg
      viewBox="0 0 440 300"
      role="img"
      aria-label="A resume being scanned while its fields are extracted and scored"
      className="h-auto w-full"
    >
      <defs>
        <clipPath id="ra-sheet">
          <rect x="30" y="26" width="190" height="248" rx="3" />
        </clipPath>
      </defs>

      {/* Ground plate */}
      <rect x="6" y="6" width="428" height="288" rx="6" fill="var(--color-field)" />

      {/* Sheet behind, for depth */}
      <rect x="46" y="36" width="188" height="244" rx="3" fill="var(--color-paper-deep)" />

      {/* Resume sheet */}
      <rect x="30" y="26" width="190" height="248" rx="3" fill="var(--color-surface)" stroke="var(--color-rule)" />

      <g clipPath="url(#ra-sheet)">
        {/* Header */}
        <rect x="46" y="46" width="104" height="11" rx="1" fill="var(--color-ink)" />
        <rect x="46" y="64" width="140" height="5" rx="1" fill="var(--color-rule-strong)" />
        <rect x="46" y="75" width="118" height="5" rx="1" fill="var(--color-rule-strong)" />

        {/* Section 1 */}
        <rect x="46" y="98" width="66" height="7" rx="1" fill="var(--color-brand)" />
        <rect x="46" y="114" width="158" height="5" rx="1" fill="var(--color-rule)" />
        <rect x="46" y="126" width="146" height="5" rx="1" fill="var(--color-rule)" />
        <rect x="46" y="138" width="164" height="5" rx="1" fill="var(--color-rule)" />

        {/* Section 2 */}
        <rect x="46" y="162" width="66" height="7" rx="1" fill="var(--color-brand)" />
        <rect x="46" y="178" width="132" height="5" rx="1" fill="var(--color-rule)" />
        {/* A highlighted achievement line */}
        <rect x="46" y="190" width="96" height="7" rx="1" fill="var(--color-mark)" />
        <rect x="46" y="204" width="156" height="5" rx="1" fill="var(--color-rule)" />
        <rect x="46" y="216" width="120" height="5" rx="1" fill="var(--color-rule)" />
        <rect x="46" y="236" width="150" height="5" rx="1" fill="var(--color-rule)" />

        {/* Scan band */}
        <g className="hero-scan">
          <rect x="30" y="40" width="190" height="34" fill="var(--color-flame)" opacity="0.15" />
          <line x1="30" y1="57" x2="220" y2="57" stroke="var(--color-flame)" strokeWidth="2" />
        </g>
      </g>

      {/* Connector lines from sheet to extracted fields */}
      <path
        d="M220 60 C 246 60, 240 153, 256 153"
        fill="none"
        stroke="var(--color-rule-strong)"
        strokeDasharray="3 4"
      />
      <path
        d="M220 120 C 248 120, 240 189, 256 189"
        fill="none"
        stroke="var(--color-rule-strong)"
        strokeDasharray="3 4"
      />
      <path
        d="M220 200 C 248 200, 240 225, 256 225"
        fill="none"
        stroke="var(--color-rule-strong)"
        strokeDasharray="3 4"
      />

      {/* Analyzer gauge */}
      <g transform="translate(348, 74)">
        <circle r="30" fill="var(--color-surface)" stroke="var(--color-rule)" strokeWidth="1.5" />
        <circle
          r="30"
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="128 189"
          className="hero-spin"
        />
        <text
          textAnchor="middle"
          y="3"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize="19"
          fontWeight="600"
          fill="var(--color-ink)"
        >
          63
        </text>
        <text
          textAnchor="middle"
          y="16"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize="7"
          letterSpacing="1.5"
          fill="var(--color-muted)"
        >
          SCORE
        </text>
      </g>

      {/* Extracted field chips */}
      <g fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="9" letterSpacing="0.6">
        {chips.map((chip) => {
          const stroke = chip.ok ? "var(--color-pass)" : "var(--color-fail)";
          return (
            <g key={chip.label} className="hero-chip" style={{ animationDelay: chip.delay }}>
              <rect
                x="256"
                y={chip.y}
                width="168"
                height="26"
                rx="2"
                fill="var(--color-surface)"
                stroke="var(--color-rule)"
              />
              <text x="268" y={chip.y + 17} fill="var(--color-ink-soft)">
                {chip.label}
              </text>
              {chip.ok ? (
                <path
                  d={`M402 ${chip.y + 13} l3 3 l6 -7`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d={`M402 ${chip.y + 10} l7 7 M409 ${chip.y + 10} l-7 7`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* Live indicator */}
      <g transform="translate(262, 62)">
        <circle r="3.5" fill="var(--color-flame)" className="hero-pulse" />
        <text
          x="10"
          y="3.5"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize="8"
          letterSpacing="1.4"
          fill="var(--color-muted)"
        >
          PARSING
        </text>
      </g>
    </svg>
  );
}
