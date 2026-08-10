import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

/** Exact V mark from the ValuebleAI brand asset. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-6 shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M6,12 L18,12 L44,66 L74,4 L96,4 L46,92 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="valueble.ai home"
      className={cn(
        "inline-flex items-center transition-opacity duration-200 hover:opacity-70",
        className,
      )}
    >
      <Image
        src="/brand/valueble-logo-white.svg"
        alt="valueble.ai"
        width={1800}
        height={520}
        className="h-12 w-auto sm:h-14"
        priority
      />
    </Link>
  );
}
