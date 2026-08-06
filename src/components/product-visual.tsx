import type { ReactElement, ReactNode } from "react";
import type { ProductSlug } from "@/lib/site";

/**
 * Diagrammatic stand-ins for the product screenshots. Each one is a
 * before → after diptych showing what the product actually converts:
 * scattered input on the left, structured output on the right.
 *
 * TODO: replace with real screenshots once Hamza sends them — these are
 * designed to be swapped out, not to be the final state.
 */

const pinPositions = [
  { x: 66, y: 96 },
  { x: 148, y: 62 },
  { x: 108, y: 178 },
  { x: 206, y: 148 },
  { x: 158, y: 246 },
  { x: 74, y: 268 },
  { x: 226, y: 236 },
];

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 760 340"
      role="img"
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="759"
        height="339"
        stroke="var(--color-rule-strong)"
        fill="var(--color-paper)"
      />
      {/* Divider between the two halves of the diptych. */}
      <line
        x1="380"
        y1="0"
        x2="380"
        y2="340"
        stroke="var(--color-rule-strong)"
        strokeDasharray="3 5"
      />
      {children}
    </svg>
  );
}

function Arrow() {
  return (
    <g stroke="var(--color-amber)" strokeWidth="1.5">
      <line x1="358" y1="170" x2="402" y2="170" />
      <path d="M394 163l8 7-8 7" fill="none" />
    </g>
  );
}

/** Right-hand side: a structured table of rows. */
function OutputRows({ label }: { label: string }) {
  return (
    <g>
      <text
        x="440"
        y="66"
        fill="var(--color-ink-faint)"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        letterSpacing="1.6"
      >
        {label}
      </text>
      {[0, 1, 2, 3, 4].map((row) => {
        const y = 92 + row * 40;
        return (
          <g key={row}>
            <rect
              x="440"
              y={y}
              width="256"
              height="26"
              stroke="var(--color-rule-strong)"
              fill="var(--color-paper-deep)"
            />
            <rect x="450" y={y + 10} width="54" height="6" fill="var(--color-ink)" opacity="0.55" />
            <rect x="516" y={y + 10} width="84" height="6" fill="var(--color-ink)" opacity="0.22" />
            <rect x="612" y={y + 10} width="40" height="6" fill="var(--color-amber)" opacity="0.75" />
          </g>
        );
      })}
    </g>
  );
}

function MapsVisual() {
  return (
    <Frame>
      {/* Faint street grid. */}
      <g stroke="var(--color-rule)" strokeWidth="1">
        {[70, 130, 190, 250].map((y) => (
          <line key={y} x1="34" y1={y} x2="346" y2={y} />
        ))}
        {[100, 170, 240, 310].map((x) => (
          <line key={x} x1={x} y1="34" x2={x} y2="306" />
        ))}
      </g>

      <text
        x="34"
        y="26"
        fill="var(--color-ink-faint)"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        letterSpacing="1.6"
      >
        MAPS RESULTS
      </text>

      {pinPositions.map((pin, index) => (
        <g key={index} transform={`translate(${pin.x} ${pin.y})`}>
          <path
            d="M0 0c0-7.7-6.3-14-14-14S-28-7.7-28 0c0 10.5 14 24 14 24S0 10.5 0 0z"
            transform="translate(14 -24)"
            fill={index < 5 ? "var(--color-amber)" : "var(--color-ink)"}
            opacity={index < 5 ? 1 : 0.25}
          />
          <circle cx="14" cy="-24" r="4.5" fill="var(--color-paper)" />
        </g>
      ))}

      <Arrow />
      <OutputRows label="NAME · EMAIL · PHONE · SITE" />
    </Frame>
  );
}

