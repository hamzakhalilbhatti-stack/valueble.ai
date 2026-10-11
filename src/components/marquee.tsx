import { cn } from "@/lib/cn";

/**
 * Slow marquee of plain things the products do. Words only — no client
 * logos or proof (none exist yet). The list renders twice so the loop is
 * seamless; the copy is aria-hidden so screen readers hear it once.
 */
const ITEMS: { t: string; c: string }[] = [
  { t: "Answers calls at 11pm", c: "bg-voice" },
  { t: "Takes orders on WhatsApp", c: "bg-wa" },
  { t: "Scrapes Google Maps to CSV", c: "bg-scan" },
  { t: "Scores every lead", c: "bg-warm" },
  { t: "Books appointments", c: "bg-voice" },
  { t: "Hands off to a human", c: "bg-mind" },
  { t: "Logs to your sheet or CRM", c: "bg-scan" },
  { t: "Built by one founder", c: "bg-paper" },
];

export function Marquee({ className }: { className?: string }) {
  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {ITEMS.map((i) => (
        <li key={i.t} className="glass flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-paper">
          <span aria-hidden className={cn("size-1.5 rounded-full", i.c)} />
          {i.t}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("marquee", className)} role="group" aria-label="What the products do">
      {list(false)}
      {list(true)}
    </div>
  );
}
