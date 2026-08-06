import { cn } from "@/lib/cn";

/**
 * OrderRise — the conversation and the ticket, side by side.
 *
 * These are the same order. Showing both together is the entire pitch: the
 * customer types the way people actually type at eleven at night, and the
 * kitchen receives structured data. Nothing about that needs explaining, which
 * is why this replaces a paragraph rather than illustrating one.
 *
 * TODO: swap for a real thread from the live demo restaurant once Hamza sends
 * one — a genuine screenshot outperforms any reconstruction.
 */

type Msg = { from: "customer" | "agent"; text: string; time: string };

const THREAD: Msg[] = [
  { from: "customer", text: "hi do you still deliver to marina?", time: "23:04" },
  {
    from: "agent",
    text: "Yes — we deliver to Dubai Marina until 01:00. Would you like tonight's menu?",
    time: "23:04",
  },
  { from: "customer", text: "yes pls. 2 pepperoni large and a garlic bread", time: "23:05" },
  {
    from: "agent",
    text: "2× Large Pepperoni  AED 96\n1× Garlic Bread  AED 18\n\nSubtotal AED 114. Anything to drink?",
    time: "23:05",
  },
  { from: "customer", text: "no thats it. marina gate 2 apt 1204", time: "23:06" },
  {
    from: "agent",
    text: "Order confirmed ✅\nMarina Gate 2, Apt 1204\nAED 114 · ~35 min\n\nWe'll message you when the driver leaves.",
    time: "23:06",
  },
];

export function OrderRiseDemo({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 lg:grid-cols-[1fr_20rem]", className)}>
      {/* ── What the customer sees ── */}
      <div className="panel flex flex-col">
        <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <span className="grid size-7 place-items-center rounded-full bg-warm/15 text-[10px] text-warm">
            BN
          </span>
          <div>
            <p className="text-xs text-paper">Bella Napoli</p>
            <p className="ui-label mt-1 text-warm">Answering · 23:06</p>
          </div>
          <span className="ui-label ml-auto text-faint">WhatsApp</span>
        </div>

        <div className="flex-1 space-y-2 p-4">
          {THREAD.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.from === "customer" ? "justify-start" : "justify-end")}
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
          <span className="ui-label text-warm">New · #1047</span>
        </div>

        <div className="space-y-4 p-4">
          <ul className="space-y-2">
            {[
              { qty: 2, item: "Large Pepperoni" },
              { qty: 1, item: "Garlic Bread" },
            ].map((line) => (
              <li key={line.item} className="flex gap-3 text-sm">
                <span className="tabular-nums text-warm">{line.qty}×</span>
                <span className="text-paper">{line.item}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 border-t border-rule pt-3">
            {[
              ["Type", "Delivery"],
              ["Address", "Marina Gate 2, Apt 1204"],
              ["Total", "AED 114"],
              ["Placed", "23:06"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 text-xs">
                <dt className="ui-label text-faint">{k}</dt>
                <dd className="text-right text-mute">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
