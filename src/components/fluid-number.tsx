"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { cn } from "@/lib/cn";

/**
 * High-craft 3D Fluid Balloon / Inflatable Liquid Number component.
 * Inspired directly by Outcrowd's tactile 3D typography and the fluid number
 * animation showcase video.
 *
 * Provides:
 * 1. `FluidBalloonDigit`: Handcrafted volumetric 3D inflatable balloon digit (0-9)
 *    with specular glints, liquid gradients, inner depth, and fluid wobble physics.
 * 2. `FluidBadgeNumber`: Display index (e.g. "01", "02", "1", "2") that inflates
 *    on card hover or interaction.
 * 3. `FluidCountUp`: Animated counter with fluid roll-in, liquid gradient sheen,
 *    and elastic jelly bounce on hover.
 * 4. `FluidNumberText`: Wraps any numeric text ($200, 24/7, 92, etc.) in a fluid
 *    liquid-glass treatment with specular shine and interactive jelly squish.
 */

// Custom SVG path definitions for rounded puffy 3D balloon numbers (viewBox 0 0 100 120)
interface BalloonShape {
  viewBox: string;
  body: string;
  highlight1: string;
  highlight2?: string;
  shadow?: string;
}

const BALLOON_PATHS: Record<string, BalloonShape> = {
  "0": {
    viewBox: "0 0 100 120",
    body: "M50,12 C28,12 14,32 14,60 C14,88 28,108 50,108 C72,108 86,88 86,60 C86,32 72,12 50,12 Z M50,34 C61,34 66,45 66,60 C66,75 61,86 50,86 C39,86 34,75 34,60 C34,45 39,34 50,34 Z",
    highlight1: "M36,24 C41,18 48,16 56,16 C63,16 70,19 75,25",
    highlight2: "M20,45 C18,52 18,65 21,75",
    shadow: "M50,100 C36,100 24,84 24,60 C24,56 25,52 26,49 C22,54 20,62 20,68 C20,90 32,106 50,106 C64,106 75,95 78,82 C73,93 63,100 50,100 Z",
  },
  "1": {
    viewBox: "0 0 80 120",
    body: "M22,34 C28,34 36,31 43,21 C45,18 49,19 50,23 L50,96 C50,103 44,108 36,108 C28,108 24,103 24,96 L24,96 C24,89 28,84 34,84 L34,38 C28,41 23,43 18,43 C14,43 12,39 14,36 C16,34 19,34 22,34 Z",
    highlight1: "M32,28 C37,23 42,19 47,18 L47,75",
    highlight2: "M44,22 L44,92",
    shadow: "M34,102 C30,102 26,98 26,94 L26,90 C28,96 34,98 42,98 C46,98 48,97 49,95 L49,98 C47,101 41,102 34,102 Z",
  },
  "2": {
    viewBox: "0 0 90 120",
    body: "M20,40 C20,24 32,12 48,12 C64,12 76,23 76,38 C76,52 65,64 51,76 L34,90 L68,90 C74,90 78,94 78,100 C78,105 74,108 67,108 L22,108 C17,108 14,103 16,98 C17,95 19,92 22,89 L45,69 C56,59 62,50 62,40 C62,31 56,24 47,24 C38,24 33,30 32,38 C32,43 27,46 22,46 C19,46 20,43 20,40 Z",
    highlight1: "M32,20 C38,15 45,14 54,15 C62,17 68,22 70,29",
    highlight2: "M28,102 L64,102",
    shadow: "M24,104 L66,104 C70,104 74,102 75,99 C73,103 67,106 60,106 L22,106 C19,106 17,104 18,101 C19,103 21,104 24,104 Z",
  },
  "3": {
    viewBox: "0 0 90 120",
    body: "M22,34 C22,22 34,12 48,12 C62,12 72,21 72,34 C72,44 65,51 55,54 C67,57 74,67 74,78 C74,94 61,108 45,108 C29,108 18,97 18,84 C18,79 22,76 27,76 C32,76 34,80 34,84 C34,92 40,96 46,96 C53,96 59,90 59,80 C59,69 51,64 40,64 C36,64 34,61 34,58 C34,54 37,51 42,51 C51,51 57,46 57,37 C57,29 52,24 45,24 C38,24 33,28 32,34 C32,39 28,42 24,42 C22,42 22,38 22,34 Z",
    highlight1: "M34,18 C40,14 47,13 54,15 C61,17 66,22 67,28",
    highlight2: "M38,98 C42,100 48,100 53,97 C60,93 64,85 64,77",
    shadow: "M44,105 C34,105 24,98 21,87 C22,92 28,102 42,104 C55,106 66,97 68,85 C66,97 56,105 44,105 Z",
  },
  "4": {
    viewBox: "0 0 95 120",
    body: "M64,14 C67,14 70,17 70,21 L70,72 L78,72 C83,72 86,76 86,80 C86,85 83,88 78,88 L70,88 L70,100 C70,105 66,108 61,108 C56,108 52,105 52,100 L52,88 L18,88 C13,88 10,83 12,78 L52,17 C54,14 58,14 64,14 Z M52,36 L25,74 L52,74 L52,36 Z",
    highlight1: "M56,22 L26,68",
    highlight2: "M64,25 L64,80",
    shadow: "M54,104 C53,104 52,103 52,101 L52,98 C53,102 56,104 60,104 C64,104 66,102 67,99 L67,101 C66,103 62,104 54,104 Z",
  },
  "5": {
    viewBox: "0 0 90 120",
    body: "M28,14 L70,14 C75,14 78,17 78,22 C78,26 75,30 70,30 L38,30 L33,52 C37,49 43,47 49,47 C65,47 76,57 76,74 C76,92 64,108 46,108 C30,108 18,97 18,84 C18,79 22,76 27,76 C32,76 34,80 34,84 C34,92 41,96 48,96 C56,96 62,88 62,76 C62,64 55,57 46,57 C40,57 34,60 30,64 C28,66 24,66 22,63 C20,61 19,59 20,55 L26,17 C27,15 28,14 28,14 Z",
    highlight1: "M38,20 L68,20",
    highlight2: "M40,98 C46,101 52,101 58,97 C66,91 70,82 70,72",
  },
  "6": {
    viewBox: "0 0 95 120",
    body: "M58,12 C72,12 80,21 78,29 C77,34 72,36 67,35 C62,34 60,30 61,26 C62,24 59,22 54,22 C41,22 32,32 30,51 C35,46 42,43 50,43 C67,43 80,56 80,74 C80,93 67,108 48,108 C28,108 16,92 16,63 C16,33 32,12 58,12 Z M48,56 C39,56 32,63 32,75 C32,87 39,94 48,94 C57,94 64,87 64,75 C64,63 57,56 48,56 Z",
    highlight1: "M54,16 C42,18 34,26 28,42",
    highlight2: "M38,98 C43,101 50,101 56,98 C65,92 70,83 70,72",
  },
  "7": {
    viewBox: "0 0 85 120",
    body: "M18,16 L70,16 C75,16 78,19 78,24 C78,26 77,29 75,32 L40,101 C37,106 32,108 27,106 C22,103 21,97 24,93 L54,32 L20,32 C15,32 12,28 12,24 C12,19 15,16 18,16 Z",
    highlight1: "M24,22 L72,22",
    highlight2: "M68,28 L42,88",
  },
  "8": {
    viewBox: "0 0 90 120",
    body: "M45,12 C58,12 68,20 68,32 C68,42 61,49 52,53 C63,58 71,67 71,80 C71,96 58,108 44,108 C30,108 17,96 17,80 C17,67 25,58 36,53 C27,49 20,42 20,32 C20,20 30,12 45,12 Z M44,50 C52,50 57,44 57,34 C57,25 51,21 44,21 C37,21 31,25 31,34 C31,44 36,50 44,50 Z M44,98 C53,98 60,91 60,79 C60,67 52,60 44,60 C36,60 28,67 28,79 C28,91 35,98 44,98 Z",
    highlight1: "M34,18 C39,15 45,14 51,16 C57,18 61,23 62,29",
    highlight2: "M32,96 C37,99 43,100 49,98 C57,94 62,86 62,77",
  },
  "9": {
    viewBox: "0 0 95 120",
    body: "M37,108 C23,108 15,99 17,91 C18,86 23,84 28,85 C33,86 35,90 34,94 C33,96 36,98 41,98 C54,98 63,88 65,69 C60,74 53,77 45,77 C28,77 15,64 15,46 C15,27 28,12 47,12 C67,12 79,28 79,57 C79,87 63,108 37,108 Z M47,64 C56,64 63,57 63,45 C63,33 56,26 47,26 C38,26 31,33 31,45 C31,57 38,64 47,64 Z",
    highlight1: "M34,18 C40,15 47,14 53,16 C62,20 68,29 68,43",
    highlight2: "M31,44 C31,32 37,24 45,24",
  },
};

