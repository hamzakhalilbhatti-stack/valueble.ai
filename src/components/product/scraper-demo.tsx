"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Maps Lead Scraper — the product being used, not described.
 *
 * A scripted run of the real v5.2 extension: type a query, set the filters,
 * press Start, watch scored rows arrive. Every field and every weight below is
 * taken from the actual source, so nothing here claims a capability the
 * extension does not have.
 *
 * Runs once when scrolled into view and then holds its final state. A looping
 * demo reads as decoration and pulls attention off the copy.
 */

const QUERY = "restaurants in Dubai Marina";

type Step =
  | { at: number; kind: "move"; to: string }
  | { at: number; kind: "click" }
  | { at: number; kind: "type"; text: string }
  | { at: number; kind: "toggle"; id: "enrich" | "email" }
  | { at: number; kind: "run" };

const SCRIPT: Step[] = [
  { at: 500, kind: "move", to: "query" },
  { at: 950, kind: "click" },
  { at: 1150, kind: "type", text: QUERY },
  { at: 3100, kind: "move", to: "enrich" },
  { at: 3500, kind: "click" },
  { at: 3600, kind: "toggle", id: "enrich" },
  { at: 4000, kind: "move", to: "email" },
  { at: 4400, kind: "click" },
  { at: 4500, kind: "toggle", id: "email" },
  { at: 4900, kind: "move", to: "start" },
  { at: 5400, kind: "click" },
  { at: 5500, kind: "run" },
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

export function ScraperDemo({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [started, setStarted] = useState(false);
  const [cursor, setCursor] = useState({ x: 60, y: 50, on: false });
  const [clicking, setClicking] = useState(false);
  const [typed, setTyped] = useState("");
  const [toggles, setToggles] = useState({ enrich: false, email: false });
  const [running, setRunning] = useState(false);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduced) return;

    const timers: number[] = [];

    /*
     * Targets are found by data attribute rather than held in refs. The cursor
     * only ever needs a position at the moment it moves, so querying then is
     * both simpler and immune to stale references if the panel re-renders.
     */
    const moveTo = (key: string) => {
      const el = host.current?.querySelector<HTMLElement>(`[data-target="${key}"]`);
      const h = host.current?.getBoundingClientRect();
      const t = el?.getBoundingClientRect();
      if (!h || !t) return;
      setCursor({
        x: t.left - h.left + t.width * 0.5,
        y: t.top - h.top + t.height * 0.5,
        on: true,
      });
    };

    SCRIPT.forEach((step) => {
      timers.push(
        window.setTimeout(() => {
          if (step.kind === "move") moveTo(step.to);
          if (step.kind === "click") {
            setClicking(true);
            timers.push(window.setTimeout(() => setClicking(false), 170));
          }
          if (step.kind === "toggle") setToggles((t) => ({ ...t, [step.id]: true }));
          if (step.kind === "type") {
            step.text.split("").forEach((_, i) => {
              timers.push(
                window.setTimeout(() => setTyped(step.text.slice(0, i + 1)), i * 52),
              );
            });
          }
          if (step.kind === "run") {
            setRunning(true);
            setCursor((c) => ({ ...c, on: false }));
            LEADS.forEach((_, i) => {
              timers.push(window.setTimeout(() => setRows(i + 1), 450 + i * 280));
            });
          }
        }, step.at),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [started, reduced]);

  /*
   * Under reduced motion the panel shows its finished state directly rather
   * than being animated into it. Derived at render rather than written into
   * state by an effect — the information is the point here, the performance
   * is not, and there is no reason to render the empty version first.
   */
  const view = reduced
    ? {
        typed: QUERY,
        toggles: { enrich: true, email: true },
        running: true,
        rows: LEADS.length,
      }
    : { typed, toggles, running, rows };

  return (
    <div ref={host} className={cn("relative", className)}>
      <div className="grid gap-3 lg:grid-cols-[18rem_1fr]">
        {/* ── The extension panel ── */}
        <div className="panel">
          <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors duration-300",
                view.running ? "bg-scan" : "bg-faint",
              )}
            />
            <span className="ui-label text-paper">Maps Lead Scraper</span>
            <span className="ui-label ml-auto text-faint">v5.2</span>
          </div>

          <div className="space-y-3 p-4">
            <div>
              <p className="ui-label mb-2 text-faint">Search query</p>
              <div
                data-target="query"
                className="min-h-[2.25rem] border border-rule bg-black px-3 py-2 text-xs text-paper"
              >
                {view.typed}
                {view.typed.length > 0 && view.typed.length < QUERY.length && (
                  <span className="ml-px inline-block h-3 w-px animate-pulse bg-scan align-middle" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                ["Target", "100"],
                ["Min ★", "4.0"],
                ["Reviews", "25"],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="ui-label mb-2 truncate text-faint">{l}</p>
                  <div className="border border-rule bg-black px-2 py-1.5 text-center text-xs tabular-nums text-paper">
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span
                data-target="enrich"
                className={cn(
                  "ui-label border px-2 py-1.5 transition-colors duration-300",
                  view.toggles.enrich ? "border-scan/50 text-scan" : "border-rule text-faint",
                )}
              >
                {view.toggles.enrich ? "✓ " : ""}Enrich from website
              </span>
              <span
                data-target="email"
                className={cn(
                  "ui-label border px-2 py-1.5 transition-colors duration-300",
                  view.toggles.email ? "border-scan/50 text-scan" : "border-rule text-faint",
                )}
              >
                {view.toggles.email ? "✓ " : ""}Must have email
              </span>
            </div>

            <div
              data-target="start"
              className={cn(
                "w-full border px-3 py-2 text-center text-xs transition-colors duration-300",
                view.running ? "border-scan/40 text-scan" : "border-paper bg-paper text-ink",
              )}
            >
              {view.running ? "Running…" : "Start"}
            </div>
          </div>
        </div>

        {/* ── Results arriving ── */}
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-rule px-4 py-3">
            <span className="ui-label text-paper">leads.csv</span>
            <span className="ui-label tabular-nums text-faint">{view.rows} of 100 rows</span>
          </div>

          {/*
            The table has four columns of real data and cannot usefully reflow
            on a phone, so it scrolls inside its own box. The page body must
            never scroll sideways.
          */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="ui-label text-faint">
                {["Business", "Email", "Phone", "Score"].map((h) => (
                  <th key={h} className="border-b border-rule px-4 py-2.5 font-normal">
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
                    "border-b border-rule/60 transition-opacity duration-500 last:border-0",
                    i < view.rows ? "opacity-100" : "opacity-0",
                  )}
                >
                  <td className="px-4 py-3 text-paper">{lead.name}</td>
                  <td className="px-4 py-3">
                    {lead.email ? (
                      <span className="text-mute">{lead.email}</span>
                    ) : (
                      <span className="text-faint">— none published</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-mute">{lead.phone}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className="relative h-px w-10 bg-rule-strong">
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 transition-[width] duration-700",
                            lead.score >= 80 ? "bg-scan" : "bg-faint",
                          )}
                          style={{ width: i < view.rows ? `${lead.score}%` : "0%" }}
                        />
                      </span>
                      <span
                        className={cn(
                          "tabular-nums",
                          lead.score >= 80 ? "text-scan" : "text-faint",
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
      </div>

      {/* Scripted cursor. Decorative, so hidden from assistive tech. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-20 transition-all duration-500 ease-[var(--ease-out)]",
          cursor.on ? "opacity-100" : "opacity-0",
        )}
        style={{ left: cursor.x, top: cursor.y }}
      >
        <span
          className={cn(
            "block transition-transform duration-150",
            clicking ? "scale-75" : "scale-100",
          )}
        >
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
            <path d="M2 1.5l11 8-5 .6-2.6 4.8L2 1.5z" fill="#fff" stroke="#000" strokeWidth="1" />
          </svg>
        </span>
        {clicking && (
          <span className="absolute -inset-3 animate-ping rounded-full border border-scan/60" />
        )}
      </span>
    </div>
  );
}
