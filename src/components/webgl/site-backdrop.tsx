"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { StageHud } from "./orbit/stage-hud";
import { SceneBackground } from "./scene-background";

/**
 * Owns the WebGL layer and the preloader that covers it while the scene warms up.
 *
 * The count is tied to real signals — fonts resolved, window loaded, first WebGL
 * frame rendered — not to a timer. A fake progress bar that makes people wait for
 * nothing is a dark pattern, and on a fast connection this should barely appear.
 */
export function SiteBackdrop() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const signals = useRef({ fonts: false, load: false, scene: false });
  const onSceneReady = useCallback(() => {
    signals.current.scene = true;
  }, []);

  useEffect(() => {
    // Anything that has already happened before hydration counts immediately.
    if (document.readyState === "complete") signals.current.load = true;
    else window.addEventListener("load", () => (signals.current.load = true), { once: true });

    document.fonts?.ready.then(() => (signals.current.fonts = true));
    // Belt and braces: fonts can hang behind a slow stylesheet on some networks.
    const fontFloor = setTimeout(() => (signals.current.fonts = true), 3000);

    let frame = 0;
    let interval = 0;
    let finished = false;
    const started = performance.now();

    const tick = () => {
      if (finished) return;

      const elapsed = performance.now() - started;
      const s = signals.current;
      const real = (Number(s.fonts) + Number(s.load) + Number(s.scene)) / 3;

      // Never let it hang: after 6s the loader completes regardless, so a stalled
      // signal can never trap someone behind a black screen.
      const ceiling = elapsed > 6000 ? 1 : real;

      // Progress is derived from ELAPSED TIME, not accumulated per frame.
      // requestAnimationFrame is throttled to a crawl in background tabs, so a
      // per-frame ramp leaves anyone who opens the site in a background tab
      // staring at a black screen when they finally switch to it.
      const approach = 1 - Math.exp(-elapsed / 700);
      const shown = Math.min(ceiling, approach);

      setProgress(shown);

      if (ceiling === 1 && shown > 0.995) {
        finished = true;
        setProgress(1);
        setDone(true);
        // Hold the completed 100 for a beat before uncovering.
        setTimeout(() => setDismissed(true), 420);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    // Belt and braces for throttled tabs: intervals still fire (slowly) when
    // rAF does not, so the loader always reaches 100 and clears itself.
    interval = window.setInterval(tick, 250);

    return () => {
      finished = true;
      cancelAnimationFrame(frame);
      clearInterval(interval);
      clearTimeout(fontFloor);
    };
  }, []);

  // The loader is decorative chrome — hidden from assistive tech, which has the
  // real content available in the DOM underneath the whole time.
  return (
    <>
      <SceneBackground onReady={onSceneReady} />
      <StageHud />

      {!dismissed && (
        <div
          aria-hidden
          className={cn(
            "fixed inset-0 z-[100] bg-surface-deep transition-transform duration-[900ms] ease-[var(--ease-editorial)]",
            done && "-translate-y-full",
          )}
        >
          <div className="absolute bottom-[18vh] left-[6vw] flex items-end gap-8">
            <span aria-hidden className="mb-2 block h-24 w-px bg-void/25" />
            <span className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-bone italic tabular-nums">
              {Math.round(progress * 100)}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-void/15">
            <div
              className="h-full origin-left bg-amber"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      )}
    </>
  );
}
