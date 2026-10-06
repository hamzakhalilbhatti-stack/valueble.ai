"use client";

import { useEffect, useRef, useState } from "react";
import { Brain, Check, Inbox, Play, RotateCcw, ShieldCheck, UserRound, Wrench, X, Zap } from "lucide-react";
import { DemoLabel } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * Custom AI Agents — the 5-step flow, made interactive.
 *
 * Every build is different, so there is no product screen to show. What is
 * constant is the shape: Trigger → Understand → Act → Checkpoint (human) →
 * Deliver. The visitor picks an example process and runs it. At the checkpoint
 * the run stops and waits for *them* to approve or reject, which is exactly
 * what the system does with anything ambiguous or expensive.
 *
 * Example scenarios are illustrative, not client work.
 */

const STEPS = [
  { key: "Trigger", Icon: Zap, body: "A WhatsApp message, a form submission, a new row, a scheduled time." },
  { key: "Understand", Icon: Brain, body: "Read the request in whatever language and format it actually arrived in." },
  { key: "Act", Icon: Wrench, body: "Look things up, write records, call the tools you already pay for." },
  { key: "Checkpoint", Icon: UserRound, body: "Anything ambiguous or expensive stops here and waits for a person." },
  { key: "Deliver", Icon: Inbox, body: "Into your CRM, your sheet, your inbox — wherever the work already lives." },
] as const;

type Scenario = { id: string; label: string; log: string[]; ask: string; approved: string; rejected: string };
const SCENARIOS: Scenario[] = [
  {
    id: "leads",
    label: "Qualify an inbound lead",
    log: [
      "New web form: “Need 40 staff trained on the CRM by March, budget ~$6k”",
      "Intent: training project · size 40 seats · deadline March · budget stated",
      "Looked up the company, matched to the ‘Mid-size’ tier, drafted a reply with two call slots",
    ],
    ask: "Quote above $5,000. Send the drafted reply?",
    approved: "Reply sent, lead added to CRM as ‘Qualified’, call slots held",
    rejected: "Held in your inbox with the draft attached, nothing sent",
  },
  {
    id: "support",
    label: "Answer a support message",
    log: [
      "WhatsApp: “my order 8812 never came and I want my money back”",
      "Intent: missing delivery + refund request · order #8812 · tone: upset",
      "Checked order #8812: shipped, tracking stalled 6 days. Drafted an apology and refund",
    ],
    ask: "Refund of $64. Approve?",
    approved: "Refund issued, customer told on WhatsApp, ticket closed in the helpdesk",
    rejected: "Escalated to you with the full thread, customer told someone will reply today",
  },
  {
    id: "data",
    label: "Move invoices into a sheet",
    log: [
      "New email with 3 PDF invoices attached",
      "Read supplier, date, amount and VAT from each PDF",
      "Two matched existing suppliers. One supplier name is new",
    ],
    ask: "New supplier “Kestrel Packaging”. Add it?",
    approved: "3 rows written to the accounts sheet, new supplier created",
    rejected: "2 rows written, the unknown one flagged in the sheet for you",
  },
];

