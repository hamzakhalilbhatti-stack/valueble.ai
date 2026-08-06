import { SceneBackdrop } from "@/components/scene-backdrop";
import { BoxButton } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden pb-24 pt-40">
      <SceneBackdrop density={3} seed={4040} />
      <div className="rail">
        <p className="eyebrow">404</p>
        <div className="measure">
          <h1 className="text-hero max-w-[14ch] text-balance text-paper">
            That page does not exist
          </h1>
          <p className="mt-8 max-w-[46ch] text-sub text-mute">
            It may have moved, or the link may be wrong. Everything on this site is one click
            from the home page.
          </p>
          <div className="mt-10">
            <BoxButton href="/">Back to home</BoxButton>
          </div>
        </div>
      </div>
    </section>
  );
}
