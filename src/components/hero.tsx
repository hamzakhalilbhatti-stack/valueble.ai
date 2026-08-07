import Link from "next/link";
import { SceneBackdrop } from "@/components/scene-backdrop";
import { ArrowUpRight, BoxButton } from "@/components/ui";
import { products, whatsappUrl } from "@/lib/site";

/**
 * Hero.
 *
 * The headline names what a visitor can actually buy, in the words they would
 * use themselves. The previous version — "AI that does the work you ran out of
 * hours for" — described a feeling, and a restaurant owner reading it had no
 * way to tell whether this site sold anything relevant to them.
 *
 * The three index rows sit in the first viewport for the same reason. Two of
 * the products are bought by completely different people, and the fastest way
 * to lose both is to make each of them scroll to find out which half of the
 * business is theirs.
 */

const ACCENT: Record<string, string> = {
  "lead-extractor": "text-scan",
  orderrise: "text-warm",
  "ai-agents": "text-mind",
};

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <SceneBackdrop density={5} parallax={1} focus="split" />

      <div className="relative flex min-h-[100svh] flex-col justify-between pb-10 pt-32 md:pb-14 md:pt-40">
        <div className="mx-auto w-full max-w-[96rem] px-6 md:px-[3.25rem]">
          <p className="reveal mb-6 text-fine uppercase tracking-[0.14em] text-faint">
            valueble.ai — AI systems for businesses and agencies
          </p>

          {/*
            Two lines, not three. The product index below has to sit in the
            first viewport — a visitor who cannot tell within one screen which
            of three products is theirs is a visitor who leaves.
          */}
          <h1 className="reveal text-hero max-w-[18ch] text-balance text-paper">
            Find the customers. Answer them instantly.
          </h1>

          <p className="reveal mt-6 max-w-[48ch] text-sub text-mute">
            Three working products — a lead scraper, a WhatsApp ordering agent, and custom
            automation built around one process you already run.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[96rem] px-6 md:px-[3.25rem]">
          {/*
            The fork. Each row states who it is for before it states what it is,
            because the visitor's first question is "is this for me", not "what
            does it do".
          */}
          <ul className="mb-8 grid gap-px border-t border-rule sm:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug} className="reveal">
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex h-full flex-col gap-1 py-4 pr-4 transition-opacity duration-300 hover:opacity-65"
                >
                  <span className={`ui-label ${ACCENT[product.slug]}`}>{product.index}</span>
                  <span className="mt-1 flex items-center gap-2 text-paper">
                    {product.name}
                    <ArrowUpRight className="size-3 shrink-0 opacity-40 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </span>
                  <span className="text-mute">{product.audience}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="reveal text-fine uppercase tracking-[0.14em] text-faint">
              Scroll to see them working
            </p>
            <div className="reveal">
              <BoxButton href={whatsappUrl}>Tell me what you need</BoxButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
