"use client";

import { useEffect } from "react";

/**
 * Drives every `.reveal` on the page from one observer.
 *
 * Elements are marked revealed and then unobserved — reveals do not replay on
 * scroll-up, which reads as a page that cannot settle. The CSS carries a hard
 * watchdog on top of this; see globals.css.
 */
export function RevealDriver() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".reveal");
    if (!nodes.length) return;

    // Anything already on screen at load resolves immediately, without stagger.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.dataset.revealed = "true";
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    // Stagger siblings so a block of copy arrives as a block, not all at once.
    const groups = new Map<Element | null, number>();
    nodes.forEach((node) => {
      const parent = node.parentElement;
      const n = groups.get(parent) ?? 0;
      groups.set(parent, n + 1);
      node.style.setProperty("--reveal-delay", `${Math.min(n, 5) * 70}ms`);
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
