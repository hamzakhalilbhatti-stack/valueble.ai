"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, PhoneCall, PhoneForwarded, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { DemoLabel } from "@/components/ui";

import { cn } from "@/lib/cn";

/**
 * AI Voice Agent — an interactive call player with real synthesised audio.
 *
 * Press play: each turn plays its own voice clip (public/audio/voice-demo),
 * the waveform animates for whoever is speaking, the transcript types out in
 * step with the audio, and the call card fills as the agent books an
 * appointment. At the end the caller asks something the agent should not
 * answer (insurance cover) and the call is handed to a person.
 *
 * The voices are AI text-to-speech performing a scripted, illustrative call.
 * Two fixed voices (agent: "Bella", caller: "Chris") generated with one model,
 * fixed seed, fixed voice settings and request stitching, then loudness-
 * normalised to -16 LUFS and trimmed so every clip sounds like the same call.
 * It is labelled "Demo call" and is not a recording of a live customer call.
 * TODO (owner): replace with audio from a real demo call of the actual
 * product once one exists.
 */

type Line = { from: "agent" | "caller" | "system"; text: string; audio?: string; ms: number };
const CALL: Line[] = [
  { from: "agent", text: "Good evening, Smile Studio Dental. This is the after-hours assistant. How can I help?", audio: "line-1-agent", ms: 4599 },
  { from: "caller", text: "Hi, I chipped a tooth at dinner. Can I get in this week?", audio: "line-2-caller", ms: 2668 },
  { from: "agent", text: "Sorry to hear that. Dr. Malik has Thursday at 10:30 or Friday at 4:15. Which works better?", audio: "line-3-agent", ms: 5922 },
  { from: "caller", text: "Thursday, please. It's Sam Ahmed.", audio: "line-4-caller", ms: 1573 },
  { from: "agent", text: "Booked: Thursday at 10:30 with Dr. Malik, for Sam Ahmed. I'll send a WhatsApp confirmation to this number.", audio: "line-5-agent", ms: 6585 },
  { from: "caller", text: "Great. Will the repair be covered by my insurance plan?", audio: "line-6-caller", ms: 2697 },
  { from: "agent", text: "That depends on your plan, and I don't want to guess. I'm transferring you to a member of the team now.", audio: "line-7-agent", ms: 4743 },
  { from: "system", text: "Transferred to front desk · call summary sent", ms: 1200 },
];

/** Fields on the call card, revealed after the given transcript line finishes. */
const CARD: { k: string; v: string; after: number }[] = [
  { k: "Caller", v: "Sam Ahmed", after: 3 },
  { k: "Reason", v: "Chipped tooth", after: 1 },
  { k: "Booked", v: "Thu 10:30 · Dr. Malik", after: 4 },
  { k: "Confirmation", v: "WhatsApp sent", after: 4 },
  { k: "Handoff", v: "Insurance question → front desk", after: 6 },
];

const BARS = 28;
const GAP = 450; // pause between turns, ms

/** Each line occupies [start, end) on one timeline measured in milliseconds. */
const TIMELINE = (() => {
  let t = 0;
  return CALL.map((l) => {
    const start = t;
    t += l.ms + (l.from === "system" ? 0 : GAP);
    return { start, end: start + l.ms };
  });
})();
const TOTAL = TIMELINE[TIMELINE.length - 1].end;
const lineAt = (p: number) => {
  let line = 0;
  TIMELINE.forEach((seg, i) => {
    if (p >= seg.start) line = i;
  });
  return line;
};


