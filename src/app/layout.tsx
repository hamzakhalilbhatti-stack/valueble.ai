import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteChrome } from "@/components/site-chrome";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SiteBackdrop } from "@/components/webgl/site-backdrop";
import { site } from "@/lib/site";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "AI agents",
    "WhatsApp AI agent",
    "Google Maps scraper",
    "lead generation tools",
    "business automation",
    "AI agency",
  ],
  authors: [{ name: site.founder }],
  creator: site.founder,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks the document as JS-capable during parsing, before first paint.
          The scroll-reveal styles key off this class, so content stays visible
          if scripts never run. See globals.css.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js");setTimeout(function(){document.documentElement.classList.add("reveal-done")},2500);`,
          }}
        />
      </head>
      <body className="text-bone">
        {/* The asset review route renders bare — no chrome, no production scene. */}
        <SiteChrome
          chrome={
            <>
              <SmoothScroll />
              <ScrollProgress />

              {/* Fixed WebGL layer + preloader. z-0; everything below is z-10. */}
              <SiteBackdrop />

              <div className="relative z-10 flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </>
          }
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
