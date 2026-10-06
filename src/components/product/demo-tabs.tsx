"use client";

import { useRef, useState } from "react";
import { MessageCircle, Search, Workflow } from "lucide-react";
import { ScraperDemo } from "@/components/product/scraper-demo";
import { OrderRiseDemo } from "@/components/product/orderrise-demo";
import { AgentDemo } from "@/components/product/agent-demo";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "scraper", label: "Maps Lead Scraper", Icon: Search, tint: "text-scan", Demo: ScraperDemo, href: "/maps-lead-scraper" },
  { id: "orderrise", label: "OrderRise", Icon: MessageCircle, tint: "text-warm", Demo: OrderRiseDemo, href: "/orderrise" },
  { id: "agents", label: "Custom AI Agents", Icon: Workflow, tint: "text-mind", Demo: AgentDemo, href: "/custom-ai-agents" },
] as const;

/** Home page demo switcher. WAI-ARIA tabs with arrow-key support. */
export function DemoTabs() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("scraper");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    setActive(TABS[n].id);
    refs.current[n]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Product demos" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-rule-strong bg-ink-2 px-5 text-sm font-medium text-mute shadow-[var(--shadow-card)] transition-[background-color,color,border-color,transform] hover:-translate-y-0.5 hover:text-paper aria-selected:border-paper aria-selected:bg-paper aria-selected:text-ink"
          >
            <t.Icon aria-hidden className={cn("size-4", active !== t.id && t.tint)} />
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map((t) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={active !== t.id} className="mt-8">
          {active === t.id && (
            <div className="menu-in">
              <t.Demo />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
