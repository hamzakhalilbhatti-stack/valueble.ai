import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { contact, getProduct, type Product, type ProductSlug, whatsappUrl } from "@/lib/site";

export const ACCENT_TEXT: Record<Product["accent"], string> = {
  voice: "text-voice",
  scan: "text-scan",
  warm: "text-warm",
  mind: "text-mind",
};
export const ACCENT_BG: Record<Product["accent"], string> = {
  voice: "bg-voice",
  scan: "bg-scan",
  warm: "bg-warm",
  mind: "bg-mind",
};

/** Product overview card. The whole card is one link with descriptive text. */
export function ProductCard({ slug, className }: { slug: ProductSlug; className?: string }) {
  const p = getProduct(slug)!;
  return (
    <article className={cn("card card-link group flex h-full flex-col p-6 md:p-7", className)} data-od-id={`product-card-${p.slug}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={cn("ui-label", ACCENT_TEXT[p.accent])}>{p.kind}</span>
        {p.status === "Live" ? <Badge tone="live">Live</Badge> : <Badge>{p.status}</Badge>}
      </div>
      <h3 className="mt-6 text-title">
        <Link href={p.path} className="after:absolute after:inset-0 after:rounded-[1.25rem] focus-visible:outline-none">
          {p.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-faint">{p.audience}</p>
      <p className="mt-4 flex-1 text-mute">{p.tagline}</p>
      <div className="mt-6 border-t border-rule pt-5">
        <p className="whitespace-nowrap font-display text-xl font-semibold text-paper">{p.price}</p>
        {p.priceNote && <p className="text-xs text-faint">{p.priceNote}</p>}
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-paper">
          See {p.name}
          <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      {/* Focus ring for the stretched link */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-accent group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}

/** Closing call to action band. One primary, one secondary. */
export function CtaBand({
  heading,
  body,
  primary,
  secondary,
  id = "cta",
}: {
  heading: string;
  body: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  id?: string;
}) {
  return (
    <section id={id} className="section" data-od-id={`${id}-band`} aria-labelledby={`${id}-title`}>
      <div className="container-site">
        <div className="reveal relative isolate overflow-hidden rounded-[1.75rem] border border-rule-strong px-6 py-14 text-center md:px-16 md:py-20">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(95_232_200/0.16),transparent_70%),linear-gradient(180deg,#0e111a,#090b11)]" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(60%_70%_at_50%_0%,#000,transparent)]"
          />
          <h2 id={`${id}-title`} className="mx-auto max-w-2xl text-display">
            {heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sub text-mute">{body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={primary?.href ?? whatsappUrl} data-od-id={`${id}-primary`}>
              {primary?.label ?? "Message me on WhatsApp"}
            </Button>
            <Button href={secondary?.href ?? contact.bookingGeneral} variant="secondary">
              {secondary?.label ?? "See every way to reach me"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
