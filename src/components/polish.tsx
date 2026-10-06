import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { contact, whatsappUrl } from "@/lib/site";

/**
 * Polish kit (ChronoTask-style craft): glossy app tiles, a pinned sticky
 * note, a "works with" tool cluster and a contact aside used to fill the
 * empty half of two-column sections with something useful.
 */

export function AppTile({
  children,
  size = "md",
  dark = false,
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "app-tile",
        dark && "app-tile-dark",
        size === "sm" && "size-10",
        size === "md" && "size-12",
        size === "lg" && "size-16",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Pinned sticky note. Content is real copy from the site, set in the serif. */
export function StickyNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("sticky-note px-5 pb-6 pt-6", className)}>
      <p className="font-serif text-[1.3rem] italic leading-[1.25]">{children}</p>
    </div>
  );
}

/**
 * The tools the products actually work with. Brand marks from Simple Icons
 * (CC0); see public/logos/CREDITS.txt. Naming a tool is not a partnership claim.
 */
export const TOOLS = [
  { src: "/logos/whatsapp.svg", name: "WhatsApp", note: "OrderRise orders, voice confirmations" },
  { src: "/logos/googlemaps.svg", name: "Google Maps", note: "Lead Scraper source" },
  { src: "/logos/googlechrome.svg", name: "Chrome", note: "Lead Scraper runs here" },
  { src: "/logos/googlesheets.svg", name: "Sheets / CSV", note: "Leads and call logs land here" },
  { src: "/logos/gmail.svg", name: "Email inbox", note: "Summaries and handoffs" },
] as const;

/** A single brand mark as a plain <img>; next/image refuses SVG under static export. */
export function ToolMark({ src, className }: { src: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- tiny static SVG mark
  return <img src={src} alt="" width={24} height={24} loading="lazy" className={className} />;
}

export function ToolTiles({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)} aria-label="Tools the products work with">
      {TOOLS.map((t, i) => (
        <li key={t.name} className="group relative" style={{ ["--i" as string]: i }}>
          <span className={cn("app-tile transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:rotate-[-4deg]", size === "md" ? "size-14" : "size-11")}>
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG marks, nothing to optimise */}
            <img src={t.src} alt="" width={28} height={28} loading="lazy" className={size === "md" ? "size-7" : "size-5"} />
          </span>
          <span className="sr-only">
            {t.name}: {t.note}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Fills the empty column next to an FAQ heading with a real next step. */
export function FaqAside({ className }: { className?: string }) {
  return (
    <div className={cn("frag reveal mt-8 max-w-sm p-5", className)}>
      <div className="flex items-center gap-3">
        <AppTile size="sm" dark>
          <span className="font-display text-[0.8125rem] font-semibold">HK</span>
        </AppTile>
        <div>
          <p className="text-[0.9375rem] font-medium text-paper">Not covered here?</p>
          <p className="text-sm text-mute">Ask Hamza. He answers himself.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-11 items-center gap-2.5 rounded-xl border border-rule bg-ink-2 px-3.5 text-sm font-medium text-paper transition-[background-color,border-color] hover:border-rule-strong hover:bg-ink-3"
        >
          <MessageCircle aria-hidden className="size-4 text-wa" />
          Message on WhatsApp
          <ArrowUpRight aria-hidden className="ml-auto size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="group flex min-h-11 items-center gap-2.5 rounded-xl border border-rule bg-ink-2 px-3.5 text-sm font-medium text-paper transition-[background-color,border-color] hover:border-rule-strong hover:bg-ink-3"
        >
          <Mail aria-hidden className="size-4 text-mute" />
          Send an email
          <ArrowUpRight aria-hidden className="ml-auto size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
