"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Hero video — the founder pitch.
 *
 * Deliberately click-to-play with sound rather than autoplaying muted. This is
 * a spoken argument, not ambient texture: muted autoplay would burn the first
 * eight seconds of the pitch before anyone unmutes, and browsers block audio
 * autoplay anyway.
 *
 * Falls back to the poster frame and the written headline if the video is
 * missing, so the hero never renders empty.
 *
 * Drop files at:
 *   /public/video/founder-pitch.mp4
 *   /public/video/founder-pitch.webm
 *   /public/video/founder-pitch.jpg   (poster)
 */
export function FounderVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().then(
      () => setPlaying(true),
      () => setFailed(true),
    );
  };

  return (
    <div className={cn("relative overflow-hidden border border-rule bg-surface", className)}>
      <video
        ref={videoRef}
        poster="/video/founder-pitch.jpg"
        playsInline
        preload="metadata"
        controls={playing}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
        className="block aspect-[16/10] w-full object-cover"
      >
        <source src="/video/founder-pitch.webm" type="video/webm" />
        <source src="/video/founder-pitch.mp4" type="video/mp4" />
      </video>

      {!playing && (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 flex items-end justify-start bg-gradient-to-t from-void/85 via-void/25 to-transparent p-6 text-left md:p-8"
        >
          <span className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-bone/40 bg-void/60 backdrop-blur transition-colors duration-500 group-hover:border-amber group-hover:bg-amber">
              <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden className="translate-x-px">
                <path
                  d="M0 0l14 8-14 8V0z"
                  className="fill-bone transition-colors duration-500 group-hover:fill-void"
                />
              </svg>
            </span>
            <span>
              <span className="label block text-amber">Watch · 60 seconds</span>
              <span className="mt-1 block text-sm text-bone">
                {failed
                  ? "Video coming soon"
                  : "What I actually do for a business like yours"}
              </span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
