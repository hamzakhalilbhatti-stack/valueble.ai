import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { contact, getProduct, productOrder, site, whatsappUrl } from "@/lib/site";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const linkCls = "rounded text-mute transition-colors hover:text-paper";
const iconBtn =
  "grid size-11 place-items-center rounded-full border border-rule-strong text-paper transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-ink-3";

/** Dark footer: one of the few deliberate dark bands on a light site. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-dark relative" data-od-id="site-footer">
      <div className="container-site py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-mute">{site.tagline}</p>
            <ul className="mt-6 flex gap-2" aria-label="Social and contact">
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Message valueble.ai on WhatsApp" className={iconBtn}>
                  <MessageCircle aria-hidden className="size-5" />
                </a>
              </li>
              <li>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Hamza Khalil Bhatti on LinkedIn" className={iconBtn}>
                  <LinkedInIcon className="size-[1.125rem]" />
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} aria-label="Email valueble.ai" className={iconBtn}>
                  <Mail aria-hidden className="size-5" />
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Products">
            <p className="text-sm font-medium text-paper">Products</p>
            <ul className="mt-4 space-y-3 text-[0.9375rem]">
              {productOrder.map((slug) => {
                const p = getProduct(slug)!;
                return (
                  <li key={slug}>
                    <Link href={p.path} className={linkCls}>
                      {p.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="text-sm font-medium text-paper">Company</p>
            <ul className="mt-4 space-y-3 text-[0.9375rem]">
              <li><Link href="/pricing" className={linkCls}>Pricing</Link></li>
              <li><Link href="/about" className={linkCls}>About Hamza</Link></li>
              <li><Link href="/blog" className={linkCls}>Blog</Link></li>
              <li><Link href="/contact" className={linkCls}>Contact</Link></li>
            </ul>
          </nav>

          <div>
            <p className="text-sm font-medium text-paper">Reach me</p>
            <ul className="mt-4 space-y-3 text-[0.9375rem]">
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  WhatsApp {contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={`${linkCls} break-all`}>
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-rule pt-8 text-fine text-faint md:flex-row md:justify-between">
          <p>
            © {year} {site.legalName}. Built and run by {site.founder}.
          </p>
          <p className="max-w-xl md:text-right">
            Maps Lead Scraper reads the public Google Maps interface and public business websites. It uses no paid API
            and bypasses no access control. Not affiliated with Google or WhatsApp. Photos: StockSnap (CC0).
          </p>
        </div>
      </div>
    </footer>
  );
}
