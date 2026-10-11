"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import { FluidBalloonDigit, FluidNumberText } from "@/components/fluid-number";
import { ArrowRight, CheckCircle2, Sparkles, Layers, Sliders, Rocket } from "lucide-react";

interface StepItem {
  number: string;
  name: string;
  headline: string;
  body: string;
  icon: React.ElementType;
  badge: string;
  tint: "accent" | "scan" | "voice" | "coral";
}

const STEPS: StepItem[] = [
  {
    number: "1",
    name: "Scope",
    headline: "Map the a-to-z workflow",
    body: "We identify the most repetitive messages and define the exact a-to-z workflow before writing a single prompt.",
    icon: Sliders,
    badge: "Step 01 · Planning",
    tint: "accent",
  },
  {
    number: "2",
    name: "Build",
    headline: "Load your business facts",
    body: "I build the agent and load it with your approved business data. Strict rules prevent hallucinations.",
    icon: Layers,
    badge: "Step 02 · Engineering",
    tint: "voice",
  },
  {
    number: "3",
    name: "Test",
    headline: "Stress-test every scenario",
    body: "We stress-test edge cases together until you are 100% confident it handles your customers with care.",
    icon: Sparkles,
    badge: "Step 03 · Quality",
    tint: "scan",
  },
  {
    number: "4",
    name: "Launch",
    headline: "Go live on your number",
    body: "We connect it to your business number and start saving your team's hours while capturing every lead.",
    icon: Rocket,
    badge: "Step 04 · Deployment",
    tint: "coral",
  },
];

/**
 * OnboardingWheel: An Outcrowd-grade interactive 3D drum stage
 * that houses the 4 Done-For-You onboarding steps with
 * 3D fluid inflatable balloon numbers and fluid spring physics.
 */
export function OnboardingWheel({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeStep = STEPS[active];

  // Optional subtle auto-rotation if the user doesn't interact for a bit
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col gap-6 select-none", className)}
      onMouseEnter={() => setIsAutoPlay(false)}
    >
      {/* 1. Step Navigation Pill Strip */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border border-rule-strong bg-ink/70 backdrop-blur-md">
        {STEPS.map((s, idx) => {
          const isCurrent = idx === active;
          return (
            <button
              key={s.name}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                "group relative flex-1 min-w-[5.5rem] flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-medium transition-all duration-300",
                isCurrent
                  ? "bg-ink-2 text-paper shadow-[var(--shadow-card)] border border-rule-strong"
                  : "text-mute hover:text-paper hover:bg-ink-2/40"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[0.6875rem] font-bold transition-colors",
                  isCurrent ? "text-accent" : "text-faint group-hover:text-paper"
                )}
              >
                0{idx + 1}
              </span>
              <span className="font-sans font-medium">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Main 3D Fluid Interactive Stage */}
      <div className="relative overflow-hidden rounded-[2rem] border border-rule-strong bg-gradient-to-b from-ink-2/95 to-ink/90 p-6 md:p-8 shadow-[var(--shadow-lift)] min-h-[22rem] flex flex-col justify-between">
        {/* Ambient fluid glow background based on active step tint */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-16 -top-16 size-64 rounded-full blur-3xl opacity-35 transition-all duration-700 ease-out",
            active === 0 && "bg-amber-400/40",
            active === 1 && "bg-blue-500/40",
            active === 2 && "bg-emerald-400/40",
            active === 3 && "bg-rose-500/40"
          )}
        />

        {/* Top Header of the card */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <span className="ui-label text-accent font-mono text-[0.6875rem] tracking-wider uppercase">
              {activeStep.badge}
            </span>
            <h3 className="mt-2 text-head font-display font-semibold text-paper flex items-center gap-2.5">
              <span>{activeStep.name}</span>
              <span className="text-mute/60 font-light text-xl">·</span>
              <span className="text-lg font-normal text-mute">{activeStep.headline}</span>
            </h3>
          </div>

          {/* Large Floating 3D Fluid Balloon Number from the video */}
          <div className="shrink-0 transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-110">
            <FluidBalloonDigit
              char={activeStep.number}
              size={64}
              tint={activeStep.tint}
              isActive={true}
            />
          </div>
        </div>

        {/* Body content */}
        <div className="relative z-10 my-6">
          <p className="max-w-[48ch] text-[1.0625rem] leading-relaxed text-paper/90">
            {activeStep.body.includes("100%") ? (
              <>
                We stress-test edge cases together until you are{" "}
                <FluidNumberText tint="scan" className="text-base font-bold">
                  100%
                </FluidNumberText>{" "}
                confident it handles your customers with care.
              </>
            ) : (
              activeStep.body
            )}
          </p>
        </div>

        {/* Bottom controls / Step progress bar */}
        <div className="relative z-10 flex items-center justify-between gap-4 pt-4 border-t border-rule">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active
                    ? "w-8 bg-accent"
                    : "w-2 bg-rule-strong hover:bg-mute"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={active === 0}
              onClick={() => setActive((p) => Math.max(0, p - 1))}
              className="size-8 rounded-full border border-rule flex items-center justify-center text-xs text-mute hover:text-paper hover:border-paper disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              disabled={active === STEPS.length - 1}
              onClick={() => setActive((p) => Math.min(STEPS.length - 1, p + 1))}
              className="size-8 rounded-full border border-rule flex items-center justify-center text-xs text-mute hover:text-paper hover:border-paper disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
