"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";
import { contact, nav, products, whatsappUrl } from "@/lib/site";

/**
 * Header.
 *
 * A menu button at every width, including desktop. A horizontal nav bar would
 * put six competing links across the top of a page whose entire argument is
 * restraint — the reference build makes the same call, and it is the right one
 * for a site with three products and one destination that matters.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Lock the page behind the overlay and restore focus affordances on escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-50">
        <div className="pointer-events-auto mx-auto flex max-w-[96rem] items-center justify-between px-6 py-6 md:px-[3.25rem] md:py-8">
          <Logo />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="group relative z-50 grid h-6 w-9 place-items-center"
          >
            <span
              className={cn(
                "absolute block h-px w-9 bg-paper transition-transform duration-300 ease-[var(--ease-out)]",
                open ? "rotate-45" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute block h-px w-9 bg-paper transition-transform duration-300 ease-[var(--ease-out)]",
                open ? "-rotate-45" : "translate-y-1.5",
              )}
            />
          </button>
        </div>
      </header>

      {/* Overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink transition-opacity duration-500 ease-[var(--ease-out)]",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {/*
          Closing on link click rather than on a pathname change. Reacting to
          the route would mean setting state inside an effect on every
          navigation, and it also fails for same-page anchors, which do not
          change the pathname at all.
        */}
        <nav
          aria-label="Main"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
          className="mx-auto flex h-full max-w-[96rem] flex-col justify-center px-6 md:px-[3.25rem]"
        >
          <ul className="space-y-1">
            {products.map((product, i) => (
              <li key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex items-baseline gap-5 py-2 text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.2] text-paper transition-opacity duration-200 hover:opacity-60"
                  style={{
                    transitionDelay: open ? `${120 + i * 55}ms` : "0ms",
                    opacity: open ? undefined : 0,
                    transform: open ? undefined : "translateY(0.75rem)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: "500ms",
                  }}
                >
                  <span className="w-8 shrink-0 text-fine text-faint">{product.index}</span>
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-mute transition-colors duration-200 hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-fine">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-mute transition-colors duration-200 hover:text-paper"
            >
              WhatsApp
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-mute transition-colors duration-200 hover:text-paper"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-mute transition-colors duration-200 hover:text-paper"
            >
              {contact.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
