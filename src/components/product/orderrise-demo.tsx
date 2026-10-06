"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, ChevronLeft, MoreVertical, Phone, Play, RotateCcw, Video } from "lucide-react";
import { DemoLabel } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * OrderRise — a clickable WhatsApp chat.
 *
 * The visitor plays the customer: they tap one of the suggested replies and the
 * assistant answers in real time (typing indicator, then the message). The
 * flow is the one the product actually runs: delivery check → menu → order →
 * total → address → confirmation. Totals are calculated from the demo menu,
 * not hard-coded. "Play it for me" walks the same flow on its own.
 *
 * Demo data only: the restaurant, menu and prices are illustrative.
 * TODO (owner): swap in your live demo restaurant's real menu if you want the
 * numbers to match what visitors will see when they message it.
 */

type Item = { id: string; name: string; price: number };
const MENU: Item[] = [
  { id: "marg", name: "Margherita (L)", price: 42 },
  { id: "pep", name: "Pepperoni (L)", price: 48 },
  { id: "garlic", name: "Garlic Bread", price: 18 },
  { id: "drink", name: "Soft Drink", price: 8 },
];
const price = (id: string) => MENU.find((m) => m.id === id)!.price;

type Order = { label: string; lines: { id: string; qty: number }[] };
const ORDERS: Order[] = [
  { label: "2 large pepperoni and a garlic bread", lines: [{ id: "pep", qty: 2 }, { id: "garlic", qty: 1 }] },
  { label: "1 margherita and 2 cokes", lines: [{ id: "marg", qty: 1 }, { id: "drink", qty: 2 }] },
];

type Msg = { from: "me" | "bot" | "system"; text: string; time: string };
type Stage = "start" | "order" | "address" | "done";
type Choice = { label: string; kind: "start" | "order" | "address"; arg?: number | string | null };

const STEPS = ["Delivery check", "Order taken", "Total calculated", "Address captured", "Order confirmed"];

function money(n: number) {
  return `AED ${n}`;
}
function clock(i: number) {
  const m = 4 + Math.floor(i / 2);
  return `23:${String(m).padStart(2, "0")}`;
}

