import { cn } from "@/lib/cn";

/**
 * OrderRise — product demonstration.
 *
 * The conversation on the left and the ticket on the right are the same order.
 * Showing both together is the entire pitch: a customer types normally, the
 * kitchen receives structured data. No explanation needed.
 *
 * TODO: replace with a real screen recording of the live demo restaurant.
 */

type Msg = { from: "customer" | "agent"; text: string; time: string };

const THREAD: Msg[] = [
  { from: "customer", text: "hi do you still deliver to marina?", time: "23:04" },
  { from: "agent", text: "Yes — we deliver to Dubai Marina until 01:00. Would you like to see tonight's menu?", time: "23:04" },
  { from: "customer", text: "yes pls. 2 pepperoni large and a garlic bread", time: "23:05" },
  { from: "agent", text: "2× Large Pepperoni (AED 96)\n1× Garlic Bread (AED 18)\n\nSubtotal AED 114. Anything to drink?", time: "23:05" },
  { from: "customer", text: "no thats it. marina gate 2 apt 1204", time: "23:06" },
  { from: "agent", text: "Order confirmed ✅\nMarina Gate 2, Apt 1204\nTotal AED 114 · ~35 min\n\nWe'll message you when the driver leaves.", time: "23:06" },
];

const TICKET = [
  { qty: 2, item: "Large Pepperoni", note: null },
  { qty: 1, item: "Garlic Bread", note: null },
];

export function WhatsAppThread({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col border border-rule bg-surface/80 backdrop-blur-sm", className)}>
      <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
        <span className="grid size-7 place-items-center rounded-full bg-amber/15 text-[10px] text-amber">
          BN
        </span>
        <div>
          <p className="text-xs text-bone">Bella Napoli</p>
          <p className="label text-amber">answering · 23:06</p>
        </div>
      </div>

      <div className="flex-1 space-y-2 p-4">
        {THREAD.map((m, i) => (
          <div key={i} className={cn("flex", m.from === "customer" ? "justify-start" : "justify-end")}>
            <div
              className={cn(
                "max-w-[85%] px-3 py-2 text-xs leading-relaxed whitespace-pre-line",
                m.from === "customer"
                  ? "bg-void text-bone-soft"
                  : "bg-amber/12 text-bone",
              )}
            >
              {m.text}
              <span className="label mt-1 block text-bone-faint">{m.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KitchenTicket({ className }: { className?: string }) {
  return (
    <div className={cn("border border-rule bg-surface/80 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <span className="label text-bone">Kitchen display</span>
        <span className="label text-amber">NEW · #1047</span>
      </div>

      <div className="space-y-4 p-4">
        <ul className="space-y-2">
          {TICKET.map((line) => (
            <li key={line.item} className="flex gap-3 text-sm">
              <span className="tabular-nums text-amber">{line.qty}×</span>
              <span className="text-bone">{line.item}</span>
            </li>
          ))}
        </ul>

        <dl className="space-y-1.5 border-t border-rule pt-3">
          {[
            ["Type", "Delivery"],
            ["Address", "Marina Gate 2, Apt 1204"],
            ["Total", "AED 114"],
            ["Placed", "23:06"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 text-xs">
              <dt className="label text-bone-faint">{k}</dt>
              <dd className="text-right text-bone-soft">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
