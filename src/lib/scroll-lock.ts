import type Lenis from "lenis";

/**
 * The overlay menu needs to freeze the page, and Lenis owns scrolling — so the
 * instance is registered here for the few components that must talk to it.
 * Falls back to locking the document when Lenis is absent (reduced motion).
 */
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function setScrollLocked(locked: boolean) {
  if (locked) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
}
