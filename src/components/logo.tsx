import Link from "next/link";

import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/valueble-logo-black.svg"
      alt=""
      aria-hidden="true"
      className={cn("h-7 w-auto", className)}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Valueble AI home"
      className={cn(
        "inline-flex items-center rounded-sm bg-[#f4f4f6] px-3 py-2 transition-opacity duration-200 hover:opacity-80",
        className,
      )}
    >
      <img
        src="/brand/valueble-logo-black.svg"
        alt="Valueble AI"
        className="h-7 w-auto"
      />
    </Link>
  );
}
