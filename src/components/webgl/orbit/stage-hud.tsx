"use client";

import { useEffect, useState } from "react";
import { ORBITS, STAGE_BOUNDS, stageIndexAt } from "./stages";

const STAGE_LABELS = [
  "Enter the atmosphere",
  "Reveal the world",
  "Activate the orbit",
  "Maps Lead Scraper",
  "OrderRise",
  "Custom AI Agents",
  "Align the ecosystem",
  "Final destination",
];

/** Which accent belongs to the stage, if it is a service stage. */
const STAGE_ACCENT: (string | null)[] = [
  null,
  null,
  null,
  ORBITS[0].accent,
  ORBITS[1].accent,
  ORBITS[2].accent,
  null,
  null,
];

/**
 * Stage indicator — `04 / 08` plus the stage name.
 *
 * Serves the Milestone 1 review directly: it makes stage boundaries and the
 * stillness points legible while stepping through the journey. It is also the
 * permanent orientation cue the plan calls for.
 */
export function StageHud() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onProgress = (event: Event) => {
      const p = (event as CustomEvent<number>).detail;
      setProgress(p);
      setIndex(stageIndexAt(p));
    };
    window.addEventListener("orbit:progress", onProgress);
    return () => window.removeEventListener("orbit:progress", onProgress);
  }, []);

  const bounds = STAGE_BOUNDS[index];
  const within = bounds
    ? Math.min(1, Math.max(0, (progress - bounds.from) / (bounds.to - bounds.from || 1)))
    : 0;
  const accent = STAGE_ACCENT[index];

  return (
    <div
      aria-hidden
      // Bottom-right: the bottom-left corner is occupied by Next's dev indicator.
      className="pointer-events-none fixed right-6 bottom-6 z-40 hidden select-none md:block"
    >
      <div className="flex items-center gap-3">
        <span className="label text-bone-faint tabular-nums">
          {String(index + 1).padStart(2, "0")} / 08
        </span>
        <span
          className="h-px w-10 origin-left transition-transform duration-300"
          style={{
            background: accent ?? "var(--color-bone-faint)",
            transform: `scaleX(${0.15 + within * 0.85})`,
          }}
        />
        <span className="label" style={{ color: accent ?? "var(--color-bone-soft)" }}>
          {STAGE_LABELS[index]}
        </span>
      </div>
    </div>
  );
}
