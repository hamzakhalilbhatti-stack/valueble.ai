"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * OrderRise — the conversation and the ticket, playing out in real time.
 *
 * These are the same order. Showing both together is the entire pitch: the
 * customer types the way people actually type at eleven at night, and the
 * kitchen receives structured data.
 *
 * Animating it adds the one thing a static pairing cannot show — *when* the
 * ticket appears. It fills at the exact moment the agent confirms, so the
 * causal link between the conversation and the kitchen is something you watch
 * happen rather than something the caption has to assert.
 *
 * TODO: swap for a real thread from the live demo restaurant once Hamza sends
 * one — a genuine screenshot outperforms any reconstruction.
 */

type Msg = { from: "customer" | "agent"; text: string; time: string; at: number };

/** Timeline in ms from the moment the panel enters view. */
const THREAD: Msg[] = [
  { from: "customer", text: "hi do you still deliver to marina?", time: "23:04", at: 400 },
  {
    from: "agent",
    text: "Yes — we deliver to Dubai Marina until 01:00. Would you like tonight's menu?",
    time: "23:04",
    at: 1600,
  },
  {
    from: "customer",
    text: "yes pls. 2 pepperoni large and a garlic bread",
    time: "23:05",
    at: 3100,
  },
  {
    from: "agent",
    text: "2× Large Pepperoni  AED 96\n1× Garlic Bread  AED 18\n\nSubtotal AED 114. Anything to drink?",
    time: "23:05",
    at: 4500,
  },
  { from: "customer", text: "no thats it. marina gate 2 apt 1204", time: "23:06", at: 6100 },
  {
    from: "agent",
    text: "Order confirmed ✅\nMarina Gate 2, Apt 1204\nAED 114 · ~35 min\n\nWe'll message you when the driver leaves.",
    time: "23:06",
    at: 7500,
  },
];

/** The agent "types" for the beat before each of its replies. */
const TYPING_LEAD = 900;

const LINES = [
  { qty: 2, item: "Large Pepperoni" },
  { qty: 1, item: "Garlic Bread" },
];

const DETAILS: [string, string][] = [
  ["Type", "Delivery"],
  ["Address", "Marina Gate 2, Apt 1204"],
  ["Total", "AED 114"],
  ["Placed", "23:06"],
];

export function OrderRiseDemo({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [started, setStarted] = useState(false);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [ticket, setTicket] = useState(false);

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

    const timers: number[] = [];

    THREAD.forEach((msg, i) => {
      if (msg.from === "agent") {
        timers.push(window.setTimeout(() => setTyping(true), msg.at - TYPING_LEAD));
      }
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, msg.at),
      );
    });

    // The ticket lands with the confirmation, not before it.
    timers.push(window.setTimeout(() => setTicket(true), THREAD[THREAD.length - 1].at + 250));

    return () => timers.forEach(clearTimeout);
  }, [started, reduced]);

  // Reduced motion sees the finished exchange, derived rather than written by
  // an effect — the content is the point, the performance is not.
  const view = reduced
    ? { shown: THREAD.length, typing: false, ticket: true }
    : { shown, typing, ticket };

  return (
    <div ref={host} className={cn("grid gap-3 lg:grid-cols-[1fr_20rem]", className)}>
      {/* ── What the customer sees ── */}
      <div className="panel flex flex-col">
        <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <span className="grid size-7 place-items-center rounded-full bg-warm/15 text-[10px] text-warm">
            BN
          </span>
          <div>
            <p className="text-xs text-paper">Bella Napoli</p>
            <p className="ui-label mt-1 text-warm">
              {view.typing ? "Typing…" : "Answering · 23:06"}
            </p>
          </div>
          <span className="ui-label ml-auto text-faint">WhatsApp</span>
        </div>

        {/*
          Fixed minimum height. Without it the panel grows message by message
          and drags the whole page down as it plays, which is far more
          distracting than the animation is persuasive.
        */}
        <div className="flex-1 space-y-2 p-4 lg:min-h-[26rem]">
          {THREAD.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex transition-opacity duration-500",
                m.from === "customer" ? "justify-start" : "justify-end",
                i < view.shown ? "opacity-100" : "opacity-0",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-line px-3 py-2 text-xs leading-relaxed",
                  m.from === "customer" ? "bg-white/[0.04] text-mute" : "bg-warm/[0.12] text-paper",
                )}
              >
                {m.text}
                <span className="ui-label mt-2 block text-faint">{m.time}</span>
              </div>
            </div>
          ))}

          {view.typing && (
            <div className="flex justify-end">
              <span className="flex gap-1 bg-warm/[0.12] px-3 py-3" aria-label="Typing">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="size-1 animate-pulse rounded-full bg-warm"
                    style={{ animationDelay: `${d * 160}ms` }}
                  />
                ))}
              </span>
            </div>
          )}
        </div>
      </div>

      {/*
        ── What the kitchen sees ──

        Sticky, because the thread is taller than the ticket and the entire
        argument is seeing both at once. Without this the ticket scrolls away
        while the conversation is still running, and the pairing — which is the
        whole point — is never actually on screen together.
      */}
      <div className="panel h-fit lg:sticky lg:top-28">
        <div className="flex items-center justify-between border-b border-rule px-4 py-3">
          <span className="ui-label text-paper">Kitchen display</span>
          <span className={cn("ui-label", view.ticket ? "text-warm" : "text-faint")}>
            {view.ticket ? "New · #1047" : "Waiting"}
          </span>
        </div>

        <div
          className={cn(
            "space-y-4 p-4 transition-opacity duration-500",
            view.ticket ? "opacity-100" : "opacity-25",
          )}
        >
          <ul className="space-y-2">
            {LINES.map((line) => (
              <li key={line.item} className="flex gap-3 text-sm">
                <span className="tabular-nums text-warm">{view.ticket ? `${line.qty}×` : "—"}</span>
                <span className="text-paper">{view.ticket ? line.item : " "}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 border-t border-rule pt-3">
            {DETAILS.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 text-xs">
                <dt className="ui-label text-faint">{k}</dt>
                <dd className="text-right text-mute">{view.ticket ? v : "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
