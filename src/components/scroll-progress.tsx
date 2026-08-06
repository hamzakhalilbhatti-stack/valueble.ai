"use client";

import { useEffect, useRef } from "react";

/**
 * One-pixel reading indicator. On long editorial pages it is the only cue for
 * how much is left. Driven by direct style writes inside rAF rather than React
 * state — this runs on every scroll frame and must never trigger a re-render.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-px">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-amber"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
