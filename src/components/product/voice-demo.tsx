"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, PhoneCall, PhoneForwarded, Play, RotateCcw } from "lucide-react";
import { DemoLabel } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * AI Voice Agent — an interactive call player.
 *
 * Press play: the waveform animates for whoever is speaking, the transcript
 * types out live, and the call card on the right fills as the agent books an
 * appointment. At the end the caller asks something the agent should not
 * answer (a price for a specific treatment) and the call is handed to a person.
 *
 * Illustrative call, labelled as such. There is no audio file pretending to be
 * the product.
 * TODO (owner): replace with a transcript from a real demo call, and add the
 * real recording as an optional "listen" button once one exists.
 */

type Line = { from: "agent" | "caller" | "system"; text: string };
const CALL: Line[] = [
  { from: "agent", text: "Good evening, Smile Studio Dental. This is the after-hours assistant. How can I help?" },
  { from: "caller", text: "Hi, I chipped a tooth at dinner. Can I get in this week?" },
  { from: "agent", text: "Sorry to hear that. Dr. Malik has Thursday at 10:30 or Friday at 4:15. Which works better?" },
  { from: "caller", text: "Thursday, please. It's Sara Ahmed." },
  { from: "agent", text: "Booked: Thursday at 10:30 with Dr. Malik, for Sara Ahmed. I'll send a WhatsApp confirmation to this number." },
  { from: "caller", text: "Great. Will the repair be covered by my insurance plan?" },
  { from: "agent", text: "That depends on your plan, and I don't want to guess. I'm transferring you to a member of the team now." },
  { from: "system", text: "Transferred to front desk · call summary sent" },
];

/** Fields on the call card, revealed after the given transcript line finishes. */
const CARD: { k: string; v: string; after: number }[] = [
  { k: "Caller", v: "Sara Ahmed", after: 3 },
  { k: "Reason", v: "Chipped tooth", after: 1 },
  { k: "Booked", v: "Thu 10:30 · Dr. Malik", after: 4 },
  { k: "Confirmation", v: "WhatsApp sent", after: 4 },
  { k: "Handoff", v: "Insurance question → front desk", after: 6 },
];

const BARS = 36;
const CPS = 42; // characters per second while "speaking"
const GAP = 26; // pause between turns, in character-time (~0.6s)

/** Each line occupies [start, end) on one timeline measured in characters. */
const TIMELINE = (() => {
  let t = 0;
  return CALL.map((l) => {
    const start = t;
    t += l.text.length + (l.from === "system" ? 0 : GAP);
    return { start, end: start + l.text.length };
  });
})();
const TOTAL = TIMELINE[TIMELINE.length - 1].end;

