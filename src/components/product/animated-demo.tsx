"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Scripted product demonstration — cursor, typing, clicks, live counters.
 *
 * The whole point is that a visitor watches the product being *used* rather
 * than looking at a static screenshot. The script below is a timeline of real
 * interactions taken from the v5.2 extension: type a query, set a target,
 * enable website enrichment, press Start, watch rows arrive scored.
 *
 * Runs once when scrolled into view, then holds its final state. It does not
 * loop — a looping demo reads as decoration and pulls attention off the copy.
 */

type Step =
  | { at: number; kind: "move"; to: string }
  | { at: number; kind: "type"; text: string }
  | { at: number; kind: "click" }
  | { at: number; kind: "toggle"; id: string }
  | { at: number; kind: "run" };

const QUERY = "restaurants in Dubai Marina";

/** Timeline in milliseconds from the moment the demo enters view. */
const SCRIPT: Step[] = [
  { at: 400, kind: "move", to: "query" },
  { at: 900, kind: "click" },
  { at: 1100, kind: "type", text: QUERY },
  { at: 3000, kind: "move", to: "enrich" },
  { at: 3400, kind: "click" },
  { at: 3500, kind: "toggle", id: "enrich" },
  { at: 3900, kind: "move", to: "email" },
  { at: 4300, kind: "click" },
  { at: 4400, kind: "toggle", id: "email" },
  { at: 4800, kind: "move", to: "start" },
  { at: 5300, kind: "click" },
  { at: 5400, kind: "run" },
];

type Lead = { name: string; email: string | null; phone: string; score: number };

const LEADS: Lead[] = [
  { name: "Bella Napoli Pizzeria", email: "info@bellanapoli.ae", phone: "+971 4 555 0142", score: 95 },
  { name: "The Curry Leaf", email: "hello@curryleaf.ae", phone: "+971 4 555 0198", score: 95 },
  { name: "Marina Grill House", email: "book@marinagrill.ae", phone: "+971 4 555 0233", score: 95 },
  { name: "Saffron Kitchen", email: null, phone: "+971 4 555 0117", score: 67 },
  { name: "Corner Shawarma", email: "orders@cornershawarma.ae", phone: "+971 4 555 0165", score: 95 },
  { name: "Green Fork Cafe", email: null, phone: "+971 4 555 0271", score: 67 },
];

