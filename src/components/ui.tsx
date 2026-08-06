import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-16", className)}>
      {children}
    </div>
  );
}

type SectionTone = "void" | "surface" | "deep";

/**
 * Every tone is transparent — the scene runs behind the entire page, uninterrupted.
 *
 * The heavier tones are translucent veils, not solid fills. They buy back text
 * contrast where copy is dense without ever closing the view, which is what the
 * old opaque bands were doing.
 */
const sectionTone: Record<SectionTone, string> = {
  void: "text-bone",
  surface: "bg-surface/40 text-bone backdrop-blur-[2px]",
  deep: "bg-surface-deep/55 text-bone backdrop-blur-[3px]",
};

export function Section({
  children,
  id,
  tone = "void",
  className,
}: {
  children: ReactNode;
  id?: string;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("py-24 md:py-32 lg:py-44", sectionTone[tone], className)}
    >
      {children}
    </section>
  );
}

/** Numbered or lettered section marker with a hairline, e.g. "— 02 / Approach". */
export function Eyebrow({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <p className={cn("label flex items-center gap-3 text-bone-faint", className)}>
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      {index ? <span className="text-amber">{index}</span> : null}
      <span>{children}</span>
    </p>
  );
}

function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

type ActionProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
};

/** Primary conversion control. Deliberately square — pills read SaaS, not editorial. */
export function Action({ href, children, variant = "solid", className }: ActionProps) {
  const classes = cn(
    "group inline-flex items-center gap-3 px-7 py-4 text-sm font-medium tracking-tight transition-colors duration-500",
    variant === "solid" && "bg-bone text-void hover:bg-amber hover:text-void",
    variant === "outline" && "border border-rule-strong text-bone hover:border-bone hover:bg-bone hover:text-void",
    variant === "ghost" && "text-bone hover:text-amber",
    className,
  );

  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden
        className="translate-x-0 transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </>
  );

  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

/** Inline text link with a rule that draws itself in on hover. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const classes = cn(
    "group inline-flex items-center gap-2 text-sm tracking-tight text-bone transition-colors duration-300 hover:text-amber",
    className,
  );

  const inner = (
    <>
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:origin-left group-hover:scale-x-100"
        />
      </span>
      <span
        aria-hidden
        className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </>
  );

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-rule", className)} />;
}

/** Typographic wordmark. Stands in for a logo until there is one worth using. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-2xl leading-none tracking-tight md:text-[1.7rem]",
        className,
      )}
    >
      valueble<span className="text-amber">.ai</span>
    </span>
  );
}
