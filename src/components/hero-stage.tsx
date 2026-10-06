import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, PhoneIncoming, Star } from "lucide-react";
import { ScrollScene } from "@/components/motion";
import { Waveform } from "@/components/product/voice-demo";
import { Button } from "@/components/ui";
import { contact, site } from "@/lib/site";

/**
 * Home hero: a framed glass "window" on the yellow canvas with one hero
 * object — a real photo of a customer on her phone, cut out — annotated
 * with scan boxes that show what valueble.ai does with that moment.
 *
 * Scroll: ScrollScene writes --p (0→1) as the hero leaves the viewport.
 * The photo pushes in, the copy lifts away faster than the page, and the
 * floating product chips fan out at different depths. Transform/opacity only.
 *
 * Every number on the right rail is a real fact from the offers (prices,
 * hours), not a performance claim.
 */
export function HeroStage() {
  const [first, ...rest] = site.headline.split(". ");
  const second = rest.join(". ").replace(/\.$/, "");
  const lastSpace = second.lastIndexOf(" ");
  const secondLead = second.slice(0, lastSpace);
  const secondTail = second.slice(lastSpace + 1);

  return (
    <ScrollScene as="section" mode="exit" id="top" className="relative pt-3 md:pt-5" data-od-id="home-hero">
      <div className="container-site !max-w-[84rem]">
        <div
          className="hero-frame [transform:scale(calc(1_-_var(--p,0)*0.05))] [transform-origin:50%_0]"
        >
          {/* soft colour wash inside the frame */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_52%_40%,color-mix(in_oklab,var(--sun)_55%,transparent),transparent_70%),radial-gradient(30%_40%_at_85%_80%,color-mix(in_oklab,var(--coral)_22%,transparent),transparent_70%),radial-gradient(30%_40%_at_10%_90%,color-mix(in_oklab,var(--violet)_16%,transparent),transparent_70%)]" />

          <div className="grid gap-8 px-5 pb-0 pt-8 md:px-10 md:pt-12 lg:min-h-[min(46rem,calc(100svh-7rem))] lg:grid-cols-[1.05fr_0.95fr_0.55fr] lg:items-end lg:gap-4 lg:px-12">
            {/* Copy */}
            <div className="relative z-10 self-center lg:pb-16 [transform:translate3d(0,calc(var(--p,0)*-90px),0)] [opacity:calc(1_-_var(--p,0)*1.4)]">
              <p className="glass inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-[0.8125rem] text-mute shadow-[var(--shadow-card)]">
                <span aria-hidden className="grid size-7 place-items-center rounded-full bg-paper font-display text-[0.6875rem] font-semibold text-ink">
                  HK
                </span>
                Built and supported by <span className="font-medium text-paper">one founder</span>
              </p>
              <h1 className="word-in mt-7 text-hero">
                <span style={{ ["--i" as string]: 0 }}>{first}.</span>{" "}
                <span className="tone-2" style={{ ["--i" as string]: 2 }}>
                  {secondLead}
                </span>{" "}
                <span className="serif-flair pr-1" style={{ ["--i" as string]: 3 }}>
                  {secondTail}.
                </span>
              </h1>
              <p className="mt-6 max-w-[34ch] text-sub text-mute">{site.tagline}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={contact.bookingGeneral} data-od-id="hero-book-call">
                  Book a call
                </Button>
                <Button href="#products" variant="secondary" data-od-id="hero-see-products">
                  See the products
                </Button>
              </div>
            </div>

            {/* Hero object */}
            <div className="relative mx-auto w-full max-w-[22rem] self-end sm:max-w-[26rem] lg:max-w-none">
              <div aria-hidden className="absolute inset-x-[8%] bottom-0 top-[12%] -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--sun)_80%,transparent),transparent)] blur-2xl" />
              <div className="relative [transform:translate3d(0,calc(var(--p,0)*40px),0)_scale(calc(1_+_var(--p,0)*0.12))] [transform-origin:50%_100%]">
                <Image
                  src="/images/hero-caller.webp"
                  width={417}
                  height={600}
                  priority
                  sizes="(min-width: 1024px) 420px, 80vw"
                  alt="A smiling customer holding her phone, about to place an order"
                  className="h-auto w-full [mask-image:linear-gradient(to_bottom,#000_78%,transparent)]"
                />
                {/* Scan annotations (decorative; the copy says the same thing) */}
                <div aria-hidden className="scan-box left-[44%] top-[66%] h-[11%] w-[20%]">
                  <span>New WhatsApp order</span>
                </div>
                <div aria-hidden className="scan-box left-[33%] top-[12%] h-[27%] w-[34%] max-sm:hidden">
                  <span>Customer, 11pm Friday</span>
                </div>

                {/* Floating product chips at different depths */}
                <div aria-hidden className="absolute -left-4 top-[30%] sm:-left-10 [transform:translate3d(calc(var(--p,0)*-70px),calc(var(--p,0)*-30px),0)]">
                  <div className="float-a glass flex items-center gap-2.5 rounded-2xl px-3 py-2.5 shadow-[var(--shadow-lift)]">
                    <span className="grid size-8 place-items-center rounded-xl bg-voice text-white">
                      <PhoneIncoming className="size-4" />
                    </span>
                    <span>
                      <span className="block text-[0.6875rem] text-faint">Call answered</span>
                      <Waveform className="h-5 w-24" />
                    </span>
                  </div>
                </div>
                <div aria-hidden className="absolute -right-3 top-[46%] sm:-right-8 [transform:translate3d(calc(var(--p,0)*80px),calc(var(--p,0)*-20px),0)]">
                  <div className="float-b glass rounded-2xl px-3 py-2.5 shadow-[var(--shadow-lift)]">
                    <span className="flex items-center gap-2 text-[0.75rem] font-medium text-paper">
                      <span className="grid size-6 place-items-center rounded-lg bg-wa text-white">
                        <MessageCircle className="size-3.5" />
                      </span>
                      2× Margherita (L)
                    </span>
                    <span className="mt-1 block text-[0.6875rem] text-faint">Total sent · confirmed</span>
                  </div>
                </div>
                <div aria-hidden className="absolute bottom-[14%] -left-2 sm:-left-6 [transform:translate3d(calc(var(--p,0)*-50px),calc(var(--p,0)*30px),0)]">
                  <div className="float-c glass flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-[0.75rem] shadow-[var(--shadow-lift)]">
                    <span className="grid size-6 place-items-center rounded-full bg-scan text-white">
                      <MapPin className="size-3.5" />
                    </span>
                    <span className="font-medium text-paper">Lead scored 92</span>
                    <Star className="size-3 fill-warm text-warm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Fact rail — real prices and hours only */}
            <ul
              aria-label="Prices at a glance"
              className="relative z-10 grid grid-cols-3 gap-2 pb-6 lg:grid-cols-1 lg:gap-6 lg:self-center lg:pb-16 [transform:translate3d(0,calc(var(--p,0)*-60px),0)]"
            >
              {[
                { v: "24/7", k: "AI Voice Agent", d: "answers your phone", href: "/voice-agent" },
                { v: "$50", k: "OrderRise", d: "a month, WhatsApp orders", href: "/orderrise" },
                { v: "$200", k: "Maps Lead Scraper", d: "one-time, no subscription", href: "/maps-lead-scraper" },
              ].map((f) => (
                <li key={f.k} className="lg:text-right">
                  <Link href={f.href} className="group block rounded-2xl p-2 transition-colors hover:bg-ink-2/70 lg:p-0 lg:hover:bg-transparent">
                    <span className="block font-display text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-paper md:text-[2.5rem]">{f.v}</span>
                    <span className="mt-1.5 block text-[0.75rem] font-medium text-paper underline-offset-4 group-hover:underline md:text-sm">{f.k}</span>
                    <span className="block text-[0.6875rem] leading-snug text-faint md:text-[0.8125rem]">{f.d}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}
