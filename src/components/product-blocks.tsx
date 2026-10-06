import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle, PhoneCall, Search, Workflow } from "lucide-react";
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
export const ACCENT_TINT: Record<Product["accent"], string> = {
  voice: "bg-voice/10 text-voice",
  scan: "bg-scan/10 text-scan",
  warm: "bg-warm/10 text-warm",
  mind: "bg-mind/10 text-mind",
};
export const PRODUCT_ICON: Record<ProductSlug, typeof PhoneCall> = {
  "voice-agent": PhoneCall,
  "lead-extractor": Search,
  orderrise: MessageCircle,
  "ai-agents": Workflow,
};

/** Product overview card. The whole card is one link with descriptive text. */
export function ProductCard({ slug, className }: { slug: ProductSlug; className?: string }) {
  const p = getProduct(slug)!;
  const Icon = PRODUCT_ICON[slug];
  return (
    <article className={cn("card card-link group flex h-full flex-col p-6", className)} data-od-id={`product-card-${p.slug}`}>
      <div className="flex items-center justify-between gap-3">
        <span aria-hidden className={cn("grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110", ACCENT_TINT[p.accent])}>
          <Icon className="size-5" />
        </span>
        {p.status === "Live" ? <Badge tone="live">Live</Badge> : <Badge>{p.status}</Badge>}
      </div>
      <h3 className="mt-5 text-title">
        <Link href={p.path} className="after:absolute after:inset-0 after:rounded-[1.25rem] focus-visible:outline-none">
          {p.name}
        </Link>
      </h3>
      <p className={cn("mt-1 text-sm font-medium", ACCENT_TEXT[p.accent])}>{p.kind}</p>
      <p className="mt-4 flex-1 text-[0.9375rem] text-mute">{p.plain.what}</p>
      <div className="mt-6 flex items-end justify-between gap-3 border-t border-rule pt-5">
        <div>
          <p className="whitespace-nowrap font-display text-xl font-semibold text-paper">{p.price}</p>
          {p.priceNote && <p className="text-xs text-faint">{p.priceNote}</p>}
        </div>
        <span aria-hidden className="grid size-10 place-items-center rounded-full border border-rule-strong text-paper transition-[background-color,color,transform] duration-300 group-hover:rotate-45 group-hover:bg-paper group-hover:text-ink">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-accent group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}

/** What / who / cost / what happens — the first lines on every product surface. */
export function PlainFacts({ product, className }: { product: Product; className?: string }) {
  const rows = [
    ["What it does", product.plain.what],
    ["Who it's for", product.plain.who],
    ["What it costs", product.plain.cost],
    ["What happens next", product.plain.after],
  ];
  return (
    <dl className={cn("grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2", className)}>
      {rows.map(([k, v]) => (
        <div key={k} className="bg-ink-2 p-5">
          <dt className={cn("ui-label", ACCENT_TEXT[product.accent])}>{k}</dt>
          <dd className="mt-2 text-[0.9375rem] leading-relaxed text-paper">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Simple 3-step "How it works" visual with a connector that draws in on scroll. */
export function HowItWorks3({ product, className }: { product: Product; className?: string }) {
  return (
    <ol className={cn("relative grid gap-4 md:grid-cols-3 md:gap-6", className)}>
      <span aria-hidden className="absolute left-[16.6%] right-[16.6%] top-8 hidden h-px bg-rule-strong md:block" />
      {product.how3.map((s, i) => (
        <li key={s.title} className="reveal reveal-scale relative text-center" data-od-id={`how3-${product.slug}-${i + 1}`}>
          <span className={cn("relative z-[1] mx-auto grid size-16 place-items-center rounded-2xl border border-rule bg-ink-2 font-display text-2xl font-semibold shadow-[var(--shadow-card)]", ACCENT_TEXT[product.accent])}>
            {i + 1}
          </span>
          <h3 className="mt-5 text-title">{s.title}</h3>
          <p className="mx-auto mt-2 max-w-[28ch] text-[0.9375rem] text-mute">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Real photo with a caption chip anchored inside its bottom-left corner. */
export function Photo({
  src,
  width,
  height,
  alt,
  caption,
  className,
  priority = false,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={cn("relative overflow-hidden rounded-[1.5rem] border border-rule shadow-[var(--shadow-lift)]", className)}>
      <Image src={src} width={width} height={height} alt={alt} priority={priority} loading={priority ? undefined : "lazy"} sizes="(min-width: 1024px) 560px, 100vw" className="h-auto w-full transition-transform duration-700 ease-out hover:scale-[1.03]" />
      {caption && (
        <figcaption className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-medium text-[oklch(0.2_0.025_265)] shadow-lg backdrop-blur-md">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Closing call-to-action band, dark for contrast. One primary, one secondary. */
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
        <div className="theme-dark reveal reveal-scale relative isolate overflow-hidden rounded-[2rem] px-6 py-16 text-center md:px-16 md:py-20">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(to_right,oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(60%_70%_at_50%_0%,#000,transparent)]"
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
