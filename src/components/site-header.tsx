"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, MessageCircle, PhoneCall, Search, Workflow, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";
import { contact, getProduct, nav, productOrder, type ProductSlug } from "@/lib/site";

const ICONS: Record<ProductSlug, typeof PhoneCall> = {
  "voice-agent": PhoneCall,
  "lead-extractor": Search,
  orderrise: MessageCircle,
  "ai-agents": Workflow,
};
const TINT: Record<string, string> = {
  voice: "bg-voice/10 text-voice",
  scan: "bg-scan/10 text-scan",
  warm: "bg-warm/10 text-warm",
  mind: "bg-mind/10 text-mind",
};

const menuProducts = productOrder.map((slug) => getProduct(slug)!);

/**
 * Sticky translucent navbar.
 *
 * Fix-pass changes:
 *  - Menus are keyed to the pathname they were opened on, so they close on
 *    every navigation (including back/forward) without a setState-in-effect.
 *  - Products opens on hover (with a grace delay) and on click/Enter/↓; Esc
 *    closes and returns focus to the trigger; focus leaving the menu closes it.
 *  - The mobile sheet is a fixed overlay instead of an in-flow block, so it
 *    never pushes the page or fights the sticky header for height.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [mobileFor, setMobileFor] = useState<string | null>(null);
  const [productsFor, setProductsFor] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = mobileFor === pathname;
  const productsOpen = productsFor === pathname;

  const productsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  const setProducts = useCallback((v: boolean) => setProductsFor(v ? pathname : null), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll behind the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileFor(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!productsOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!productsRef.current?.contains(e.target as Node)) setProductsFor(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductsFor(null);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [productsOpen]);

  const hoverOpen = (v: boolean) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setProducts(v), v ? 60 : 160);
  };

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setProducts(true);
      requestAnimationFrame(() => productsRef.current?.querySelector<HTMLAnchorElement>("#products-menu a")?.focus());
    }
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(productsRef.current?.querySelectorAll<HTMLAnchorElement>("#products-menu a") ?? []);
    const i = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  const isActive = (href: string) => !href.includes("#") && pathname === href;
  const productActive = menuProducts.some((p) => p.path === pathname);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:pt-4">
      {/*
        Floating pill bar. The blur lives on the inner pill, never on <header>:
        backdrop-filter on an ancestor becomes the containing block for the
        fixed mobile sheet (the old "mobile menu does nothing" bug).
      */}
      <div
        className={cn(
          "nav-pill mx-auto flex h-14 max-w-[56rem] items-center justify-between gap-4 rounded-2xl pl-4 pr-2 transition-[max-width,box-shadow,background-color] duration-500 ease-[var(--ease-spring)] md:h-16 md:pl-5",
          scrolled && "max-w-[50rem]",
          open && "rounded-b-none",
        )}
      >
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <div
                ref={productsRef}
                className="relative"
                onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen(true)}
                onPointerLeave={(e) => e.pointerType === "mouse" && hoverOpen(false)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setProducts(false);
                }}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  aria-expanded={productsOpen}
                  aria-controls="products-menu"
                  aria-haspopup="true"
                  onClick={() => setProducts(!productsOpen)}
                  onKeyDown={onTriggerKey}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-1 rounded-xl px-3.5 text-sm text-mute transition-colors hover:bg-ink-3 hover:text-paper aria-expanded:bg-ink-3 aria-expanded:text-paper",
                    productActive && "text-paper",
                  )}
                >
                  Products
                  <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-200", productsOpen && "rotate-180")} />
                </button>
                {productsOpen && (
                  // pt-2 is an invisible hover bridge between trigger and panel.
                  <div className="absolute left-1/2 top-full z-10 -translate-x-1/2 pt-4" onKeyDown={onMenuKey}>
                    <div id="products-menu" className="menu-in w-[26rem] rounded-2xl border border-rule bg-ink-2 p-2 shadow-[var(--shadow-lift)]">
                      <ul>
                        {menuProducts.map((p) => {
                          const Icon = ICONS[p.slug];
                          return (
                            <li key={p.slug}>
                              <Link
                                href={p.path}
                                onClick={() => setProducts(false)}
                                aria-current={pathname === p.path ? "page" : undefined}
                                className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-ink-3 focus-visible:bg-ink-3 aria-[current=page]:bg-ink-3"
                              >
                                <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-xl", TINT[p.accent])}>
                                  <Icon className="size-[1.125rem]" />
                                </span>
                                <span className="min-w-0">
                                  <span className="flex items-center gap-2 text-sm font-medium text-paper">
                                    {p.name}
                                    {p.slug === "voice-agent" && (
                                      <span className="rounded-full bg-voice/10 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-voice">
                                        New
                                      </span>
                                    )}
                                  </span>
                                  <span className="mt-0.5 block text-[0.8125rem] leading-snug text-mute">{p.plain.who}</span>
                                  <span className="mt-1 block text-xs font-medium text-paper">{p.price}</span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <Link
                        href="/pricing"
                        onClick={() => setProducts(false)}
                        className="mt-1 flex min-h-11 items-center justify-between rounded-xl border-t border-rule px-3 pt-1 text-sm text-mute hover:text-paper"
                      >
                        Compare all prices <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </li>
            {nav
              .filter((n) => n.label !== "Products")
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="relative inline-flex min-h-10 items-center rounded-xl px-3.5 text-sm text-mute transition-colors hover:bg-ink-3 hover:text-paper aria-[current=page]:font-medium aria-[current=page]:text-paper"
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
            className="inline-flex min-h-10 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent shadow-[0_8px_24px_-10px_var(--accent)] transition-[background-color,transform] hover:-translate-y-px hover:bg-accent-strong md:min-h-11"
          >
            Book a call
          </Link>
          <button
            type="button"
            onClick={() => setMobileFor(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-xl border border-rule-strong bg-ink-2 md:size-11 text-paper transition-colors hover:bg-ink-3 lg:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet: fixed below the bar, scrolls on its own. */}
      {open && (
        <div id="mobile-menu" className="menu-in fixed inset-x-3 bottom-3 top-[4.25rem] overflow-y-auto rounded-b-2xl border border-t-0 border-rule bg-ink-2 md:top-20 lg:hidden">
          <nav aria-label="Mobile" className="container-site py-6">
            <p className="eyebrow mb-3">Products</p>
            <ul className="grid gap-2">
              {menuProducts.map((p) => {
                const Icon = ICONS[p.slug];
                return (
                  <li key={p.slug}>
                    <Link
                      href={p.path}
                      onClick={() => setMobileFor(null)}
                      aria-current={pathname === p.path ? "page" : undefined}
                      className="flex min-h-16 items-center gap-3 rounded-xl border border-rule bg-ink px-4 py-3 transition-colors active:bg-ink-3 aria-[current=page]:border-accent/40"
                    >
                      <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-xl", TINT[p.accent])}>
                        <Icon className="size-[1.125rem]" />
                      </span>
                      <span className="flex-1">
                        <span className="block font-medium text-paper">{p.name}</span>
                        <span className="block text-sm text-mute">
                          {p.kind} · {p.price}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {nav
                .filter((n) => n.label !== "Products" && n.label !== "Voice Agent")
                .concat([{ label: "Blog", href: "/blog" }])
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileFor(null)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="flex min-h-14 items-center text-lg text-paper aria-[current=page]:font-semibold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
            <p className="mt-6 break-all text-sm text-mute">
              <a href={`mailto:${contact.email}`} className="underline-offset-4 hover:text-paper hover:underline">
                {contact.email}
              </a>
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
