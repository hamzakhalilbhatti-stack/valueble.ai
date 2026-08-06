import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Wordmark.
 *
 * The mark is four squares on a 2×2 grid with one missing — three products
 * plus the gap where the next one goes. It reads as a block at 20px, which is
 * the only size that actually matters.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn("size-5 shrink-0", className)}
      fill="currentColor"
      aria-hidden
    >
      <rect x="0" y="0" width="8.5" height="8.5" />
      <rect x="11.5" y="0" width="8.5" height="8.5" />
      <rect x="0" y="11.5" width="8.5" height="8.5" />
      <rect x="11.5" y="11.5" width="8.5" height="8.5" opacity="0.32" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 text-paper transition-opacity duration-200 hover:opacity-70",
        className,
      )}
    >
      <LogoMark />
      <span className="text-[1.375rem] leading-none tracking-[-0.01em]">valueble.ai</span>
    </Link>
  );
}
