"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/** Fires once, the first time the element enters the viewport. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // React's Strict Mode remount in dev wipes attributes it doesn't own from
    // <html>, including the class the inline script set. Re-assert it here —
    // a no-op in production, and self-healing if it ever goes missing.
    document.documentElement.classList.add("js");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

function delayStyle(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

type RevealProps = {
  children: ReactNode;
  /** Milliseconds to hold before the element releases. */
  delay?: number;
  className?: string;
  id?: string;
};

/** Rise-and-fade. The default reveal for blocks, images, and body copy. */
export function Reveal({ children, delay = 0, className, id }: RevealProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      id={id}
      className={cn("reveal", className)}
      data-revealed={revealed}
      style={delayStyle(delay)}
    >
      {children}
    </div>
  );
}

type RevealLinesProps = {
  /** One entry per visual line. Line breaks are a design decision, so they stay explicit. */
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  delay?: number;
  className?: string;
  /** @deprecated Per-line staggering was removed — see the note below. */
  stagger?: number;
};

/**
 * Display type with explicit line breaks.
 *
 * This used to stagger each line out from behind an overflow mask. That was
 * removed deliberately: watching a headline assemble itself line by line makes
 * the words arrive later than the reader does, and it reads as a template
 * effect rather than as craft. The heading now resolves as one block.
 *
 * The `lines` prop stays because where a headline breaks is a typographic
 * decision, not something to leave to the container width.
 */
export function RevealLines({ lines, as = "h2", delay = 0, className }: RevealLinesProps) {
  const { ref, revealed } = useReveal<HTMLHeadingElement>();

  return createElement(
    as,
    {
      ref,
      className: cn("reveal", className),
      "data-revealed": revealed,
      style: delayStyle(delay),
    },
    lines.map((line, index) => (
      <span key={index} className="block">
        {line}
      </span>
    )),
  );
}
