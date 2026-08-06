import { ViewTransition } from "react";
import type { ReactNode } from "react";

const directional = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

/**
 * Directional page slide. Forward navigations move content left, back
 * navigations move it right — the direction is declared per link with
 * `transitionTypes`, never inferred.
 *
 * This belongs in each `page.tsx`. Putting it in a layout does nothing:
 * layouts persist across navigation, so enter and exit never fire.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      {children}
    </ViewTransition>
  );
}

/**
 * Marks an element as the same object across two routes — the product name
 * in the home index and the product page headline are one thing that moves,
 * not two things that swap.
 *
 * `default="none"` stops it crossfading on every unrelated transition, and
 * the explicit `share` is required alongside it or the pair silently stops
 * morphing.
 */
export function MorphTitle({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