export function AgentDemo({ className }: { className?: string }) {
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const [step, setStep] = useState(-1); // -1 idle, 0..4 active, 5 done
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const sc = SCENARIOS.find((s) => s.id === sid)!;

  useEffect(() => () => clearTimeout(timer.current), []);

  // Auto-advance through Trigger → Understand → Act; stop at Checkpoint.
  useEffect(() => {
    clearTimeout(timer.current);
    if (step >= 0 && step < 3) timer.current = window.setTimeout(() => setStep((s) => s + 1), 1300);
    if (step === 4) timer.current = window.setTimeout(() => setStep(5), 1100);
  }, [step]);

  const run = () => {
    setDecision(null);
    setStep(0);
  };
  const decide = (d: "approved" | "rejected") => {
    setDecision(d);
    setStep(4);
  };
  const choose = (id: string) => {
    clearTimeout(timer.current);
    setSid(id);
    setStep(-1);
    setDecision(null);
  };

  const waiting = step === 3;

  return (
    <div className={cn("panel p-5 md:p-7", className)} data-od-id="agent-demo">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Example process" className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              role="tab"
              type="button"
              aria-selected={s.id === sid}
              onClick={() => choose(s.id)}
              className="min-h-11 rounded-full border border-rule-strong px-4 text-sm text-mute transition-colors hover:bg-ink-3 hover:text-paper aria-selected:border-mind aria-selected:bg-mind/10 aria-selected:font-medium aria-selected:text-paper"
            >
              {s.label}
            </button>
          ))}
        </div>
        <DemoLabel>Interactive demo · example process</DemoLabel>
      </div>

      {/* Flow */}
      <ol className="mt-7 grid gap-3 md:grid-cols-5" aria-label="Agent flow">
        {STEPS.map(({ key, Icon, body }, i) => {
          const human = key === "Checkpoint";
          const active = step === i;
          const done = step > i;
          return (
            <li
              key={key}
              className={cn(
                "relative rounded-2xl border p-4 transition-[border-color,background-color,transform,box-shadow] duration-500",
                active && human && "-translate-y-1 border-mind bg-mind/10 shadow-[var(--shadow-lift)]",
                active && !human && "-translate-y-1 border-paper/30 bg-ink-3 shadow-[var(--shadow-lift)]",
                done && "border-rule bg-ink-2",
                !active && !done && "border-rule bg-ink-2 opacity-75",
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 place-items-center rounded-xl transition-colors duration-500",
                    done ? "bg-accent text-on-accent" : human ? "bg-mind/12 text-mind" : "bg-ink-3 text-paper",
                  )}
                >
                  {done ? <Check className="size-4" /> : <Icon className="size-4" />}
                </span>
                <span className="ui-label text-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-3 text-[1.0625rem] font-semibold">
                {key}
                {human && <span className="ml-1.5 text-sm font-normal text-mind">(human)</span>}
              </h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-mute">{body}</p>
            </li>
          );
        })}
      </ol>

      {/* Run log */}
      <div className="mt-5 rounded-2xl border border-rule bg-ink-3/60 p-4 md:p-5" aria-live="polite">
        {step < 0 ? (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-mute">Pick a process above and run it. The agent will stop and ask you at the checkpoint.</p>
            <button
              type="button"
              onClick={run}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-paper/90"
            >
              <Play aria-hidden className="size-4" /> Run the agent
            </button>
          </div>
        ) : (
          <ul className="space-y-2 font-mono text-[0.8125rem] leading-relaxed">
            {sc.log.slice(0, Math.min(step + 1, 3)).map((l, i) => (
              <li key={i} className="msg-in flex gap-2.5 text-paper">
                <span className="text-faint">{STEPS[i].key.toLowerCase().padEnd(10, " ")}</span>
                <span>{l}</span>
              </li>
            ))}
            {step >= 3 && (
              <li className="msg-in">
                <div className="mt-2 rounded-xl border border-mind/40 bg-ink-2 p-3.5 font-sans">
                  <p className="flex items-center gap-2 text-sm font-medium text-paper">
                    <ShieldCheck aria-hidden className="size-4 text-mind" /> {sc.ask}
                  </p>
                  {waiting ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => decide("approved")} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-mind px-4 text-sm font-medium text-white transition-[transform,opacity] hover:-translate-y-0.5 hover:opacity-90">
                        <Check aria-hidden className="size-4" /> Approve
                      </button>
                      <button type="button" onClick={() => decide("rejected")} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-rule-strong bg-ink-2 px-4 text-sm font-medium text-paper hover:bg-ink-3">
                        <X aria-hidden className="size-4" /> Reject
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1.5 text-sm text-mute">You {decision === "approved" ? "approved" : "rejected"} it.</p>
                  )}
                </div>
              </li>
            )}
            {step >= 5 && decision && (
              <li className="msg-in flex gap-2.5 text-paper">
                <span className="text-faint">{"deliver".padEnd(10, " ")}</span>
                <span>{sc[decision]}</span>
              </li>
            )}
            {step >= 5 && (
              <li className="pt-2 font-sans">
                <button type="button" onClick={run} className="inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-medium text-paper underline-offset-4 hover:underline">
                  <RotateCcw aria-hidden className="size-4" /> Run it again
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
