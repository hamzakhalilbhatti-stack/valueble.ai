"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a real number when it scrolls into view. Only used for facts
 * that are true on the site (prices, score range, hours) — never invented
 * metrics. Renders the final value on the server so there is no layout shift.
 */
export function CountUp({ to, prefix = "", suffix = "", duration = 1200 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        setVal(0);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

/** Pointer parallax wrapper: children with data-depth drift with the cursor. */
export function Parallax({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      layers.forEach((l) => {
        const d = Number(l.dataset.depth);
        l.style.translate = `${(x * d).toFixed(2)}px ${(y * d).toFixed(2)}px`;
      });
      if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 24;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 24;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Thin progress bar at the top of the viewport that tracks page scroll. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-accent" />;
}

/**
 * Scroll-linked scene. Writes a 0→1 progress value to `--p` on its own
 * element every animation frame while it is on screen, so children can
 * drive transforms from CSS with calc(var(--p) * …). Transform/opacity only,
 * one passive listener, nothing runs while off screen.
 *
 * mode "exit":    0 when the top of the scene hits the top of the viewport,
 *                 1 when the scene has fully scrolled away (hero parallax).
 * mode "through": 0 when the scene enters at the bottom, 1 when it leaves.
 * mode "pin":     0→1 across a tall section with a sticky child.
 */
export function ScrollScene({
  children,
  className,
  mode = "exit",
  steps,
  onStep,
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  mode?: "exit" | "through" | "pin";
  steps?: number;
  onStep?: (i: number) => void;
  as?: "div" | "section";
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">) {
  const ref = useRef<HTMLElement>(null);
  const stepRef = useRef(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "exit") p = -r.top / Math.max(1, r.height);
      else if (mode === "through") p = (vh - r.top) / (vh + r.height);
      else p = -r.top / Math.max(1, r.height - vh);
      p = Math.min(1, Math.max(0, p));
      if (!reduce) el.style.setProperty("--p", p.toFixed(4));
      if (steps && onStep) {
        const i = Math.min(steps - 1, Math.floor(p * steps));
        if (i !== stepRef.current) {
          stepRef.current = i;
          onStep(i);
        }
      }
    };
    const on = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) on();
    });
    io.observe(el);
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [mode, steps, onStep]);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Statement text whose words light up one by one as it scrolls through the
 * viewport (dim -> full). Writes --lit (0/1) per word from a single rAF-
 * throttled listener; the full sentence is always in the DOM for readers.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("span"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.style.setProperty("--lit", "1"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const n = p * words.length;
      words.forEach((w, i) => w.style.setProperty("--lit", Math.min(1, Math.max(0, n - i)).toFixed(2)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <p ref={ref} className={`scroll-words ${className ?? ""}`}>
      {text.split(" ").map((w, i) => (
        <span key={i}>{w} </span>
      ))}
    </p>
  );
}

/** Cursor-following glow for .glow-card children (writes --mx/--my). */
export function GlowTracker() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const on = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(".glow-card") as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return null;
}
