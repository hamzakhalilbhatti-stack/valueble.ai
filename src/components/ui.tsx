import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The boxed action. One button style on the whole site — a thin outlined box
 * with a split arrow cell, inverting to solid white on hover.
 */
export function BoxButton({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);

  const inner = (
    <>
      <span className="px-6 py-3.5">{children}</span>
      <span className="grid w-[3.25rem] shrink-0 place-items-center self-stretch border-l border-current">
        <ArrowUpRight />
      </span>
    </>
  );

  const classes = cn(
    "group inline-flex items-stretch border border-paper text-paper",
    "transition-colors duration-300 ease-[var(--ease-out)]",
    "hover:bg-paper hover:text-ink",
    className,
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
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

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" />
    </svg>
  );
}

/**
 * The page's structural unit: a label on the left rail, content beside it.
 * Every section on the site is one of these, which is what keeps the vertical
 * rhythm identical from the top of the page to the bottom.
 */
export function Section({
  label,
  children,
  className,
  id,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-24 md:py-36", className)}>
      <div className="rail">
        {/* Below the rail breakpoint the grid is a single column, so an empty
            placeholder would occupy a row and open a gap. */}
        {label ? (
          <p className="eyebrow reveal">{label}</p>
        ) : (
          <span aria-hidden className="hidden min-[900px]:block" />
        )}
        <div className="measure">{children}</div>
      </div>
    </section>
  );
}

/** Section headline. 35/45 on desktop — never larger, never bolder. */
export function Head({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-head reveal max-w-[19ch] text-balance", className)}>{children}</h2>
  );
}

/** Body copy at the reading measure. */
export function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("reveal max-w-[62ch] text-mute", className)}>{children}</p>;
}

/** The reference's list style: plain discs, generous leading, no icons. */
export function List({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("reveal ml-5 max-w-[62ch] list-disc space-y-1.5 text-mute", className)}>
      {items.map((item) => (
        <li key={item} className="pl-1.5">
          {item}
        </li>
      ))}
    </ul>
  );
}
