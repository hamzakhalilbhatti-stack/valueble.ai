"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Custom AI Agents — a build, drawn as what it actually is.
 *
 * The other two products can show a screen. This one cannot: every build is
 * different, so a screenshot would be a lie about what you are buying. What is
 * consistent is the shape of the work — a trigger, a chain of steps, a human
 * checkpoint where one is warranted, and a destination in a tool you already
 * own. So that is what is drawn.
 *
 * It runs rather than sits there, because the thing being sold is a *process*
 * and a process is a sequence. The connector draws downward and each stage
 * lights as it is reached.
 *
 * The pause at the checkpoint is the point of the whole diagram. The line stops
 * there and waits, visibly longer than anywhere else, because that is exactly
 * what the system does — anything ambiguous or expensive halts for a person.
 * Being told which parts should stay manual is the part of this service worth
 * paying for, so it gets the one beat of silence in the sequence.
 */

type Node = {
  step: string;
  body: string;
  tone: "step" | "human";
};

const FLOW: Node[] = [
  {
    step: "Trigger",
    body: "A WhatsApp message, a form submission, a new row, a scheduled time.",
    tone: "step",
  },
  {
    step: "Understand",
    body: "Read the request in whatever language and format it actually arrived in.",
    tone: "step",
  },
  {
    step: "Act",
    body: "Look things up, write records, call the tools you already pay for.",
    tone: "step",
  },
  {
    step: "Checkpoint",
    body: "Anything ambiguous or expensive stops here and waits for a person.",
    tone: "human",
  },
  {
    step: "Deliver",
    body: "Into your CRM, your sheet, your inbox — wherever the work already lives.",
    tone: "step",
  },
];

/** How long the connector takes to travel from one stage to the next. */
const TRAVEL = 850;
/** The extra silence after the human checkpoint. */
const HUMAN_PAUSE = 1100;

/** Absolute time, in ms, at which each stage lights up. */
const ARRIVALS = FLOW.reduce<number[]>((acc, node, i) => {
  if (i === 0) return [400];
  const previous = FLOW[i - 1];
  const wait = previous.tone === "human" ? TRAVEL + HUMAN_PAUSE : TRAVEL;
  return [...acc, acc[i - 1] + wait];
}, []);

export function AgentDemo({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [reached, setReached] = useState(0);

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

  /*
   * `reached` is deliberately not a dependency here. Depending on it would
   * re-run this effect on every tick, and the cleanup would clear the timers
   * for every stage that had not fired yet — the sequence would stop dead
   * after the first one.
   */
  useEffect(() => {
    if (!started || reduced) return;
    const timers = ARRIVALS.map((at, i) =>
      window.setTimeout(() => setReached(i + 1), at),
    );
    return () => timers.forEach(clearTimeout);
  }, [started, reduced]);

  // Reduced motion sees the finished diagram, derived rather than written by an
  // effect — the sequence is information, and it is all still there statically.
  const done = reduced ? FLOW.length : reached;

  return (
    <div ref={host} className={cn("panel", className)}>
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <span className="ui-label text-paper">One process, automated</span>
        <span className="ui-label text-faint">Built to your workflow</span>
      </div>

      <ol className="p-4 sm:p-6">
        {FLOW.map((node, i) => {
          const active = i < done;
          const isLast = i === FLOW.length - 1;
          // The segment below a stage fills once the *next* stage is reached.
          const filled = i + 1 < done;
          const waiting = node.tone === "human" && active && !filled;

          return (
            <li key={node.step} className="relative flex gap-4 pb-7 last:pb-0">
              {!isLast && (
                /*
                 * The connector track. Everything below is positioned against
                 * this wrapper rather than the row, so the travelling head can
                 * use a percentage offset — a percentage resolves against the
                 * containing block's height, which is exactly the distance it
                 * needs to cover. Sizing it off the row instead was the bug in
                 * the first pass: `translateY(100%)` moves an element by its
                 * *own* height, so the head shifted ten pixels and stopped.
                 */
                <span
                  aria-hidden
                  className="absolute left-[0.4375rem] top-5 h-[calc(100%-1.25rem)] w-0.5"
                >
                  {/* Unlit track, so the shape of the whole flow is visible
                      before the sequence has run through it. */}
                  <span className="absolute inset-0 bg-rule-strong" />

                  {/* The line itself. Scaled rather than resized so it animates
                      on the compositor and never triggers layout. */}
                  <span
                    className={cn(
                      "absolute inset-0 origin-top",
                      node.tone === "human" ? "bg-mind" : "bg-paper",
                    )}
                    style={{
                      transform: `scaleY(${filled ? 1 : 0})`,
                      transition: `transform ${TRAVEL}ms linear`,
                    }}
                  />

                  {/*
                    A bright head riding the leading edge. The fill alone was
                    far too quiet to register as motion — a hairline lengthening
                    against a dark panel is not something the eye catches. A
                    moving point of light is.
                  */}
                  <span
                    className={cn(
                      "absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                      node.tone === "human" ? "bg-mind" : "bg-paper",
                      active && !filled ? "opacity-100" : "opacity-0",
                    )}
                    style={{
                      top: filled ? "100%" : "0%",
                      transition: `top ${TRAVEL}ms linear, opacity 220ms linear`,
                      boxShadow: `0 0 14px 3px ${node.tone === "human" ? "#9b8cff" : "#f4f4f6"}`,
                    }}
                  />
                </span>
              )}

              <span
                aria-hidden
                className={cn(
                  "relative mt-1 size-4 shrink-0 rounded-full border-2 transition-all duration-500",
                  active
                    ? node.tone === "human"
                      ? "scale-110 border-mind bg-mind"
                      : "scale-110 border-paper bg-paper"
                    : "scale-90 border-rule-strong bg-ink",
                )}
              >
                {/* Only while the flow is actually held at the checkpoint. */}
                {waiting && (
                  <span className="absolute -inset-2 animate-ping rounded-full border-2 border-mind" />
                )}
              </span>

              <div
                className={cn(
                  "min-w-0 transition-all duration-500",
                  active ? "translate-x-0 opacity-100" : "translate-x-1 opacity-25",
                )}
              >
                <p className={cn("ui-label", node.tone === "human" ? "text-mind" : "text-paper")}>
                  {node.step}
                  {node.tone === "human" && " · human"}
                </p>
                <p className="mt-2 max-w-[46ch] text-sm text-mute">{node.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
