"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";

/**
 * The block field plus the scrims that keep copy legible over it.
 *
 * Isolated into its own client component so the pages that use it can stay
 * server-rendered — only the canvas crosses the boundary, not the headline.
 *
 * The scene is client-only: it touches WebGL on mount, and server-rendering it
 * produces an empty canvas that flashes on hydrate. The fallback is plain
 * black, which is also the scene's own background, so a device that cannot run
 * WebGL sees a deliberate empty frame rather than a broken one.
 */
const BlockField = dynamic(
  () => import("@/components/block-field").then((m) => m.BlockField),
  { ssr: false, loading: () => null },
);

export function SceneBackdrop({
  className,
  density = 4,
  seed,
  scale = 1,
  parallax = 0,
  formation = 0.72,
  /** Where the copy sits, so the heavy scrim goes under it. */
  focus = "measure",
}: {
  className?: string;
  density?: number;
  seed?: number;
  scale?: number;
  parallax?: number;
  /**
   * How resolved the blocks sit. Product and about pages default to mostly
   * settled — the visitor is already past the pitch, so the scene should read
   * as the finished system rather than replay the argument for it.
   */
  formation?: number;
  /**
   * `split`  — home hero: headline far left, support copy bottom right.
   * `measure`— every other page: copy in the rail's content column, which
   *            starts around 27% and runs to about 68%. Pooling the scrim at
   *            the far left instead left those headlines sitting on bare
   *            highlights.
   */
  focus?: "split" | "measure";
}) {
  return (
    <>
      <div className={cn("absolute inset-0 -z-10", className)}>
        <BlockField
          className="h-full w-full"
          density={density}
          seed={seed}
          scale={scale}
          parallax={parallax}
          formation={formation}
          // The home hero puts its headline hard left, so the middle is free.
          // Every other page runs copy through the centre and needs it kept clear.
          clearCentre={focus === "measure"}
        />
      </div>

      {/*
        Scrims. Contrast was measured against the brightest frame of the
        animation rather than a still — the blocks turn, so a highlight that is
        not there on load arrives a few seconds later directly behind the text.

        The flat wash stays light on purpose. A heavy one crushes the bright end
        of every specular sweep, which is the only thing in the frame with any
        life in it.
      */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          // Rail-aligned headlines run across the middle of the frame, where
          // the blocks are brightest, so they need a heavier base wash than the
          // home hero's far-left column does.
          focus === "split" ? "bg-black/15" : "bg-black/35",
        )}
      />

      {focus === "split" ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(75%_60%_at_12%_38%,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.6)_45%,rgba(0,0,0,0)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_78%_78%,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0)_100%)]"
          />
        </>
      ) : (
        /* One broad pool centred on the content column. */
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(85%_75%_at_45%_50%,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.7)_40%,rgba(0,0,0,0.15)_75%,rgba(0,0,0,0)_100%)]"
        />
      )}
    </>
  );
}

/**
 * Full-bleed scene used as punctuation between arguments — the same role the
 * reference build gives its video interstitials. Deliberately shallow: this is
 * a breath, not a second hero.
 */
export function SceneBreak({
  seed = 90210,
  /**
   * Fully resolved by default. On the home page this strip sits between "the
   * problem" and "the solution", so an aligned formation renders the
   * argument's turning point rather than stating it.
   */
  formation = 1,
}: {
  seed?: number;
  formation?: number;
}) {
  return (
    <div className="relative h-[45svh] min-h-[18rem] w-full overflow-hidden md:h-[60svh]">
      <BlockField
        className="h-full w-full"
        density={5}
        seed={seed}
        scale={1.15}
        formation={formation}
      />
      {/*
        Fades the strip into the black above and below it. The stops sit well
        inside the edges because the blocks are bright here — with a narrow fade
        the canvas boundary showed as a hard horizontal cut across a lit face.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.25)_32%,rgba(0,0,0,0.25)_58%,#000_100%)]"
      />
    </div>
  );
}
