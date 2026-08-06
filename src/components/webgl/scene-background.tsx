"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ecosystem } from "./orbit/ecosystem";

gsap.registerPlugin(ScrollTrigger);

/**
 * The persistent WebGL layer for THE ORBIT.
 *
 * One fixed, full-viewport canvas behind the whole site. Page sections are
 * translucent, so the ecosystem stays visible the entire way down.
 *
 * Mounting rules: never under reduced motion. Small screens get a compact
 * composition rather than nothing, because the ecosystem IS the explanation —
 * dropping it on mobile would leave the page meaningless.
 */
export function SceneBackground({ onReady }: { onReady?: () => void }) {
  const [enabled, setEnabled] = useState(false);
  const [compact, setCompact] = useState(false);
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 767px)");

    const decide = () => {
      setEnabled(!stillness.matches);
      setCompact(narrow.matches);
    };
    decide();

    stillness.addEventListener("change", decide);
    narrow.addEventListener("change", decide);
    return () => {
      stillness.removeEventListener("change", decide);
      narrow.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (!enabled) onReady?.();
  }, [enabled, onReady]);

  /**
   * ONE ScrollTrigger drives the whole journey. Every scene value is derived
   * from this single progress number — no second trigger is ever allowed to
   * touch the camera, sphere, satellites or lighting.
   */
  useEffect(() => {
    if (!enabled) return;

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scroll.current = self.progress;
        window.dispatchEvent(
          new CustomEvent("orbit:progress", { detail: self.progress }),
        );
      },
    });

    // Lenis scrolls the real document, so ScrollTrigger's own listener fires —
    // but refreshing after it settles avoids stale measurements on first paint.
    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 400);

    const onPointer = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onPointer);
      trigger.kill();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    // Demoted to a quiet backdrop. The product demonstrations now carry the
    // page; the scene supports them rather than competing for attention.
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.18]">
      <Canvas
        // Capped so high-DPR laptops don't quietly render several times the pixels.
        dpr={compact ? [1, 1.25] : [1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [3.15, 0.55, 1.5], fov: 38 }}
        shadows={!compact}
        onCreated={() => onReady?.()}
      >
        <Ecosystem scrollRef={scroll} pointerRef={pointer} compact={compact} />
      </Canvas>
    </div>
  );
}
