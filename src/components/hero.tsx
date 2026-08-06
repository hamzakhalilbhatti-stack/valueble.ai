import { SceneBackdrop } from "@/components/scene-backdrop";
import { BoxButton } from "@/components/ui";
import { whatsappUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Copy sits in two opposite corners here, so both get a scrim. */}
      <SceneBackdrop density={5} parallax={1} focus="split" />

      <div className="relative flex min-h-[100svh] flex-col justify-between pb-10 pt-40 md:pb-14 md:pt-48">
        <div className="mx-auto w-full max-w-[96rem] px-6 md:px-[3.25rem]">
          <h1 className="reveal text-hero max-w-[13ch] text-balance text-paper">
            AI that does the work you ran out of hours for
          </h1>
        </div>

        {/*
          The supporting paragraph sits low and right, well away from the
          headline. Two blocks of text in the same corner would read as an
          ordinary hero; separated across the frame, the emptiness between them
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
