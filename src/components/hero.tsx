"use client";

import dynamic from "next/dynamic";
import { BoxButton } from "@/components/ui";
import { whatsappUrl } from "@/lib/site";

/**
 * The block field is client-only: it touches WebGL on mount, and server
 * rendering it produces an empty canvas that flashes on hydrate. The fallback
 * is plain black, which is also the scene's background — so a device that
 * cannot run WebGL sees a deliberate empty frame rather than a broken one.
 */
const BlockField = dynamic(
  () => import("@/components/block-field").then((m) => m.BlockField),
  { ssr: false, loading: () => null },
);

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Scene sits behind everything, bleeding past the fold. */}
      <div className="absolute inset-0 -z-10">
        <BlockField className="h-full w-full" density={11} />
      </div>

      {/*
        Three scrims, because copy sits in two opposite corners and a single
        vignette can only protect one of them.

        1. A flat wash that drops the whole scene back toward black.
        2. A radial under the headline, top left.
        3. A soft one under the supporting paragraph, bottom right.

        Contrast was measured against the brightest frame of the animation, not
        a still — the blocks turn, and a highlight that is not there on load
        arrives four seconds later directly behind the text.
      */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/45" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(75%_60%_at_12%_28%,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.6)_45%,rgba(0,0,0,0)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_78%_78%,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0)_100%)]"
      />

      <div className="relative flex min-h-[100svh] flex-col justify-between pb-10 pt-40 md:pb-14 md:pt-48">
        <div className="mx-auto w-full max-w-[96rem] px-6 md:px-[3.25rem]">
          <h1 className="reveal text-hero max-w-[13ch] text-balance text-paper">
            AI that does the work you ran out of hours for
          </h1>
        </div>

        {/*
          The supporting paragraph sits low and right, well away from the
          headline. Two blocks of text in the same corner would read as a
          normal hero; separated across the frame, the emptiness between them
          is doing the work.
        */}
        <div className="mx-auto w-full max-w-[96rem] px-6 md:px-[3.25rem]">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <p className="reveal text-fine uppercase tracking-[0.14em] text-faint">
              Scroll to explore
            </p>

            <div className="max-w-[34rem] space-y-6 md:text-left">
              <p className="reveal text-sub text-paper">Find them. Answer them. Keep them.</p>
              <p className="reveal text-mute">
                Three systems that run the parts of a business nobody has time for — finding
                the customers, replying the moment they ask, and doing the repetitive job
                every single day without being reminded.
              </p>
              <div className="reveal">
                <BoxButton href={whatsappUrl}>Contact us</BoxButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
