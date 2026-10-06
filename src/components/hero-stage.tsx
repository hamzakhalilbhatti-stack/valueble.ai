import Image from "next/image";
import { MapPin, MessageCircle, PhoneCall, PhoneIncoming, Search, Star, Workflow } from "lucide-react";
import { ScrollScene } from "@/components/motion";
import { Waveform } from "@/components/product/voice-demo";
import { Button } from "@/components/ui";
import { contact, site } from "@/lib/site";

/**
 * Home hero (dark pass).
 *
 * Centred headline under a cone of light, lines sliding up out of a mask,
 * then a tilted "console" showing the products at work. ScrollScene
 * (mode "through") writes --p as the hero passes; the console straightens
 * from 24 degrees to flat and the side widgets drift outward at different depths.
 *
 * Everything in the console is sample UI for illustration (labelled), built
 * from the same facts as the product pages. No metrics, no client names.
 */
export function HeroStage() {
  const [first, ...rest] = site.headline.split(". ");
  const second = rest.join(". ").replace(/\.$/, "");
  const lastSpace = second.lastIndexOf(" ");
  const secondLead = second.slice(0, lastSpace);
  const secondTail = second.slice(lastSpace + 1);

  return (
    <section id="top" className="relative isolate -mt-[4.25rem] overflow-hidden pt-[4.25rem] md:-mt-20 md:pt-20" data-od-id="home-hero">
      <div aria-hidden className="spotlight" />
      <div aria-hidden className="grid-fade" />

      <div className="container-site relative pt-14 text-center md:pt-20">
        <p className="word-in mx-auto inline-flex items-center gap-2 rounded-full border border-rule bg-ink-2/70 py-1.5 pl-1.5 pr-4 text-[0.8125rem] text-mute backdrop-blur">
          <span style={{ ["--i" as string]: 0 }} className="inline-flex items-center gap-2">
            <span aria-hidden className="grid size-6 place-items-center rounded-full bg-accent font-display text-[0.625rem] font-bold text-on-accent">
              HK
            </span>
            AI automation studio, run by <span className="font-medium text-paper">one founder</span>
          </span>
        </p>

        <h1 className="mx-auto mt-8 max-w-[15ch] text-[clamp(2.75rem,7.4vw,6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          <span className="line-mask">
            <span style={{ ["--i" as string]: 0 }} className="text-paper">
              {first}.
            </span>
          </span>
          <span className="line-mask">
            <span style={{ ["--i" as string]: 1 }}>
              <span className="text-sheen">{secondLead}</span> <span className="serif-flair text-accent">{secondTail}.</span>
            </span>
          </span>
        </h1>

        <p className="word-in mx-auto mt-7 max-w-[40ch] text-sub text-mute">
          <span style={{ ["--i" as string]: 4 }}>{site.tagline}</span>
        </p>

        <div className="word-in mt-9 flex justify-center">
          <span style={{ ["--i" as string]: 5 }} className="flex flex-col gap-3 sm:flex-row">
            <Button href={contact.bookingGeneral} data-od-id="hero-book-call">
              Book a call
            </Button>
            <Button href="#products" variant="secondary" data-od-id="hero-see-products">
              See the products
            </Button>
          </span>
        </div>
      </div>

      {/* Tilted console */}
      <ScrollScene mode="through" className="tilt-stage relative mt-14 pb-6 md:mt-20">
        <div className="container-site !max-w-[68rem]">
          <div className="relative">
            <div aria-hidden className="absolute -left-2 top-[6%] z-20 hidden md:block xl:-left-24 [transform:translate3d(calc(var(--p,0)*-60px),calc(var(--p,0)*-80px),0)]">
              <div className="float-a nav-pill flex items-center gap-3 rounded-2xl p-3">
                <span className="grid size-9 place-items-center rounded-xl bg-voice text-on-accent">
                  <PhoneIncoming className="size-4" />
                </span>
                <span className="text-left">
                  <span className="block text-[0.6875rem] text-faint">Call answered · 11:04pm</span>
                  <Waveform className="h-5 w-28" />
                </span>
              </div>
            </div>
            <div aria-hidden className="absolute -right-2 top-[20%] z-20 hidden md:block xl:-right-20 [transform:translate3d(calc(var(--p,0)*70px),calc(var(--p,0)*-50px),0)]">
              <div className="float-b nav-pill rounded-2xl p-3 text-left">
                <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-paper">
                  <span className="grid size-7 place-items-center rounded-lg bg-wa text-on-accent">
                    <MessageCircle className="size-3.5" />
                  </span>
                  2× Margherita (L)
                </span>
                <span className="mt-1 block text-[0.6875rem] text-faint">Total sent · confirmed on WhatsApp</span>
              </div>
            </div>
            <div aria-hidden className="absolute -left-4 bottom-[14%] z-20 hidden lg:block xl:-left-16 [transform:translate3d(calc(var(--p,0)*-40px),calc(var(--p,0)*40px),0)]">
              <div className="float-c grid size-28 place-items-center rounded-full bg-accent text-center text-on-accent shadow-[0_20px_50px_-18px_var(--accent)]">
                <span>
                  <span className="block font-display text-2xl font-bold leading-none">$200</span>
                  <span className="mt-1 block text-[0.6875rem] font-medium leading-tight">
                    one-time
                    <br />
                    scraper
                  </span>
                </span>
              </div>
            </div>

            <div className="tilt-screen relative z-10 rounded-[1.75rem] border border-rule-strong bg-ink-2 p-2 shadow-[0_60px_120px_-40px_oklch(0_0_0/0.9)] md:rounded-[2.25rem] md:p-3">
              <Console />
            </div>
            <div aria-hidden className="absolute inset-x-[10%] -bottom-10 -z-10 h-40 rounded-full bg-accent/15 blur-3xl" />
          </div>
        </div>
      </ScrollScene>
    </section>
  );
}