export function VoiceDemo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const raf = useRef<number | undefined>(undefined);
  const posRef = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const audios = useRef<(HTMLAudioElement | null)[]>([]);
  const current = useRef<number>(-1);

  const stopAudio = () => {
    audios.current.forEach((a) => a && !a.paused && a.pause());
    current.current = -1;
  };

  useEffect(() => {
    audios.current.forEach((a) => a && (a.muted = muted));
  }, [muted]);

  useEffect(() => {
    if (!playing) {
      stopAudio();
      return;
    }
    let last = 0;
    const tick = (t: number) => {
      const dt = last ? t - last : 0;
      last = t;
      let n = posRef.current + dt;
      const i = lineAt(n);
      const seg = TIMELINE[i];
      const a = audios.current[i];
      const inSpeech = n < seg.end;
      if (a && inSpeech) {
        if (current.current !== i) {
          stopAudio();
          current.current = i;
          a.currentTime = Math.max(0, (n - seg.start) / 1000);
          a.play().catch(() => setMuted(true)); // autoplay blocked: keep going silently
        } else if (!a.paused && !a.ended && !a.muted && a.currentTime > 0) {
          // Keep the transcript locked to the real audio clock.
          n = seg.start + a.currentTime * 1000;
        }
      }
      n = Math.min(TOTAL, n);
      posRef.current = n;
      setPos(n);
      if (n >= TOTAL) setPlaying(false);
      else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [playing]);

  useEffect(() => () => stopAudio(), []);

  // Index of the line currently being spoken (or the last one started).
  const line = lineAt(pos);
  const seg = TIMELINE[line];
  const chars = Math.min(CALL[line].text.length, Math.max(0, ((pos - seg.start) / CALL[line].ms) * CALL[line].text.length * 1.08));
  const finished = pos >= TOTAL;
  const started = pos > 0;
  const inSpeech = pos < seg.end;
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
    stopAudio();
    posRef.current = 0;
    setPos(0);
    setPlaying(false);
    requestAnimationFrame(() => setPlaying(true));
  };

  const shownLines = CALL.slice(0, line + 1);
  const elapsed = Math.floor(pos / 1000);
  const handoff = line >= 7;

  return (
    <div className={cn("@container theme-dark relative overflow-hidden rounded-[1.75rem] border border-rule shadow-[0_40px_80px_-40px_oklch(0.2_0.02_265/0.6)]", className)} data-od-id="voice-demo">
      {CALL.map((l, i) =>
        l.audio ? (
          <audio
            key={l.audio}
            ref={(el) => {
              audios.current[i] = el;
            }}
            src={`/audio/voice-demo/${l.audio}.mp3`}
            preload="none"
            hidden
          />
        ) : null,
      )}
      <div className="grid @3xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex min-w-0 flex-col">
          {/* Call bar */}
          <div className="border-b border-rule px-5 py-4">
            <div className="flex items-center gap-3">
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", handoff ? "bg-warm/15 text-warm" : "bg-voice/15 text-voice")}>
                {handoff ? <PhoneForwarded aria-hidden className="size-[1.125rem]" /> : <PhoneCall aria-hidden className="size-[1.125rem]" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-paper">Inbound call · Smile Studio Dental</p>
                <p className="ui-label mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-voice" aria-live="polite">
                  <span>{!started ? "Ready" : finished ? "Handed to a person" : speaking === "caller" ? "Caller speaking" : speaking === "agent" ? "AI agent speaking" : playing ? "On the line" : "Paused"}</span>
                  <span className="tabular-nums text-faint">0:{String(Math.min(elapsed, 59)).padStart(2, "0")}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-pressed={muted}
                aria-label={muted ? "Turn demo call sound on" : "Mute demo call"}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-rule text-paper transition-colors hover:bg-ink-3"
              >
                {muted ? <VolumeX aria-hidden className="size-4" /> : <Volume2 aria-hidden className="size-4" />}
              </button>
            </div>
            <div className="mt-3 pl-[3.25rem]">
              <DemoLabel>Demo call</DemoLabel>
            </div>
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
            <div aria-hidden className="flex h-12 min-w-0 flex-1 items-center justify-between gap-[3px] overflow-hidden">
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
                  Press play to hear how the agent handles an after-hours call, including the moment it hands off to a person. Sound on.
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
        <aside className="border-t border-rule bg-ink-2 p-5 @3xl:border-l @3xl:border-t-0" aria-label="What the agent logged">
          <div className="flex items-center justify-between">
            <span className="ui-label text-paper">Logged to your CRM</span>
            <span className={cn("ui-label", finished ? "text-accent" : "text-faint")}>{finished ? "Saved" : started ? "Connected" : "Waiting"}</span>
          </div>
          <dl className="mt-4 grid gap-3 @md:grid-cols-2 @3xl:grid-cols-1">
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
