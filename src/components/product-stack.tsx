"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Badge } from "@/components/ui";
import { ACCENT_TEXT, PRODUCT_ICON, PRODUCT_IMAGE } from "@/components/product-blocks";
import { FluidBalloonIndex, FluidNumberText } from "@/components/fluid-number";
import { cn } from "@/lib/cn";
import { getProduct, productOrder, type Product } from "@/lib/site";

/** One soft colour field per product — the "theme colour" of each card. */
const FIELD: Record<Product["accent"], string> = {
  voice: "bg-[radial-gradient(90%_120%_at_0%_0%,oklch(0.3_0.07_250),oklch(0.17_0.008_270)_60%)]",
  scan: "bg-[radial-gradient(90%_120%_at_0%_0%,oklch(0.3_0.06_172),oklch(0.17_0.008_270)_60%)]",
  warm: "bg-[radial-gradient(90%_120%_at_0%_0%,oklch(0.32_0.07_55),oklch(0.17_0.008_270)_60%)]",
  mind: "bg-[radial-gradient(90%_120%_at_0%_0%,oklch(0.3_0.08_300),oklch(0.17_0.008_270)_60%)]",
};

function ProductCardItem({
  slug,
  index,
}: {
  slug: (typeof productOrder)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const p = getProduct(slug)!;
  const Icon = PRODUCT_ICON[slug];

  return (
    <li
      className="md:sticky transition-transform"
      style={{ top: `calc(5.5rem + ${index * 1.25}rem)` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article
        data-od-id={`product-card-${p.slug}`}
        className={cn(
          "group relative grid overflow-hidden rounded-[2rem] border border-rule-strong shadow-[var(--shadow-lift)] md:grid-cols-[1.05fr_1fr] transition-all duration-500",
          FIELD[p.accent],
          isHovered && "ring-1 ring-white/20"
        )}
      >
        {/* Outcrowd/Video-style large floating 3D fluid balloon number */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-6 top-6 z-10 hidden sm:block transition-all duration-500 ease-[var(--ease-spring)]",
            isHovered
              ? "opacity-95 translate-y-0 scale-100 rotate-[-2deg]"
              : "opacity-40 translate-y-1 scale-95 rotate-0"
          )}
        >
          <FluidBalloonIndex
            index={p.index}
            size={68}
            tint="blue"
            isHovered={isHovered}
          />
        </div>

        <div className="flex flex-col p-6 md:p-10 z-10">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-rule/70 bg-ink-2 shadow-sm"
            >
              <Image
                src={PRODUCT_IMAGE[p.slug]}
                alt=""
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </span>

            {/* Mobile / small-screen fluid number */}
            <div className="sm:hidden">
              <FluidBalloonIndex
                index={p.index}
                size={28}
                tint="blue"
                isHovered={isHovered}
              />
            </div>

            {p.status !== "Live" && (
              <span className="ml-auto sm:ml-0">
                <Badge>{p.status}</Badge>
              </span>
            )}
          </div>

          <h3 className="mt-6 text-head">
            <Link
              href={p.path}
              className="after:absolute after:inset-0 after:rounded-[2rem] focus-visible:outline-none"
            >
              {p.name}
            </Link>
          </h3>
          <p className={cn("mt-1 font-medium", ACCENT_TEXT[p.accent])}>
            {p.kind}
          </p>
          <p className="mt-4 max-w-[46ch] text-[1.0625rem] text-paper">
            {p.plain.what}
          </p>
          <ul className="mt-5 space-y-2 text-[0.9375rem] text-mute">
            <li className="flex gap-2">
              <Check aria-hidden className="mt-1 size-4 shrink-0 text-paper" />
              <span>
                <span className="font-medium text-paper">For: </span>
                {p.plain.who}
              </span>
            </li>
            <li className="flex gap-2">
              <Check aria-hidden className="mt-1 size-4 shrink-0 text-paper" />
              <span>
                <span className="font-medium text-paper">Then: </span>
                {p.plain.after}
              </span>
            </li>
          </ul>

          <div className="mt-auto flex items-end justify-between gap-4 pt-8">
            <div>
              <p className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-paper">
                <FluidNumberText tint="accent">{p.price}</FluidNumberText>
              </p>
              {p.priceNote && (
                <p className="mt-1 text-sm text-faint">{p.priceNote}</p>
              )}
            </div>
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-translate-y-0.5">
              See {p.name}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:rotate-45"
              />
            </span>
          </div>
        </div>

        <div className="relative min-h-56 overflow-hidden md:min-h-[26rem]">
          {/* decorative crop: the photo is context, the facts are in the text */}
          <Image
            src={p.photo.src}
            alt=""
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.17_0.008_270),transparent_35%)] max-md:hidden"
          />
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem] ring-paper group-has-[a:focus-visible]:ring-2"
        />
      </article>
    </li>
  );
}

/**
 * Products as a stack of cards that pin and pile up as you scroll.
 * Features Outcrowd-style 3D fluid inflatable numbers (01, 02, 03, 04)
 * that inflate and wobble on hover.
 */
export function ProductStack() {
  return (
    <ol className="relative mt-12 grid gap-6 md:gap-10" aria-label="Products">
      {productOrder.map((slug, i) => (
        <ProductCardItem key={slug} slug={slug} index={i} />
      ))}
    </ol>
  );
}