/**
 * Single 3D Inflatable Balloon Digit with authentic specular highlights and liquid reflections.
 */
export function FluidBalloonDigit({
  char,
  isActive = false,
  className,
  size = 72,
  tint = "blue",
}: {
  char: string;
  isActive?: boolean;
  className?: string;
  size?: number;
  tint?: "blue" | "accent" | "voice" | "scan" | "coral";
}) {
  const shape = BALLOON_PATHS[char] || BALLOON_PATHS["1"];
  const id = useId();

  // Dynamic gradients based on tint
  const gradientStops = {
    blue: {
      light: "#93c5fd",
      mid: "#3b82f6",
      deep: "#1d4ed8",
      dark: "#172554",
      glow: "rgba(59, 130, 246, 0.55)",
    },
    accent: {
      light: "#fef08a",
      mid: "#eab308",
      deep: "#ca8a04",
      dark: "#713f12",
      glow: "rgba(234, 179, 8, 0.5)",
    },
    voice: {
      light: "#bfdbfe",
      mid: "#60a5fa",
      deep: "#2563eb",
      dark: "#1e3a8a",
      glow: "rgba(96, 165, 250, 0.5)",
    },
    scan: {
      light: "#a7f3d0",
      mid: "#10b981",
      deep: "#047857",
      dark: "#064e3b",
      glow: "rgba(16, 185, 129, 0.5)",
    },
    coral: {
      light: "#fecdd3",
      mid: "#f43f5e",
      deep: "#be123c",
      dark: "#881337",
      glow: "rgba(244, 63, 94, 0.5)",
    },
  }[tint];

  return (
    <div
      className={cn(
        "fluid-balloon-root relative inline-flex items-center justify-center select-none transition-all duration-500 ease-[var(--ease-spring)]",
        isActive ? "is-active scale-105" : "opacity-35 hover:opacity-90",
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size * 1.25}px`,
        perspective: "600px",
      }}
    >
      {/* Ambient blooming light glow when active */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-[-20%] -z-10 rounded-full blur-xl transition-opacity duration-700 ease-out",
          isActive ? "opacity-100 scale-110" : "opacity-0 scale-90"
        )}
        style={{
          background: `radial-gradient(circle, ${gradientStops.glow} 0%, transparent 70%)`,
        }}
      />

      <svg
        viewBox={shape.viewBox}
        className={cn(
          "w-full h-full overflow-visible transition-transform duration-500 ease-[var(--ease-spring)]",
          isActive && "animate-[fluid-wobble_4s_ease-in-out_infinite]"
        )}
        style={{
          filter: isActive
            ? `drop-shadow(0 14px 20px rgba(0,0,0,0.45)) drop-shadow(0 4px 10px ${gradientStops.glow})`
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
        }}
      >
        <defs>
          {/* Main 3D Volume Gradient */}
          <radialGradient
            id={`vol-${id}`}
            cx="40%"
            cy="32%"
            r="65%"
            fx="35%"
            fy="25%"
          >
            <stop offset="0%" stopColor={isActive ? gradientStops.light : "#9ca3af"} />
            <stop offset="35%" stopColor={isActive ? gradientStops.mid : "#4b5563"} />
            <stop offset="75%" stopColor={isActive ? gradientStops.deep : "#374151"} />
            <stop offset="100%" stopColor={isActive ? gradientStops.dark : "#1f2937"} />
          </radialGradient>

          {/* Specular Glint Gradient */}
          <linearGradient id={`glint-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isActive ? "0.95" : "0.4"} />
            <stop offset="60%" stopColor="#ffffff" stopOpacity={isActive ? "0.6" : "0.2"} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Sub-surface rim light */}
          <linearGradient id={`rim-${id}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={gradientStops.light} stopOpacity={isActive ? "0.7" : "0.2"} />
            <stop offset="40%" stopColor="transparent" />
          </linearGradient>

          {/* Soft inner shadow definition */}
          <filter id={`inset-depth-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="2" dy="4" />
            <feGaussianBlur stdDeviation="3" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity={isActive ? "0.55" : "0.3"} result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* 1. Main Inflated 3D Body */}
        <path
          d={shape.body}
          fill={`url(#vol-${id})`}
          filter={`url(#inset-depth-${id})`}
          className="transition-all duration-500 ease-out"
        />

        {/* 2. Rim Backlight */}
        <path
          d={shape.body}
          fill={`url(#rim-${id})`}
          className="mix-blend-overlay pointer-events-none opacity-80"
        />

        {/* 3. Primary Specular Glint (Top Ridge Reflection) */}
        <path
          d={shape.highlight1}
          fill="none"
          stroke={`url(#glint-${id})`}
          strokeWidth={isActive ? "5.5" : "3.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 pointer-events-none"
          style={{
            filter: isActive ? "blur(0.6px)" : "none",
          }}
        />

        {/* 4. Secondary Specular Highlight (Inner Curvature) */}
        {shape.highlight2 && (
          <path
            d={shape.highlight2}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={isActive ? "0.75" : "0.25"}
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-300 pointer-events-none"
            style={{
              filter: "blur(0.5px)",
            }}
          />
        )}
      </svg>
    </div>
  );
}