const NAV = [
  { Icon: PhoneCall, t: "Voice Agent", on: false },
  { Icon: Search, t: "Lead Scraper", on: true },
  { Icon: MessageCircle, t: "OrderRise", on: false },
  { Icon: Workflow, t: "Custom Agents", on: false },
];
const LEADS = [
  { n: "Bright Smile Dental", r: "4.8", e: "hello@…", s: 92 },
  { n: "Austin Family Dentistry", r: "4.6", e: "front@…", s: 86 },
  { n: "Lakeline Dental Care", r: "4.7", e: "—", s: 71 },
  { n: "Eastside Smiles", r: "4.4", e: "info@…", s: 64 },
];
const BARS = [38, 62, 48, 80, 56, 92, 70];

/** Static console mock with sample data (demo names, not clients). */
function Console() {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-rule bg-ink text-left md:rounded-[1.6rem]">
      <p className="sr-only">Illustration: valueble.ai products running side by side, with sample data.</p>
      <div aria-hidden className="flex items-center gap-2 border-b border-rule px-4 py-3">
        <span className="size-2.5 rounded-full bg-rule-strong" />
        <span className="size-2.5 rounded-full bg-rule-strong" />
        <span className="size-2.5 rounded-full bg-rule-strong" />
        <span className="ml-3 rounded-md bg-ink-2 px-3 py-1 text-[0.6875rem] text-faint">valueble.ai · sample data</span>
      </div>
      <div aria-hidden className="grid md:grid-cols-[13rem_1fr]">
        <ul className="hidden border-r border-rule p-3 md:block">
          {NAV.map(({ Icon, t, on }) => (
            <li key={t} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.8125rem] ${on ? "bg-ink-3 text-paper" : "text-faint"}`}>
              <Icon className="size-4" /> {t}
            </li>
          ))}
        </ul>
        <div className="grid gap-3 p-3 md:p-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-rule bg-ink-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.8125rem] font-medium text-paper">dentists in Austin</p>
              <span className="rounded-full bg-scan/15 px-2 py-0.5 text-[0.6875rem] text-scan">Scored · CSV ready</span>
            </div>
            <ul className="mt-3 divide-y divide-rule">
              {LEADS.map((l) => (
                <li key={l.n} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2 text-[0.75rem] sm:grid-cols-[1fr_auto_4rem_auto]">
                  <span className="truncate text-paper">{l.n}</span>
                  <span className="flex items-center gap-1 text-faint">
                    <Star className="size-3 fill-warm text-warm" />
                    {l.r}
                  </span>
                  <span className="hidden text-faint sm:block">{l.e}</span>
                  <span className="w-12 rounded-md bg-ink-3 py-0.5 text-center font-medium tabular-nums text-paper">{l.s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-rule bg-ink-2 p-4">
              <p className="flex items-center gap-2 text-[0.75rem] text-faint">
                <MapPin className="size-3.5 text-scan" /> Must-have email · min rating 4.0
              </p>
              <div className="mt-3 flex h-14 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <span key={i} className="block flex-1 rounded-md bg-accent" style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.28 }} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-rule bg-ink-2 p-4">
              <Image src="/images/hero-caller.webp" width={417} height={600} alt="" className="size-11 shrink-0 rounded-full object-cover object-top" />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.75rem] text-faint">Voice agent · booking</span>
                <span className="block truncate text-[0.8125rem] text-paper">“Thursday at 4 works. Booked.”</span>
              </span>
              <Waveform className="h-6 w-16 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
