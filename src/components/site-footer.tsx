import Link from "next/link";
import { Logo } from "@/components/logo";
import { BoxButton } from "@/components/ui";
import { contact, nav, products, site, whatsappUrl } from "@/lib/site";

/**
 * Footer. Two bands: the wordmark facing the single primary action, then the
 * link columns and legal text well below it. The gap between the two bands is
 * deliberately large — it is what stops the footer reading as a sitemap.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="pb-16 pt-24 md:pb-20 md:pt-32">
      <div className="mx-auto max-w-[96rem] px-6 md:px-[3.25rem]">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <BoxButton href={whatsappUrl}>Contact us</BoxButton>
        </div>

        <div className="mt-24 grid gap-10 md:mt-32 md:grid-cols-4">
          <div>
            <p className="text-paper">What I build</p>
            <ul className="mt-4 space-y-2">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-mute transition-colors duration-200 hover:text-paper"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-paper">Company</p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-mute transition-colors duration-200 hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-paper">Reach me</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mute transition-colors duration-200 hover:text-paper"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mute transition-colors duration-200 hover:text-paper"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all text-mute transition-colors duration-200 hover:text-paper"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-fine text-faint">
            <p>
              © {year} {site.legalName}. Built and run by {site.founder}.
            </p>
            <p>
              Maps Lead Scraper reads the public Google Maps interface and public business
              websites. It uses no paid API and bypasses no access control.
            </p>
            <p>Not affiliated with Google or WhatsApp.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
