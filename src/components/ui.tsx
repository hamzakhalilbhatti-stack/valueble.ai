import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Faq } from "@/lib/site";

const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/**
 * Button. Three variants:
 *  - primary   solid accent, one per viewport
 *  - secondary outlined, for the second action in a pair
 *  - ghost     text link with an arrow
 * Hover moves the background, never lightens the text.
 */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
  "data-od-id": odId,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
  "data-od-id"?: string;
}) {
  const external = isExternalHref(href);
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
    "transition-[background-color,border-color,transform] duration-200 ease-[var(--ease-out)] active:translate-y-px",
    size === "md" ? "min-h-12 px-6 text-[0.9375rem]" : "min-h-10 px-4 text-sm",
    variant === "primary" &&
      "bg-accent text-ink shadow-[0_0_0_1px_rgb(95_232_200/0.4),0_10px_30px_-10px_rgb(95_232_200/0.55)] hover:bg-accent-strong",
    variant === "secondary" &&
      "border border-rule-strong bg-white/[0.03] text-paper hover:border-faint hover:bg-white/[0.08]",
    variant === "ghost" && "min-h-0 px-0 text-paper underline-offset-4 hover:underline",
    className,
  );
  const Icon = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      {children}
      <Icon
        aria-hidden
        className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </>
  );

  if (external) {
    const newTab = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        data-od-id={odId}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} aria-label={ariaLabel} data-od-id={odId}>
      {inner}
    </Link>
  );
}

/** Small status / price chip. */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "live" | "price" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        tone === "neutral" && "border-rule-strong bg-white/[0.03] text-mute",
        tone === "live" && "border-accent/30 bg-accent/10 text-accent",
        tone === "price" && "border-rule-strong bg-ink-3 text-paper",
        tone === "accent" && "border-voice/30 bg-voice/10 text-voice",
        className,
      )}
    >
      {tone === "live" && <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-accent" />}
      {children}
    </span>
  );
}

/** Section header: eyebrow, H2, optional lede. */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div
      className={cn(
        "reveal max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag id={id} className={Tag === "h1" ? "text-display" : "text-head"}>
        {title}
      </Tag>
      {lede && (
        <p className={cn("mt-5 text-sub text-mute", align === "center" && "mx-auto max-w-2xl")}>
          {lede}
        </p>
      )}
    </div>
  );
}

/** FAQ accordion. Native <details> so it works without JS and with the keyboard. */
export function FaqList({ faqs, className }: { faqs: Faq[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-rule border-y border-rule", className)}>
      {faqs.map((faq, i) => (
        <details key={faq.q} className="faq group" data-od-id={`faq-item-${i + 1}`}>
          <summary className="flex min-h-14 items-center justify-between gap-6 py-5 text-left text-paper transition-colors hover:text-accent-strong">
            <h3 className="font-sans text-base font-medium md:text-[1.0625rem]">{faq.q}</h3>
            <span className="faq-icon grid size-8 shrink-0 place-items-center rounded-full border border-rule-strong">
              <Plus aria-hidden className="size-4" />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 pr-12 text-mute">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Visible breadcrumb trail for inner pages. Pair with BreadcrumbJsonLd. */
export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-fine text-faint">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-mute">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="transition-colors hover:text-paper">
                    {item.name}
                  </Link>
                  <ChevronRight aria-hidden className="size-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Check-mark list used for capabilities and the problem bullets. */
export function CheckList({
  items,
  className,
  tone = "accent",
}: {
  items: string[];
  className?: string;
  tone?: "accent" | "voice" | "warm" | "mind" | "scan";
}) {
  const dot = {
    accent: "bg-accent",
    voice: "bg-voice",
    warm: "bg-warm",
    mind: "bg-mind",
    scan: "bg-scan",
  }[tone];
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className={cn("mt-[0.6rem] size-1.5 shrink-0 rounded-full", dot)} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