export function OrderRiseDemo({ className }: { className?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [stage, setStage] = useState<Stage>("start");
  const [typing, setTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [auto, setAuto] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // Keep the newest message in view without moving the page (no scrollIntoView).
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const push = (m: Omit<Msg, "time">) => setMsgs((prev) => [...prev, { ...m, time: clock(prev.length) }]);

  /** Customer sends, assistant types for a beat, then replies. */
  const exchange = (mine: string, replies: string[], after: () => void) => {
    push({ from: "me", text: mine });
    let t = 450;
    replies.forEach((r, i) => {
      later(() => setTyping(true), t);
      t += 900 + Math.min(r.length * 6, 700);
      later(() => {
        setTyping(false);
        push({ from: "bot", text: r });
        if (i === replies.length - 1) after();
      }, t);
      t += 250;
    });
  };

  const total = (o: Order) => o.lines.reduce((s, l) => s + price(l.id) * l.qty, 0);
  const itemised = (o: Order) =>
    o.lines.map((l) => `${l.qty}× ${MENU.find((m) => m.id === l.id)!.name}  ${money(price(l.id) * l.qty)}`).join("\n");

  const start = () =>
    exchange(
      "hi do you still deliver to marina?",
      [
        "Hi! Yes, we deliver to Dubai Marina until 01:00 tonight. 🍕",
        `Tonight's menu:\n${MENU.map((m) => `• ${m.name} — ${money(m.price)}`).join("\n")}\n\nWhat can I get you?`,
      ],
      () => {
        setProgress(1);
        setStage("order");
      },
    );

  const pickOrder = (o: Order) => {
    setOrder(o);
    exchange(o.label, [`${itemised(o)}\n\nSubtotal ${money(total(o))}. Delivery or pickup? For delivery, send the address.`], () => {
      setProgress(3);
      setStage("address");
    });
  };

  const pickAddress = (addr: string | null) => {
    const o = order!;
    exchange(
      addr ?? "pickup please",
      [
        addr
          ? `Order confirmed ✅\n${itemised(o)}\nTotal ${money(total(o))}\nDeliver to: ${addr}\nArriving in about 35 min.\n\nI'll message you when the driver leaves.`
          : `Order confirmed ✅\n${itemised(o)}\nTotal ${money(total(o))}\nPickup in about 20 min.\n\nI'll message you when it's ready.`,
      ],
      () => {
        setProgress(5);
        setStage("done");
        later(() => push({ from: "system", text: "Order #1047 sent to the restaurant dashboard" }), 500);
      },
    );
    setProgress(4);
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMsgs([]);
    setStage("start");
    setTyping(false);
    setProgress(0);
    setOrder(null);
    setAuto(false);
  };

  // "Play it for me": answer each stage with the first choice.
  useEffect(() => {
    if (!auto || typing) return;
    const id = window.setTimeout(() => {
      if (stage === "start" && msgs.length === 0) start();
      else if (stage === "order") pickOrder(ORDERS[0]);
      else if (stage === "address") pickAddress("Marina Gate 2, Apt 1204");
    }, 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, stage, typing, msgs.length]);

  const busy = typing || (msgs.length > 0 && msgs[msgs.length - 1].from === "me");
  let choices: Choice[] = [];
  if (stage === "start" && msgs.length === 0) choices = [{ label: "hi do you still deliver to marina?", kind: "start" }];
  if (stage === "order") choices = ORDERS.map((o, i) => ({ label: o.label, kind: "order" as const, arg: i }));
  if (stage === "address")
    choices = [
      { label: "Marina Gate 2, Apt 1204", kind: "address", arg: "Marina Gate 2, Apt 1204" },
      { label: "pickup please", kind: "address", arg: null },
    ];
  const act = (c: Choice) => {
    if (c.kind === "start") start();
    else if (c.kind === "order") pickOrder(ORDERS[c.arg as number]);
    else pickAddress(c.arg as string | null);
  };

  return (
    <div className={cn("grid items-center gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-14", className)} data-od-id="orderrise-demo">
      {/* Phone */}
      <div className="theme-dark mx-auto w-full max-w-[22rem] rounded-[2.5rem] border border-rule-strong bg-ink p-2.5 shadow-[0_40px_80px_-30px_oklch(0.2_0.02_265/0.55)]">
        <div className="overflow-hidden rounded-[2rem] bg-[oklch(0.945_0.014_85)]">
          {/* WhatsApp header */}
          <div className="flex items-center gap-2 bg-[oklch(0.42_0.08_170)] px-3 pb-2.5 pt-4 text-white">
            <ChevronLeft aria-hidden className="size-5 opacity-90" />
            <span aria-hidden className="grid size-9 place-items-center rounded-full bg-white/90 text-sm font-semibold text-[oklch(0.42_0.08_170)]">
              BN
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold">Bella Napoli</p>
              <p className="text-[0.6875rem] opacity-90" aria-live="polite">
                {typing ? "typing…" : "online"}
              </p>
            </div>
            <Video aria-hidden className="size-[1.125rem] opacity-90" />
            <Phone aria-hidden className="size-4 opacity-90" />
            <MoreVertical aria-hidden className="size-4 opacity-90" />
          </div>

          {/* Messages */}
          <div
            ref={scroller}
            className="wa-surface h-[24rem] space-y-1.5 overflow-y-auto overscroll-contain px-3 py-3"
            role="log"
            aria-label="Demo WhatsApp conversation"
            aria-live="polite"
          >
            <p className="mx-auto w-fit rounded-md bg-white/80 px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-[oklch(0.4_0.02_85)]">
              Today
            </p>
            {msgs.length === 0 && (
              <p className="mx-auto mt-24 max-w-[15rem] rounded-lg bg-[oklch(0.93_0.06_95)] px-3 py-2 text-center text-xs leading-relaxed text-[oklch(0.33_0.03_85)]">
                You are the customer. Tap the message below to start the order.
              </p>
            )}
            {msgs.map((m, i) =>
              m.from === "system" ? (
                <p key={i} className="msg-in mx-auto flex w-fit items-center gap-1.5 rounded-md bg-[oklch(0.9_0.07_165)] px-2.5 py-1 text-[0.6875rem] font-medium text-[oklch(0.3_0.06_165)]">
                  <Check aria-hidden className="size-3" /> {m.text}
                </p>
              ) : (
                <div key={i} className={cn("msg-in flex", m.from === "me" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-line rounded-lg px-2.5 pb-1 pt-1.5 text-[0.8125rem] leading-snug text-[oklch(0.22_0.02_150)] shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]",
                      m.from === "me" ? "rounded-tr-none bg-[oklch(0.93_0.08_140)]" : "rounded-tl-none bg-white",
                    )}
                  >
                    {m.text}
                    <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 float-right pt-1 text-[0.625rem] text-[oklch(0.5_0.02_150)]">
                      {m.time}
                      {m.from === "me" && <CheckCheck aria-hidden className="size-3 text-[oklch(0.6_0.13_235)]" />}
                    </span>
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="msg-in flex justify-start">
                <span className="flex gap-1 rounded-lg rounded-tl-none bg-white px-3 py-3 shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]" aria-label="Assistant is typing">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="typing-dot size-1.5 rounded-full bg-[oklch(0.55_0.02_150)]" style={{ animationDelay: `${d * 150}ms` }} />
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Reply chips: the visitor's side of the chat */}
          <div className="min-h-[7.5rem] border-t border-black/5 bg-[oklch(0.965_0.006_85)] p-2.5">
            <p className="mb-1.5 px-1 text-[0.6875rem] font-medium text-[oklch(0.42_0.02_85)]">
              {stage === "done" ? "Order placed." : busy ? "Waiting for the assistant…" : "Tap to reply as the customer"}
            </p>
            <div className="flex flex-col gap-1.5">
              {choices.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  disabled={busy || auto}
                  onClick={() => act(c)}
                  className="min-h-11 rounded-full border border-[oklch(0.42_0.08_170/0.35)] bg-white px-3.5 text-left text-[0.8125rem] text-[oklch(0.3_0.06_170)] transition-[background-color,transform] hover:bg-[oklch(0.95_0.03_165)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-[oklch(0.42_0.08_170)]"
                >
                  {c.label}
                </button>
              ))}
              {stage === "done" && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[oklch(0.42_0.08_170)] px-4 text-sm font-medium text-white transition-colors hover:bg-[oklch(0.36_0.07_170)]"
                >
                  <RotateCcw aria-hidden className="size-4" /> Start a new order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What is happening */}
      <div>
        <DemoLabel />
        <h3 className="mt-5 text-title md:text-[1.5rem]">Order a pizza from the assistant.</h3>
        <p className="mt-3 max-w-[46ch] text-mute">
          You are the customer. Tap a reply and watch the assistant check delivery, take the order, add it up, get the
          address and confirm. This is the flow OrderRise runs on a restaurant&apos;s real WhatsApp number.
        </p>
        <ol className="mt-7 grid gap-2.5" aria-label="Order progress">
          {STEPS.map((s, i) => {
            const done = i < progress;
            const current = i === progress && stage !== "done" && msgs.length > 0;
            return (
              <li key={s} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-[background-color,border-color,color] duration-300",
                    done ? "border-wa bg-wa text-white" : current ? "border-wa text-wa" : "border-rule-strong text-faint",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className={cn("text-[0.9375rem] transition-colors", done ? "text-paper" : "text-mute")}>
                  {s}
                  <span className="sr-only">{done ? " (done)" : ""}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              later(() => setAuto(true), 50);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rule-strong bg-ink-2 px-5 text-sm font-medium text-paper shadow-[var(--shadow-card)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-ink-3"
          >
            <Play aria-hidden className="size-4" /> Play it for me
          </button>
          {msgs.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-paper underline-offset-4 hover:underline"
            >
              <RotateCcw aria-hidden className="size-4" /> Restart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
