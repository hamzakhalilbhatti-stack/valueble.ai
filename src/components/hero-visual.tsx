import { Check, MapPin, MessageCircle, PhoneIncoming, Star } from "lucide-react";
import { Waveform } from "@/components/product/voice-demo";
import { Parallax } from "@/components/motion";

/**
 * Hero visual: three floating product cards (a scraper result, a WhatsApp
 * order, a live call) layered with pointer parallax and a slow CSS float.
 * Pure HTML/CSS, so it costs nothing on LCP. Decorative: everything here is
 * explained in text beside it, so the block is aria-hidden.
 */
export function HeroVisual() {
  return (
    <Parallax className="relative mx-auto h-[30rem] w-full max-w-[34rem] select-none">
      <div aria-hidden className="absolute inset-6 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--mint)_45%,transparent),transparent)] blur-2xl" data-depth="-0.4" />

      {/* Scraper card */}
      <div aria-hidden className="absolute left-0 top-2 w-[86%]" data-depth="0.6">
        <div className="float-b panel">
          <div className="flex items-center gap-2 border-b border-rule px-4 py-2.5">
            <span className="grid size-6 place-items-center rounded-md bg-scan/12 text-scan">
              <MapPin className="size-3.5" />
            </span>
            <span className="text-xs font-medium text-paper">dentists in Austin</span>
            <span className="ui-label ml-auto text-scan">10 leads</span>
          </div>
          <table className="w-full text-left text-[0.75rem]">
            <tbody>
              {[
                ["Northside Dental", "4.8", 95],
                ["Lakeview Dentist Co.", "4.6", 90],
                ["Cedar Dental Studio", "4.4", 65],
              ].map(([n, r, s]) => (
                <tr key={n as string} className="border-b border-rule last:border-0">
                  <td className="px-4 py-2 font-medium text-paper">{n}</td>
                  <td className="px-2 py-2 text-mute">
                    <Star className="mr-1 inline size-3 -translate-y-px fill-warm text-warm" />
                    {r}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={(s as number) >= 80 ? "font-semibold text-scan" : "font-semibold text-warm"}>{s}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp order card */}
      <div aria-hidden className="absolute right-0 top-[10.5rem] w-[74%]" data-depth="1.1">
        <div className="float-a overflow-hidden rounded-2xl border border-rule shadow-[var(--shadow-lift)]">
          <div className="flex items-center gap-2.5 bg-[oklch(0.42_0.08_170)] px-4 py-2.5 text-white">
            <MessageCircle className="size-4" />
            <span className="text-xs font-semibold">Bella Napoli</span>
            <span className="ml-auto text-[0.6875rem] opacity-90">23:06</span>
          </div>
          <div className="wa-surface space-y-1.5 p-3 text-[0.75rem] leading-snug text-[oklch(0.22_0.02_150)]">
            <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-tr-none bg-[oklch(0.93_0.08_140)] px-2.5 py-1.5">2 large pepperoni + garlic bread</div>
            <div className="w-fit max-w-[90%] rounded-lg rounded-tl-none bg-white px-2.5 py-1.5">
              <span className="flex items-center gap-1 font-medium">
                <Check className="size-3.5 text-[oklch(0.5_0.12_160)]" /> Order confirmed · AED 114
              </span>
              <span className="text-[oklch(0.45_0.02_150)]">Arriving in about 35 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call card */}
      <div aria-hidden className="absolute bottom-2 left-[5%] w-[64%]" data-depth="1.6">
        <div className="float-c theme-dark rounded-2xl border border-rule px-4 py-3.5 shadow-[var(--shadow-lift)]">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-voice/15 text-voice">
              <PhoneIncoming className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-paper">Call answered · 21:42</p>
              <p className="ui-label mt-1 text-voice">AI voice agent · booking</p>
            </div>
          </div>
          <Waveform className="mt-3 h-8" />
        </div>
      </div>
    </Parallax>
  );
}