export function VoiceDemo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | undefined>(undefined);
  const posRef = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    let last = 0;
    const tick = (t: number) => {
      const dt = last ? t - last : 0;
      last = t;
      const n = Math.min(TOTAL, posRef.current + (dt / 1000) * CPS);
      posRef.current = n;
      setPos(n);
      const ended = n >= TOTAL;
      if (ended) setPlaying(false);
      else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [playing]);

  // Index of the line currently being spoken (or the last one started).
  let line = 0;
  TIMELINE.forEach((seg, i) => {
    if (pos >= seg.start) line = i;
  });
  const chars = Math.max(0, pos - TIMELINE[line].start);
  const finished = pos >= TOTAL;
  const started = pos > 0;
  const inSpeech = pos < TIMELINE[line].end;
  const speaking = playing && inSpeech ? CALL[line].from : null;

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [line, Math.floor(chars / 20)]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (finished) {
      posRef.current = 0;
      setPos(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };
  const restart = () => {
    posRef.current = 0;
    setPos(0);
    setPlaying(true);
  };

  const shownLines = CALL.slice(0, line + 1);
  const elapsed = Math.round(pos / 14);
  const handoff = line >= 7;

  return (
    <div className={cn("theme-dark overflow-hidden rounded-[1.75rem] border border-rule shadow-[0_40px_80px_-40px_oklch(0.2_0.02_265/0.6)]", className)} data-od-id="voice-demo">
      <div className="grid lg:grid-cols-[1fr_18rem]">
        <div className="flex min-w-0 flex-col">
          {/* Call bar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-rule px-5 py-4">
            <span className={cn("grid size-10 place-items-center rounded-full", handoff ? "bg-warm/15 text-warm" : "bg-voice/15 text-voice")}>
              {handoff ? <PhoneForwarded aria-hidden className="size-[1.125rem]" /> : <PhoneCall aria-hidden className="size-[1.125rem]" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-paper">Inbound call · Smile Studio Dental</p>
              <p className="ui-label mt-1 text-voice" aria-live="polite">
                {!started ? "Ready" : finished ? "Handed to a person" : speaking === "caller" ? "Caller speaking" : speaking === "agent" ? "AI agent speaking" : playing ? "…" : "Paused"}
                <span className="ml-2 text-faint">
                  0:{String(Math.min(elapsed, 59)).padStart(2, "0")}
                </span>
              </p>
            </div>
            <DemoLabel>Demo call</DemoLabel>
          </div>

          {/* Waveform + controls */}
          <div className="flex items-center gap-4 border-b border-rule bg-ink-2 px-5 py-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause demo call" : finished ? "Replay demo call" : "Play demo call"}
              className="grid size-14 shrink-0 place-items-center rounded-full bg-accent text-on-accent shadow-[0_10px_30px_-10px_var(--accent)] transition-[transform,background-color] hover:scale-105 hover:bg-accent-strong active:scale-95"
            >
              {playing ? <Pause aria-hidden className="size-6" /> : finished ? <RotateCcw aria-hidden className="size-6" /> : <Play aria-hidden className="ml-0.5 size-6" />}
            </button>
            <div aria-hidden className="flex h-12 flex-1 items-center gap-[3px] overflow-hidden">
              {Array.from({ length: BARS }, (_, i) => {
                const h = Math.round((0.3 + 0.7 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))) * 100) / 100;
                return (
                  <span
                    key={i}
                    className={cn(
                      "w-1 shrink-0 rounded-full transition-colors duration-300",
                      speaking === "agent" ? "wave-bar bg-voice" : speaking === "caller" ? "wave-bar bg-paper/70" : "bg-rule-strong",
                    )}
                    style={{ height: `${Math.round(h * 100)}%`, animationDelay: `${((i % 9) * -0.12).toFixed(2)}s`, transform: speaking ? undefined : "scaleY(0.25)" }}
                  />
                );
              })}
            </div>
          </div>

          {/* Transcript */}
          <div ref={scroller} className={cn("space-y-3 overflow-y-auto overscroll-contain px-5 py-5", compact ? "h-[16rem]" : "h-[20rem]")} role="log" aria-label="Live call transcript">
            {!started && (
              <div className="grid h-full place-items-center text-center">
                <p className="max-w-xs text-sm text-mute">
                  Press play to hear how the agent handles an after-hours call, including the moment it hands off to a person.
                </p>
              </div>
            )}
            {started &&
              shownLines.map((l, i) => {
                const text = i === line ? l.text.slice(0, Math.floor(chars)) : l.text;
                if (!text) return null;
                if (l.from === "system")
                  return (
                    <p key={i} className="msg-in mx-auto flex w-fit items-center gap-2 rounded-full border border-warm/40 bg-warm/10 px-3 py-1.5 text-xs font-medium text-warm">
                      <PhoneForwarded aria-hidden className="size-3.5" /> {text}
                    </p>
                  );
                return (
                  <div key={i} className={cn("msg-in flex", l.from === "caller" ? "justify-start" : "justify-end")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        l.from === "caller" ? "rounded-tl-sm bg-ink-3 text-paper" : "rounded-tr-sm bg-voice/15 text-paper",
                      )}
                    >
                      <span className={cn("ui-label mb-1 block", l.from === "caller" ? "text-faint" : "text-voice")}>
                        {l.from === "caller" ? "Caller" : "AI voice agent"}
                      </span>
                      {text}
                      {i === line && playing && <span aria-hidden className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-paper" />}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Call card */}
        <aside className="border-t border-rule bg-ink-2 p-5 lg:border-l lg:border-t-0" aria-label="What the agent logged">
          <div className="flex items-center justify-between">
            <span className="ui-label text-paper">Logged to your CRM</span>
            <span className={cn("ui-label", finished ? "text-accent" : "text-faint")}>{finished ? "Saved" : started ? "Live" : "Waiting"}</span>
          </div>
          <dl className="mt-4 space-y-3">
            {CARD.map((f) => {
              const on = pos >= TIMELINE[f.after].end;
              return (
                <div key={f.k} className="rounded-xl border border-rule bg-ink px-3 py-2.5">
                  <dt className="ui-label text-faint">{f.k}</dt>
                  <dd className={cn("mt-1 text-sm transition-colors duration-500", on ? "text-paper" : "text-faint")}>{on ? f.v : "—"}</dd>
                </div>
              );
            })}
          </dl>
          {started && (
            <button type="button" onClick={restart} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm text-paper underline-offset-4 hover:underline">
              <RotateCcw aria-hidden className="size-4" /> Restart call
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

/** Small decorative waveform used in cards and the hero. */
export function Waveform({ className, tone = "voice" }: { className?: string; tone?: "voice" | "accent" }) {
  const bars = [0.4, 0.75, 0.55, 1, 0.65, 0.85, 0.45, 0.95, 0.6, 0.8, 0.5, 0.9, 0.55, 0.7, 0.4, 0.85, 0.6, 1, 0.5, 0.75];
  return (
    <div aria-hidden className={cn("flex h-10 items-center gap-[3px]", className)}>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("wave-bar w-[3px] rounded-full", tone === "voice" ? "bg-voice" : "bg-accent")}
          style={{ height: `${Math.round(h * 100)}%`, animationDelay: `${((i % 7) * -0.13).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}