/**
 * Multi-digit or index fluid balloon group (e.g. "01", "02", "1", "2").
 * Supports hovering on the card / container via `group-hover` or direct hover.
 */
export function FluidBalloonIndex({
  index,
  className,
  size = 64,
  tint = "blue",
  isHovered,
}: {
  index: string | number;
  className?: string;
  size?: number;
  tint?: "blue" | "accent" | "voice" | "scan" | "coral";
  isHovered?: boolean;
}) {
  const [selfHover, setSelfHover] = useState(false);
  const chars = String(index).split("");
  const active = isHovered !== undefined ? isHovered : selfHover;

  return (
    <div
      onMouseEnter={() => setSelfHover(true)}
      onMouseLeave={() => setSelfHover(false)}
      className={cn(
        "fluid-balloon-index inline-flex items-center gap-0.5 cursor-pointer transition-transform duration-300 ease-[var(--ease-spring)]",
        className
      )}
    >
      {chars.map((ch, i) => (
        <FluidBalloonDigit
          key={i}
          char={ch}
          isActive={active}
          size={size}
          tint={tint}
          className={cn(
            "transition-all duration-500",
            active ? "group-hover:scale-105" : ""
          )}
        />
      ))}
    </div>
  );
}

/**
 * Interactive Fluid Number Text wrapper for prices, ratios, and stats
 * ($200, 24/7, 92, etc.).
 *
 * Applies a liquid 3D glossy gradient, glass specular top reflection,
 * ambient glow, and organic jelly squish on hover or focus!
 */
