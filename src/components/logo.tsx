import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The valueble.ai mark — the same "V" path as /brand/valueble-logo-black.svg,
 * drawn in currentColor so it works on the dark ground without a white plate.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 102 96" aria-hidden className={cn("h-6 w-auto", className)}>
      <path d="M6 12H18L44 66L74 4H96L46 92L6 12Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="valueble.ai home"
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 rounded-md text-paper transition-opacity hover:opacity-85",
        className,
      )}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-paper text-ink">
        <LogoMark className="h-4" />
      </span>
      <span className="font-display text-[1.125rem] font-semibold tracking-[-0.02em]">
        valueble<span className="text-accent">.</span>ai
      </span>
    </Link>
  );
}
