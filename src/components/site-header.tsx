"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";
import { contact, getProduct, nav, productOrder } from "@/lib/site";

const ACCENT_DOT: Record<string, string> = {
  voice: "bg-voice",
  scan: "bg-scan",
  warm: "bg-warm",
  mind: "bg-mind",
};

const menuProducts = productOrder.map((slug) => getProduct(slug)!);

/**
 * Sticky translucent navbar.
 *
 * Desktop: logo, Products menu (voice agent first), page links, one primary CTA.
 * Mobile: logo, a compact "Book a call" button that is always visible, and a
 * menu sheet. The CTA is never hidden behind the menu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!productsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!productsRef.current?.contains(e.target as Node)) setProductsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProductsOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [productsOpen]);

  const isActive = (href: string) => !href.includes("#") && pathname === href;
  const closeAll = () => {
    setOpen(false);
    setProductsOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        scrolled || open
          ? "border-rule bg-ink/85 backdrop-blur-md"
          : "border-transparent bg-ink/60 backdrop-blur-md",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <div ref={productsRef} className="relative">
                <button
                  type="button"
                  aria-expanded={productsOpen}
                  aria-controls="products-menu"
                  onClick={() => setProductsOpen((v) => !v)}
                  className="inline-flex min-h-10 items-center gap-1 rounded-full px-3.5 text-sm text-mute transition-colors hover:bg-white/[0.06] hover:text-paper aria-expanded:bg-white/[0.06] aria-expanded:text-paper"
                >
                  Products
                  <ChevronDown
                    aria-hidden
                    className={cn("size-4 transition-transform", productsOpen && "rotate-180")}
                  />
                </button>
                <div
                  id="products-menu"
                  hidden={!productsOpen}
                  className="absolute left-0 top-full mt-2 w-[22rem] rounded-2xl border border-rule-strong bg-ink-2 p-2 shadow-2xl shadow-black/60"
                >
                  <ul>
                    {menuProducts.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={p.path}
                          onClick={closeAll}
                          className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.06]"
                        >
                          <span
                            aria-hidden
                            className={cn("mt-2 size-2 shrink-0 rounded-full", ACCENT_DOT[p.accent])}
                          />
                          <span>
                            <span className="flex items-center gap-2 text-sm font-medium text-paper">
                              {p.name}
                              {p.slug === "voice-agent" && (
                                <span className="rounded-full bg-voice/15 px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wider text-voice">
                                  New
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 block text-[0.8125rem] leading-snug text-faint">
                              {p.kind} · {p.price}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            {nav
              .filter((n) => n.label !== "Products")
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="inline-flex min-h-10 items-center rounded-full px-3.5 text-sm text-mute transition-colors hover:bg-white/[0.06] hover:text-paper aria-[current=page]:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={contact.bookingGeneral}
            className="inline-flex min-h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-ink transition-colors hover:bg-accent-strong"
          >
            Book a call
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full border border-rule-strong text-paper transition-colors hover:bg-white/[0.06] lg:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-rule bg-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="container-site py-6">
          <p className="eyebrow mb-3">Products</p>
          <ul className="grid gap-2">
            {menuProducts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={p.path}
                  onClick={closeAll}
                  className="flex min-h-14 items-center gap-3 rounded-xl border border-rule bg-ink-2 px-4 py-3"
                >
                  <span aria-hidden className={cn("size-2 rounded-full", ACCENT_DOT[p.accent])} />
                  <span className="flex-1">
                    <span className="block font-medium text-paper">{p.name}</span>
                    <span className="block text-sm text-faint">{p.price}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {nav
              .filter((n) => n.label !== "Products" && n.label !== "Voice Agent")
              .concat([{ label: "Blog", href: "/blog" }])
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeAll}
                    className="flex min-h-14 items-center text-lg text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
          <p className="mt-6 break-all text-sm text-faint">
            <a href={`mailto:${contact.email}`} className="hover:text-paper">
              {contact.email}
            </a>
          </p>
        </nav>
      </div>
    </header>
  );
}
