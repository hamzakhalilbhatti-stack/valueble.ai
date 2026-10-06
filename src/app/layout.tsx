import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealDriver } from "@/components/reveal";
import { GlowTracker, ScrollProgress } from "@/components/motion";
import { JsonLd, organizationLd, personLd } from "@/components/json-ld";
import { site } from "@/lib/site";

// Display: Instrument Sans, tight and machined at large sizes (Apple-style
// compression). Instrument Serif italic is the single flair word per headline.
// Body: Geist. Mono: Geist Mono for UI labels inside product mocks.
// All self-hosted by next/font at build time; no request to Google at runtime.
const display = Instrument_Sans({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif-face",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
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
  themeColor: "#0b0b0e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${geist.variable} ${geistMono.variable}`}
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
        <div aria-hidden className="aurora">
          <i />
          <i />
          <i />
          <i />
        </div>
        <JsonLd data={[organizationLd, personLd]} />
        <RevealDriver />
        <ScrollProgress />
        <GlowTracker />
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
