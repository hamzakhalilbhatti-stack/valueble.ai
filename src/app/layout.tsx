import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealDriver } from "@/components/reveal";
import { ScrollProgress } from "@/components/motion";
import { JsonLd, organizationLd, personLd } from "@/components/json-ld";
import { site } from "@/lib/site";

// Display: Bricolage Grotesque — characterful, tight at large sizes.
// Body: Geist. Mono: Geist Mono for UI labels inside product mocks.
// All self-hosted by next/font at build time; no request to Google at runtime.
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Valueble AI | AI Agents, WhatsApp Ordering and Lead Tools",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder, url: `${site.url}/about` }],
  creator: site.founder,
  publisher: site.legalName,
  openGraph: { type: "website", locale: "en_US", siteName: site.name, url: site.url },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f8f9fb",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks the document JS-capable before first paint so scroll reveals can
          start hidden. Crawlers, no-JS visitors and reduced-motion users see
          everything. (The old global 2.5s "reveal-done" watchdog is gone: it
          force-showed every section before anyone scrolled, which is why the
          scroll animations never played.)
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js");`,
          }}
        />
      </head>
      <body>
        <JsonLd data={[organizationLd, personLd]} />
        <RevealDriver />
        <ScrollProgress />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
