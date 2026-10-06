import { Check, MapPin, MessageCircle, PhoneIncoming } from "lucide-react";
import { Waveform } from "@/components/product/voice-demo";

/**
 * Hero visual: three floating product cards — a WhatsApp order, a scraper
 * result table and a live call. Pure HTML/CSS (no images, no WebGL), so it
 * costs nothing on LCP. The float animation is CSS and is switched off under
 * prefers-reduced-motion by the global rule. Decorative: the same content is
 * described in text on the page, so the whole block is aria-hidden.
 */
export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto flex w-full max-w-[34rem] select-none flex-col gap-3 sm:block sm:h-[30rem]">
      {/* Glow */}
      <div className="absolute inset-8 hidden rounded-full sm:block bg-[radial-gradient(closest-side,rgb(95_232_200/0.18),transparent)] blur-2xl" />

      {/* Scraper table card */}
      <div className="float-b w-[94%] sm:absolute sm:left-0 sm:top-4 sm:w-[86%]">
        <div className="panel">
          <div className="flex items-center gap-2 border-b border-rule px-4 py-2.5">
            <MapPin className="size-3.5 text-scan" />
            <span className="ui-label text-paper">leads.csv</span>
            <span className="ui-label ml-auto hidden text-faint sm:inline">restaurants · Dubai Marina</span>
          </div>
          <table className="w-full text-left text-[0.6875rem]">
            <tbody>
              {[
                ["Bella Napoli Pizzeria", "info@bellanapoli.ae", 95],
                ["The Curry Leaf", "hello@curryleaf.ae", 95],
                ["Saffron Kitchen", "— none published", 67],
              ].map(([n, e, s]) => (
                <tr key={n as string} className="border-b border-rule/70 last:border-0">
                  <td className="px-4 py-2 text-paper">{n}</td>
                  <td className="hidden px-2 py-2 text-mute sm:table-cell">{e}</td>
                  <td className="px-4 py-2 text-right">
                    <span className={(s as number) >= 80 ? "text-scan" : "text-faint"}>{s}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp order card */}
      <div className="float-a ml-auto w-[90%] sm:absolute sm:right-0 sm:top-[10.5rem] sm:w-[72%]">
        <div className="panel">
          <div className="flex items-center gap-2.5 border-b border-rule px-4 py-2.5">
            <span className="grid size-6 place-items-center rounded-full bg-warm/15 text-warm">
              <MessageCircle className="size-3.5" />
            </span>
            <span className="text-xs text-paper">Bella Napoli</span>
            <span className="ui-label ml-auto text-warm">23:06</span>
          </div>
          <div className="space-y-1.5 p-3 text-[0.6875rem] leading-relaxed">
            <div className="w-fit max-w-[85%] rounded-lg rounded-tl-sm bg-white/[0.05] px-2.5 py-1.5 text-mute">
              2 pepperoni large and a garlic bread
            </div>
            <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-tr-sm bg-warm/[0.13] px-2.5 py-1.5 text-paper">
              <span className="flex items-center gap-1">
                <Check className="size-3 text-warm" /> Order confirmed · AED 114 · ~35 min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live call card */}
      <div className="float-c ml-[4%] w-[80%] sm:absolute sm:bottom-6 sm:left-[6%] sm:ml-0 sm:w-[64%]">
        <div className="panel px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-voice/15 text-voice">
              <PhoneIncoming className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-paper">Call answered · 21:42</p>
              <p className="ui-label mt-1 text-voice">AI voice agent</p>
            </div>
          </div>
          <Waveform className="mt-3 h-7" />
        </div>
      </div>
    </div>
  );
}