export function FluidNumberText({
  children,
  className,
  tint = "blue",
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  tint?: "blue" | "accent" | "voice" | "scan" | "coral" | "gold";
  interactive?: boolean;
}) {
  const [wobble, setWobble] = useState(false);

  const handleInteraction = () => {
    if (!interactive) return;
    setWobble(true);
    setTimeout(() => setWobble(false), 800);
  };

  const tintStyles = {
    blue: "from-[#93c5fd] via-[#3b82f6] to-[#1d4ed8] text-shadow-[0_0_24px_rgba(59,130,246,0.45)]",
    accent: "from-[#fef08a] via-[#eab308] to-[#ca8a04] text-shadow-[0_0_24px_rgba(234,179,8,0.45)]",
    voice: "from-[#bfdbfe] via-[#60a5fa] to-[#2563eb] text-shadow-[0_0_24px_rgba(96,165,250,0.45)]",
    scan: "from-[#a7f3d0] via-[#10b981] to-[#047857] text-shadow-[0_0_24px_rgba(16,185,129,0.45)]",
    coral: "from-[#fecdd3] via-[#f43f5e] to-[#be123c] text-shadow-[0_0_24px_rgba(244,63,94,0.45)]",
    gold: "from-[#fff] via-[#fde047] to-[#eab308] text-shadow-[0_0_24px_rgba(253,224,71,0.45)]",
  }[tint];

  return (
    <span
      onMouseEnter={handleInteraction}
      onClick={handleInteraction}
      className={cn(
        "fluid-number-text relative inline-block transition-transform duration-300 ease-[var(--ease-spring)]",
        wobble && "animate-[fluid-jelly_0.8s_ease_both]",
        interactive && "cursor-pointer hover:scale-[1.03]",
        className
      )}
    >
      {/* 3D Liquid Gloss Text */}
      <span
        className={cn(
          "inline-block bg-gradient-to-b bg-clip-text text-transparent font-bold tracking-tight",
          tintStyles
        )}
      >
        {children}
      </span>

      {/* Top Specular Glint Sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/20 to-transparent bg-clip-text text-transparent opacity-85 mix-blend-overlay"
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Fluid Animated Counter (Drop-in replacement for CountUp).
 * Counts up smoothly to `to` with fluid liquid physics, then squishes
 * elastically with jelly bounce on hover!
 */
export function FluidCountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1400,
  tint = "blue",
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  tint?: "blue" | "accent" | "voice" | "scan" | "coral" | "gold";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to);
  const [isJelly, setIsJelly] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const startTime = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - startTime) / duration);
          // Outcrowd / Fluid elastic spring formula
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          setVal(Math.round(to * easeOutCubic));

          if (progress < 1) {
            raf = requestAnimationFrame(step);
          } else {
            // Trigger a soft celebratory jelly pulse upon settling
            setIsJelly(true);
            setTimeout(() => setIsJelly(false), 700);
          }
        };

        setVal(0);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  const triggerHoverJelly = () => {
    setIsJelly(true);
    setTimeout(() => setIsJelly(false), 750);
  };

  return (
    <span
      ref={ref}
      onMouseEnter={triggerHoverJelly}
      className={cn(
        "fluid-countup-root tabular-nums inline-flex items-baseline cursor-pointer transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.04]",
        isJelly && "animate-[fluid-jelly_0.75s_var(--ease-spring)_both]",
        className
      )}
    >
      <FluidNumberText tint={tint}>
        {prefix}
        {val}
        {suffix}
      </FluidNumberText>
    </span>
  );
}
