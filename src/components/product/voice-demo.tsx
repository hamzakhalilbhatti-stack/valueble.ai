"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneCall } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * AI Voice Agent — a call transcript playing out, in the same visual language
 * as the OrderRise WhatsApp demo. The waveform is live while a side is
 * speaking; the outcome card fills when the booking is confirmed.
 *
 * This is an illustrative call, labelled as such in the UI.
 * TODO (owner): replace with a transcript from a real demo call, and attach
 * the recording itself once one exists.
 */

type Line = { from: "caller" | "agent"; text: string; at: number };

const CALL: Line[] = [
  { from: "agent", text: "Good evening, Smile Studio Dental. How can I help?", at: 500 },
  { from: "caller", text: "Hi, I chipped a tooth. Can I get in this week?", at: 2300 },
  {
    from: "agent",
    text: "Sorry to hear that. Dr. Malik has Thursday at 10:30 or Friday at 4:15. Which works better?",
    at: 4100,
  },
  { from: "caller", text: "Thursday please. It's Sara Ahmed.", at: 6300 },
  {
    from: "agent",
    text: "Booked: Thursday 10:30 with Dr. Malik. I'll send a WhatsApp confirmation to this number now.",
    at: 7900,
  },
];

const WAVE = [0.4, 0.75, 0.55, 1, 0.65, 0.85, 0.45, 0.95, 0.6, 0.8, 0.5, 0.9, 0.55, 0.7, 0.4, 0.85, 0.6, 1, 0.5, 0.75];

export function Waveform({
  active = true,
  className,
  bars = WAVE,
  tone = "voice",
}: {
  active?: boolean;
  className?: string;
  bars?: number[];
  tone?: "voice" | "accent";
}) {
  return (
    <div aria-hidden className={cn("flex h-10 items-center gap-[3px]", className)}>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-full",
            tone === "voice" ? "bg-voice" : "bg-accent",
            active ? "wave-bar" : "opacity-50",
          )}
          style={{
            height: `${h * 100}%`,
            animationDelay: `${(i % 7) * -0.13}s`,
            transform: active ? undefined : "scaleY(0.6)",
          }}
        />
      ))}
    </div>
  );
}

export function VoiceDemo({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

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
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduced) return;
    const timers = CALL.map((l, i) => window.setTimeout(() => setShown(i + 1), l.at));
    timers.push(window.setTimeout(() => setDone(true), CALL[CALL.length - 1].at + 600));
    return () => timers.forEach(clearTimeout);
  }, [started, reduced]);

  const view = reduced ? { shown: CALL.length, done: true } : { shown, done };
  const speaking = view.shown > 0 && !view.done ? CALL[view.shown - 1].from : null;

  return (
    <div ref={host} className={cn("grid gap-3 lg:grid-cols-[1fr_17rem]", className)}>
      <div className="panel flex flex-col">
        <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <span className="grid size-8 place-items-center rounded-full bg-voice/15 text-voice">
            <PhoneCall aria-hidden className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs text-paper">Inbound call · +92 3•• ••• 4471</p>
            <p className="ui-label mt-1 text-voice">
              {view.done ? "Call ended · 0:58" : speaking === "caller" ? "Caller speaking" : "Agent speaking"}
            </p>
          </div>
          <span className="ui-label ml-auto shrink-0 text-faint">21:42</span>
        </div>

        <div className="flex items-center gap-4 border-b border-rule bg-voice/[0.04] px-4 py-3">
          <Waveform active={!view.done && view.shown > 0} className="h-8 flex-1" />
          <span className="ui-label shrink-0 text-faint">Illustrative call</span>
        </div>

        <div className="flex-1 space-y-2 p-4 lg:min-h-[21rem]">
          {CALL.map((l, i) => (
            <div
              key={i}
              className={cn(
                "flex transition-opacity duration-500",
                l.from === "caller" ? "justify-start" : "justify-end",
                i < view.shown ? "opacity-100" : "opacity-0",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                  l.from === "caller"
                    ? "rounded-tl-sm bg-white/[0.05] text-mute"
                    : "rounded-tr-sm bg-voice/[0.12] text-paper",
                )}
              >
                <span className="ui-label mb-1.5 block text-faint">
                  {l.from === "caller" ? "Caller" : "Voice agent"}
                </span>
                {l.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel h-fit">
        <div className="flex items-center justify-between border-b border-rule px-4 py-3">
          <span className="ui-label text-paper">Logged to CRM</span>
          <span className={cn("ui-label", view.done ? "text-voice" : "text-faint")}>
            {view.done ? "New booking" : "Listening"}
          </span>
        </div>
        <dl className={cn("space-y-2.5 p-4 transition-opacity duration-500", view.done ? "opacity-100" : "opacity-30")}>
          {[
            ["Caller", "Sara Ahmed"],
            ["Reason", "Chipped tooth"],
            ["Booked", "Thu 10:30"],
            ["With", "Dr. Malik"],
            ["Confirmation", "WhatsApp sent"],
            ["Handoff", "Not needed"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 text-xs">
              <dt className="ui-label text-faint">{k}</dt>
              <dd className="text-right text-mute">{view.done ? v : "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
