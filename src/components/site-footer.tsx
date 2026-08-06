import Link from "next/link";
import { contact, products, site, whatsappUrl } from "@/lib/site";
import { Container, Wordmark } from "@/components/ui";
import { Reveal, RevealLines } from "@/components/reveal";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-deep/60 text-bone backdrop-blur-[3px]">
      <Container className="py-24 md:py-32 lg:py-40">
        <RevealLines
          as="h2"
          lines={["Tell me which twenty hours", "a month you want back."]}
          className="font-display text-headline max-w-5xl text-balance"
        />

        <Reveal delay={220} className="mt-12 flex flex-col gap-4 sm:flex-row">
          {/* Internal route now, so no new tab. */}
          <Link
            href={contact.bookingGeneral}
            className="group inline-flex items-center justify-between gap-8 bg-bone px-7 py-5 text-void transition-colors duration-500 hover:bg-amber hover:text-void sm:justify-start"
          >
            <span className="tracking-tight">Book a discovery call</span>
            <span
              aria-hidden
              className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-between gap-8 border border-white/25 px-7 py-5 transition-colors duration-500 hover:border-bone sm:justify-start"
          >
            <span className="tracking-tight">Message on WhatsApp</span>
            <span
              aria-hidden
              className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </Reveal>

        <div className="mt-24 grid gap-12 border-t border-white/12 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark className="text-bone" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/55">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Products">
            <p className="label text-bone/40">Products</p>
            <ul className="mt-5 space-y-3">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm text-bone/75 transition-colors duration-300 hover:text-amber"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="label text-bone/40">Company</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-bone/75 transition-colors duration-300 hover:text-amber"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-bone/75 transition-colors duration-300 hover:text-amber"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/#approach"
                  className="text-sm text-bone/75 transition-colors duration-300 hover:text-amber"
                >
                  Approach
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Elsewhere">
            <p className="label text-bone/40">Elsewhere</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bone/75 transition-colors duration-300 hover:text-amber"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bone/75 transition-colors duration-300 hover:text-amber"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm break-all text-bone/75 transition-colors duration-300 hover:text-amber"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/12 pt-8 text-xs text-bone/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <p>
            Built by {site.founder} in Pakistan{/* TODO: confirm location line */}
          </p>
        </div>
      </Container>
    </footer>
  );
}
