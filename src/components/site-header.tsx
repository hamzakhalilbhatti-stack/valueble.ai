"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { setScrollLocked } from "@/lib/scroll-lock";
import { contact, nav, products, whatsappUrl } from "@/lib/site";
import { Container, Wordmark } from "@/components/ui";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [retracted, setRetracted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Retract on scroll down, return on scroll up. Reading gets the full
  // viewport; navigation stays one small gesture away.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 32);

      // A dead zone stops sub-pixel scroll jitter flickering the header, and
      // it never hides near the top where there is nothing to get out of.
      if (Math.abs(y - lastY) > 6) {
        setRetracted(y > lastY && y > 240);
        lastY = y;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close on navigation — the overlay would otherwise survive a route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setScrollLocked(open);
    return () => setScrollLocked(false);
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        // Anchored during view transitions — a sliding header would make the
        // whole viewport read as moving instead of just the content.
        style={{ viewTransitionName: "site-header" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-editorial)]",
          scrolled && !open
            ? "border-b border-rule bg-void/85 backdrop-blur-md"
            : "border-b border-transparent",
          retracted && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <Container>
          <div className="flex h-20 items-center justify-between md:h-24">
            <Link
              href="/"
              transitionTypes={["nav-back"]}
              aria-label="valueble.ai — home"
              className="text-bone transition-colors duration-500"
            >
              <Wordmark />
            </Link>

            <nav className="hidden items-center gap-10 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative text-sm tracking-tight text-bone-soft transition-colors duration-300 hover:text-bone"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-amber transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:origin-left group-hover:scale-x-100"
                  />
                </Link>
              ))}
              {/* Internal route now, so no new tab. */}
              <Link
                href={contact.bookingGeneral}
                className="bg-bone px-6 py-3 text-sm tracking-tight text-void transition-colors duration-500 hover:bg-amber hover:text-void"
              >
                Book a call
              </Link>
            </nav>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "label relative z-50 flex items-center gap-3 py-2 transition-colors duration-500 md:hidden",
                open ? "text-bone" : "text-bone",
              )}
            >
              {open ? "Close" : "Menu"}
              <span className="flex w-6 flex-col gap-1.5">
                <span
                  className={cn(
                    "h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-editorial)]",
                    open && "translate-y-[3.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-editorial)]",
                    open && "-translate-y-[3.5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.75, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-surface-deep text-bone md:hidden"
          >
            <Container className="pt-32">
              <nav className="flex flex-col">
                {products.map((product, index) => (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.2 + index * 0.07 }}
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex items-baseline gap-4 border-b border-white/10 py-5"
                    >
                      <span className="label text-amber">{product.index}</span>
                      <span className="font-display text-4xl leading-none tracking-tight">
                        {product.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {nav.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: EASE,
                      delay: 0.2 + (products.length + index) * 0.07,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block border-b border-white/10 py-4 text-lg tracking-tight text-bone/70"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </Container>

            <Container className="pb-12">
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
                className="flex items-center justify-between bg-amber px-6 py-5 text-bone"
              >
                <span className="tracking-tight">Message on WhatsApp</span>
                <span aria-hidden>&rarr;</span>
              </motion.a>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