export function AnimatedScraperDemo({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const targets = useRef<Record<string, HTMLElement | null>>({});

  const [started, setStarted] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 40, visible: false });
  const [clicking, setClicking] = useState(false);
  const [typed, setTyped] = useState("");
  const [toggles, setToggles] = useState({ enrich: false, email: false });
  const [running, setRunning] = useState(false);
  const [rows, setRows] = useState(0);
  const [counts, setCounts] = useState({ queued: 0, leads: 0, email: 0 });

  // Start once, on first entry into view.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Respect reduced motion by jumping straight to the finished state.
  useEffect(() => {
    if (!started) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(QUERY);
      setToggles({ enrich: true, email: true });
      setRunning(true);
      setRows(LEADS.length);
      setCounts({ queued: 128, leads: 100, email: 74 });
      return;
    }

    const timers: number[] = [];

    const moveTo = (key: string) => {
      const host = hostRef.current;
      const target = targets.current[key];
      if (!host || !target) return;
      const h = host.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      setCursor({
        x: t.left - h.left + t.width * 0.5,
        y: t.top - h.top + t.height * 0.5,
        visible: true,
      });
    };

    SCRIPT.forEach((step) => {
      timers.push(
        window.setTimeout(() => {
          if (step.kind === "move") moveTo(step.to);
          if (step.kind === "click") {
            setClicking(true);
            timers.push(window.setTimeout(() => setClicking(false), 180));
          }
          if (step.kind === "toggle") {
            setToggles((t) => ({ ...t, [step.id]: true }));
          }
          if (step.kind === "type") {
            step.text.split("").forEach((_, i) => {
              timers.push(
                window.setTimeout(() => setTyped(step.text.slice(0, i + 1)), i * 55),
              );
            });
          }
          if (step.kind === "run") {
            setRunning(true);
            setCursor((c) => ({ ...c, visible: false }));
            // Rows arrive one at a time, the way a real run fills the table.
            LEADS.forEach((_, i) => {
              timers.push(window.setTimeout(() => setRows(i + 1), 400 + i * 260));
            });
            // Counters climb over the same window.
            const start = performance.now();
            const tick = () => {
              const p = Math.min(1, (performance.now() - start) / 2200);
              const e = 1 - Math.pow(1 - p, 3);
              setCounts({
                queued: Math.round(128 * e),
                leads: Math.round(100 * e),
                email: Math.round(74 * e),
              });
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }, step.at),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [started]);

  const reg = (key: string) => (el: HTMLElement | null) => {
    targets.current[key] = el;
  };

  return (
    <div ref={hostRef} className={cn("relative", className)}>
      <div className="grid gap-4 lg:grid-cols-[19rem_1fr]">
        {/* ── Extension panel ── */}
        <div className="border border-rule bg-surface/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
            <span className={cn("size-2 rounded-full", running ? "bg-signal" : "bg-bone-faint")} />
            <span className="label text-bone">Maps Lead Scraper</span>
            <span className="label ml-auto text-bone-faint">v5.2</span>
          </div>

          <div className="space-y-3 p-4">
            <div>
              <p className="label mb-1.5 text-bone-faint">Search queries</p>
              <div
                ref={reg("query")}
                className="min-h-[2.25rem] border border-rule bg-void px-3 py-2 text-xs text-bone"
              >
                {typed}
                {typed.length > 0 && typed.length < QUERY.length && (
                  <span className="ml-px inline-block h-3 w-px animate-pulse bg-signal align-middle" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                ["Valid leads", "100"],
                ["Min rating", "4.0"],
                ["Min reviews", "25"],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="label mb-1.5 text-bone-faint">{l}</p>
                  <div className="border border-rule bg-void px-2 py-1.5 text-center text-xs tabular-nums text-bone">
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span
                ref={reg("enrich")}
                className={cn(
                  "label border px-2 py-1 transition-colors duration-300",
                  toggles.enrich ? "border-signal/50 text-signal" : "border-rule text-bone-faint",
                )}
              >
                {toggles.enrich ? "✓ " : ""}Enrich from website
              </span>
              <span
                ref={reg("email")}
                className={cn(
                  "label border px-2 py-1 transition-colors duration-300",
                  toggles.email ? "border-signal/50 text-signal" : "border-rule text-bone-faint",
                )}
              >
                {toggles.email ? "✓ " : ""}Must have email
              </span>
            </div>

            <button
              ref={reg("start")}
              type="button"
              tabIndex={-1}
              aria-hidden
              className={cn(
                "w-full border px-3 py-2 text-xs tracking-tight transition-colors duration-300",
                running
                  ? "border-signal/40 text-signal"
                  : "border-bone/30 bg-bone/90 text-void",
              )}
            >
              {running ? "Running…" : "Start"}
            </button>

            <div className="grid grid-cols-3 gap-2 border-t border-rule pt-3 text-center">
              {[
                ["Queued", counts.queued],
                ["Leads", counts.leads],
                ["With email", counts.email],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <p className="font-display text-2xl leading-none tabular-nums text-bone">
                    {v as number}
                  </p>
                  <p className="label mt-1 text-bone-faint">{l as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results filling in ── */}
        <div className="overflow-hidden border border-rule bg-surface/70 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-rule px-4 py-3">
            <span className="label text-bone">google-maps-ui-leads.csv</span>
            <span className="label tabular-nums text-bone-faint">{counts.leads} rows</span>
          </div>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="label text-bone-faint">
                {["Business", "Email", "Phone", "Score"].map((h) => (
                  <th key={h} className="border-b border-rule px-4 py-2 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">
              {LEADS.map((lead, i) => (
                <tr
                  key={lead.name}
                  className={cn(
                    "border-b border-rule/60 transition-all duration-500 last:border-0",
                    i < rows ? "opacity-100" : "opacity-0",
                  )}
                  style={{ transform: i < rows ? "none" : "translateY(6px)" }}
                >
                  <td className="px-4 py-2.5 text-bone">{lead.name}</td>
                  <td className="px-4 py-2.5">
                    {lead.email ? (
                      <span className="text-bone-soft">{lead.email}</span>
                    ) : (
                      <span className="text-bone-faint">— not published</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-bone-soft">{lead.phone}</td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2">
                      <span className="relative h-1 w-10 overflow-hidden bg-rule">
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 transition-[width] duration-700",
                            lead.score >= 80 ? "bg-signal" : "bg-bone-faint",
                          )}
                          style={{ width: i < rows ? `${lead.score}%` : "0%" }}
                        />
                      </span>
                      <span
                        className={cn(
                          "tabular-nums",
                          lead.score >= 80 ? "text-signal" : "text-bone-faint",
                        )}
                      >
                        {lead.score}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scripted cursor. Decorative, so hidden from assistive tech. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-20 transition-all duration-500 ease-[var(--ease-editorial)]",
          cursor.visible ? "opacity-100" : "opacity-0",
        )}
        style={{ left: cursor.x, top: cursor.y }}
      >
        <span
          className={cn(
            "block transition-transform duration-150",
            clicking ? "scale-75" : "scale-100",
          )}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 1.5l11 8-5 .6-2.6 4.8L2 1.5z" fill="#eef0f6" stroke="#07080f" strokeWidth="1" />
          </svg>
        </span>
        {clicking && (
          <span className="absolute -inset-3 animate-ping rounded-full border border-signal/60" />
        )}
      </span>
    </div>
  );
}
