"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Drives every `.reveal` on the page from one IntersectionObserver.
 *
 * Why scroll animations never played before this fix:
 *  - The observer ran once from the root layout, so after any client-side
 *    navigation the new page's `.reveal` nodes were never observed.
 *  - A global 2.5s "watchdog" class force-showed every `.reveal`, so by the
 *    time a visitor scrolled, every section was already static.
 *
 * Now it re-scans on every route change and on DOM insertions, staggers
 * siblings, and only hides content after `html.js` is set (crawlers and no-JS
 * visitors always see everything).
 */
export function RevealDriver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) {
      root.classList.remove("js");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      const groups = new Map<Element | null, number>();
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        if (seen.has(el) || el.dataset.revealed === "true") return;
        seen.add(el);
        const parent = el.parentElement;
        const n = groups.get(parent) ?? 0;
        groups.set(parent, n + 1);
        if (!el.style.getPropertyValue("--reveal-delay")) {
          el.style.setProperty("--reveal-delay", `${Math.min(n, 6) * 80}ms`);
        }
        io.observe(el);
      });
    };

    scan();
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
