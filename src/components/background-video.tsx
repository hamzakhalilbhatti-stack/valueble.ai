"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type BackgroundVideoProps = {
  /** Basename in /public/video, without extension. Expects .webm, .mp4 and .jpg. */
  name: string;
  /** Decorative by default; describe it only if it carries meaning. */
  alt?: string;
  /** Scrim strength. Text sits on top of this, so legibility wins over spectacle. */
  scrim?: "light" | "heavy" | "dark";
  className?: string;
};

const scrims: Record<NonNullable<BackgroundVideoProps["scrim"]>, string> = {
  // Strong at the left where display type sits, opening up to the right.
  light: "bg-gradient-to-r from-void via-void/88 to-void/55",
  heavy: "bg-gradient-to-r from-void via-void/92 to-void/75",
  // Lighter than it looks: the footer clip is near-black already, so a heavy
  // scrim on top erases it entirely.
  dark: "bg-gradient-to-r from-surface-deep/95 via-surface-deep/78 to-surface-deep/45",
};

/**
 * Ambient video behind a section.
 *
 * The <video> is only mounted when it is actually wanted — the server and the
 * first client render show the poster alone, so phones and reduced-motion
 * visitors never download the file at all. Suppressing it with CSS would still
 * pull several hundred KB over mobile data.
 */
export function BackgroundVideo({
  name,
  alt = "",
  scrim = "light",
  className,
}: BackgroundVideoProps) {
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    const roomy = window.matchMedia("(min-width: 768px)");

    const decide = () => setPlayVideo(!stillness.matches && roomy.matches);
    decide();

    stillness.addEventListener("change", decide);
    roomy.addEventListener("change", decide);
    return () => {
      stillness.removeEventListener("change", decide);
      roomy.removeEventListener("change", decide);
    };
  }, []);

  // `autoPlay` alone is not reliable: Chrome defers it for backgrounded tabs and
  // iOS Safari wants an explicit call. Nudging it is harmless when it is already
  // running, and the rejection is expected when a policy genuinely blocks us —
  // the poster stays up in that case, so there is nothing to recover from.
  useEffect(() => {
    if (!playVideo) return;
    videoRef.current?.play().catch(() => {});
  }, [playVideo]);

  return (
    <div aria-hidden={!alt} className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      {/* Poster is always painted, so there is never an empty frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/video/${name}.jpg`}
        alt={alt}
        className="absolute inset-0 size-full object-cover"
      />

      {playVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`/video/${name}.jpg`}
          className="absolute inset-0 size-full object-cover"
        >
          <source src={`/video/${name}.webm`} type="video/webm" />
          <source src={`/video/${name}.mp4`} type="video/mp4" />
        </video>
      )}

      <div className={cn("absolute inset-0", scrims[scrim])} />
      {/* Softens the join into the section below, in whichever tone that is. */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent",
          scrim === "dark" ? "to-surface-deep" : "to-void",
        )}
      />
    </div>
  );
}
