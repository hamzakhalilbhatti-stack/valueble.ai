"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reads the reduced-motion preference.
 *
 * A media query is external state, so it is subscribed to rather than copied
 * into a state variable inside an effect — that pattern renders once with the
 * wrong answer and then again with the right one, and trips the
 * set-state-in-effect rule for good reason.
 *
 * The server snapshot is `false` so server and client markup agree on hydrate.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