function WhatsAppVisual() {
  const bubbles = [
    { y: 74, w: 150, mine: false },
    { y: 118, w: 108, mine: true },
    { y: 162, w: 176, mine: false },
    { y: 206, w: 128, mine: true },
    { y: 250, w: 96, mine: false },
  ];

  return (
    <Frame>
      <text
        x="34"
        y="46"
        fill="var(--color-ink-faint)"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        letterSpacing="1.6"
      >
        WHATSAPP THREAD
      </text>

      {bubbles.map((bubble, index) => (
        <rect
          key={index}
          x={bubble.mine ? 346 - bubble.w : 34}
          y={bubble.y}
          width={bubble.w}
          height="30"
          rx="4"
          fill={bubble.mine ? "var(--color-amber)" : "var(--color-paper-deep)"}
          stroke={bubble.mine ? "none" : "var(--color-rule-strong)"}
          opacity={bubble.mine ? 0.9 : 1}
        />
      ))}

      <Arrow />

      {/* Kitchen ticket. */}
      <g>
        <text
          x="440"
          y="46"
          fill="var(--color-ink-faint)"
          fontFamily="var(--font-mono), monospace"
          fontSize="10"
          letterSpacing="1.6"
        >
          KITCHEN TICKET
        </text>
        <rect
          x="440"
          y="62"
          width="256"
          height="220"
          stroke="var(--color-rule-strong)"
          fill="var(--color-paper-deep)"
        />
        <line x1="440" y1="98" x2="696" y2="98" stroke="var(--color-rule-strong)" />
        <rect x="456" y="76" width="70" height="8" fill="var(--color-amber)" />
        {[0, 1, 2, 3].map((row) => (
          <g key={row}>
            <rect
              x="456"
              y={116 + row * 32}
              width="12"
              height="8"
              fill="var(--color-ink)"
              opacity="0.5"
            />
            <rect
              x="480"
              y={116 + row * 32}
              width={140 - row * 22}
              height="8"
              fill="var(--color-ink)"
              opacity="0.3"
            />
          </g>
        ))}
        <line x1="440" y1="252" x2="696" y2="252" stroke="var(--color-rule-strong)" />
        <rect x="456" y="264" width="96" height="8" fill="var(--color-ink)" opacity="0.5" />
      </g>
    </Frame>
  );
}

function AgentVisual() {
  const inputs = [80, 140, 200, 260];
  const outputs = [104, 170, 236];

  return (
    <Frame>
      <text
        x="34"
        y="46"
        fill="var(--color-ink-faint)"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        letterSpacing="1.6"
      >
        MESSY INPUT
      </text>

      {inputs.map((y, index) => (
        <g key={y}>
          <rect
            x="34"
            y={y}
            width={196 - index * 18}
            height="26"
            stroke="var(--color-rule-strong)"
            fill="var(--color-paper-deep)"
          />
          <line
            x1={230 - index * 18}
            y1={y + 13}
            x2="330"
            y2="170"
            stroke="var(--color-rule-strong)"
            strokeDasharray="2 4"
          />
        </g>
      ))}

      {/* The agent. */}
      <circle cx="380" cy="170" r="46" fill="var(--color-amber)" />
      <circle cx="380" cy="170" r="60" stroke="var(--color-amber)" opacity="0.3" />
      <circle cx="380" cy="170" r="76" stroke="var(--color-amber)" opacity="0.14" />
      <text
        x="380"
        y="174"
        textAnchor="middle"
        fill="var(--color-paper)"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        letterSpacing="1.4"
      >
        AGENT
      </text>

      <text
        x="470"
        y="46"
        fill="var(--color-ink-faint)"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        letterSpacing="1.6"
      >
        DECIDED ACTION
      </text>

      {outputs.map((y) => (
        <g key={y}>
          <line
            x1="430"
            y1="170"
            x2="470"
            y2={y + 13}
            stroke="var(--color-amber)"
            strokeWidth="1.2"
          />
          <rect
            x="470"
            y={y}
            width="226"
            height="26"
            stroke="var(--color-amber)"
            fill="var(--color-amber-wash)"
          />
          <rect x="484" y={y + 10} width="72" height="6" fill="var(--color-amber)" />
          <rect
            x="568"
            y={y + 10}
            width="110"
            height="6"
            fill="var(--color-ink)"
            opacity="0.25"
          />
        </g>
      ))}
    </Frame>
  );
}

const visuals: Record<ProductSlug, () => ReactElement> = {
  "lead-extractor": MapsVisual,
  orderrise: WhatsAppVisual,
  "ai-agents": AgentVisual,
};

export function ProductVisual({ slug }: { slug: ProductSlug }) {
  const Visual = visuals[slug];
  return <Visual />;
}
