"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { ChevronLeft, ChevronRight, GripHorizontal, Minus, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Adapt the supplied component in place to honour the no-new-files constraint.
export const glassButtonVariants = cva("glass-button guide-control", {
  variants: { size: {
    default: "px-5 text-sm", sm: "px-4 text-xs",
    lg: "px-6 py-3 text-base", icon: "size-11 p-0",
  } },
  defaultVariants: { size: "default" },
});

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, type = "button", ...props }, ref) => (
    <span className="glass-button-wrap">
      <button ref={ref} type={type} className={cn(glassButtonVariants({ size }), className)} {...props}>
        <span className={cn("glass-button-text", contentClassName)}>{children}</span>
      </button>
    </span>
  ),
);
GlassButton.displayName = "GlassButton";

export interface WalkthroughStep {
  title: string;
  instruction: string;
  tip?: string;
  badge?: string;
}

interface LiquidCloudBubbleProps {
  steps: WalkthroughStep[];
  className?: string;
  position?: "bottom-right" | "top-right" | "bottom-left" | "top-left" | "bottom-center";
  accentColor?: "blue" | "emerald" | "amber" | "violet" | "gold";
  draggable?: boolean;
  onStepChange?: (stepIndex: number) => void;
}

const ACCENT_BADGES = {
  blue: "text-voice", emerald: "text-scan", amber: "text-warm",
  violet: "text-mind", gold: "text-accent",
};

const subscribeToMount = () => () => {};

export function LiquidCloudBubble({
  steps,
  className,
  position = "bottom-right",
  accentColor = "gold",
  draggable = true,
  onStepChange,
}: LiquidCloudBubbleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const mounted = useSyncExternalStore(subscribeToMount, () => true, () => false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<HTMLButtonElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const movedRef = useRef(false);
  const resetRef = useRef<() => void>(() => {});
  const pointerRef = useRef<{ id: number; x: number; y: number; originX: number; originY: number } | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const titleId = useId();

  const stepIndex = Math.min(currentStep, Math.max(0, steps.length - 1));
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const isFirst = stepIndex === 0;

  // A viewport portal escapes clipped or transformed demo ancestors.
  useEffect(() => {
    if (!mounted) return;
    const demo = anchorRef.current?.closest<HTMLElement>('[data-od-id$="-demo"]');
    const dock = dockRef.current;
    const panel = panelRef.current;
    if (!demo || !dock || !panel) return;
    let frame = 0;
    const update = () => {
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const offsetLeft = viewport?.offsetLeft ?? 0;
      const offsetTop = viewport?.offsetTop ?? 0;
      const inset = width < 640 ? 12 : 16;
      const safeStyle = getComputedStyle(dock);
      const safeInset = (edge: string) => Math.max(inset, parseFloat(safeStyle.getPropertyValue(`--guide-safe-${edge}`)) || 0);
      const dockWidth = Math.max(0, width - safeInset('left') - safeInset('right'));
      const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 76;
      const top = Math.min(Math.max(offsetTop + safeInset('top'), headerBottom + inset), offsetTop + height * 0.3);
      const availableHeight = Math.max(0, offsetTop + height - safeInset('bottom') - top);
      Object.assign(dock.style, {
        left: `${offsetLeft + safeInset('left')}px`, top: `${top}px`,
        width: `${dockWidth}px`, height: `${availableHeight}px`,
      });
      dock.style.setProperty('--guide-available-height', `${availableHeight}px`);
      const demoRect = demo.getBoundingClientRect();
      setIsVisible(demoRect.bottom > top + 64 && demoRect.top < offsetTop + height - 64 && availableHeight >= 220);
      const panelRect = panel.getBoundingClientRect();
      const maxX = Math.max(0, dockWidth - panelRect.width);
      const maxY = Math.max(0, availableHeight - panelRect.height);
      if (movedRef.current) {
        x.set(Math.min(maxX, Math.max(0, x.get())));
        y.set(Math.min(maxY, Math.max(0, y.get())));
      } else {
        x.set(position.endsWith('left') ? 0 : position === 'bottom-center' ? maxX / 2 : maxX);
        // On mobile, leave the demo header free and dock above browser chrome.
        y.set(width < 640 || isClosed ? maxY : Math.min(maxY, Math.max(0, demoRect.top + 16 - top)));
      }
      panel.dataset.x = String(x.get()); panel.dataset.y = String(y.get());
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    resetRef.current = () => { movedRef.current = false; setHasMoved(false); update(); };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(panel); resizeObserver.observe(demo);
    const intersectionObserver = new IntersectionObserver(schedule);
    intersectionObserver.observe(demo);
    const unsubscribeX = x.on('change', value => { panel.dataset.x = String(value); });
    const unsubscribeY = y.on('change', value => { panel.dataset.y = String(value); });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      unsubscribeX(); unsubscribeY();
      window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
    };
  }, [mounted, position, isClosed, isMinimized, x, y]);

  useEffect(() => {
    if (isClosed) launcherRef.current?.focus({ preventScroll: true });
  }, [isClosed]);

  const moveTo = (nextX: number, nextY: number) => {
    const dock = dockRef.current?.getBoundingClientRect();
    const panel = panelRef.current?.getBoundingClientRect();
    if (!dock || !panel) return;
    x.set(Math.min(Math.max(0, dock.width - panel.width), Math.max(0, nextX)));
    y.set(Math.min(Math.max(0, dock.height - panel.height), Math.max(0, nextY)));
  };

  const closeGuide = () => { pointerRef.current = null; setIsClosed(true); };
  const restoreGuide = () => {
    setIsClosed(false); setIsMinimized(false);
    requestAnimationFrame(() => moveRef.current?.focus({ preventScroll: true }));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLast) {
      setCurrentStep(0);
      onStepChange?.(0);
    } else {
      const next = stepIndex + 1;
      setCurrentStep(next);
      onStepChange?.(next);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isFirst) {
      const prev = stepIndex - 1;
      setCurrentStep(prev);
      onStepChange?.(prev);
    }
  };

  const handleRestart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentStep(0);
    onStepChange?.(0);
  };

  if (!step) return null;

  return (
    <>
      <span ref={anchorRef} hidden aria-hidden />
      {mounted && createPortal(
        <div ref={dockRef} className="walkthrough-dock" data-visible={isVisible} aria-hidden={!isVisible} inert={!isVisible}>
          <motion.div
            ref={panelRef}
            className={cn("walkthrough-panel liquid-glass-surface", className)}
            data-state={isClosed ? "closed" : isMinimized ? "minimized" : "expanded"}
            data-moved={hasMoved}
            data-od-id={`walkthrough-guide-${titleId.replace(/[^a-zA-Z0-9-]/g, '')}`}
            style={{ x, y }}
            layout={reducedMotion ? false : "size"}
            initial={{ opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32, mass: 0.8 }}
            onKeyDown={(event) => { if (event.key === 'Escape' && !isClosed) { event.stopPropagation(); closeGuide(); } }}
            role="region"
            aria-label="Demo walkthrough"
          >
            {isClosed ? (
              <button ref={launcherRef} type="button" className="guide-control guide-launcher" aria-label="Show demo guide" onClick={restoreGuide} data-od-id="guide-reopen">
                <span>Show guide</span><ChevronRight aria-hidden className="size-4" />
              </button>
            ) : (
              <div className="guide-expanded">
                <div className="guide-header">
                  {draggable && (
                    <button
                      ref={moveRef} type="button" className="guide-control guide-drag-handle" aria-label="Move guide"
                      title="Drag to move. Arrow keys move; Home resets position." data-od-id="guide-move"
                      onPointerDown={(event) => {
                        if (event.button !== 0) return;
                        event.preventDefault(); event.currentTarget.focus({ preventScroll: true });
                        event.currentTarget.setPointerCapture(event.pointerId);
                        pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, originX: x.get(), originY: y.get() };
                        movedRef.current = true; setHasMoved(true);
                      }}
                      onPointerMove={(event) => {
                        const pointer = pointerRef.current;
                        if (pointer?.id !== event.pointerId) return;
                        moveTo(pointer.originX + event.clientX - pointer.x, pointer.originY + event.clientY - pointer.y);
                      }}
                      onPointerUp={(event) => {
                        pointerRef.current = null;
                        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                      }}
                      onPointerCancel={() => { pointerRef.current = null; }}
                      onLostPointerCapture={() => { pointerRef.current = null; }}
                      onKeyDown={(event) => {
                        if (event.key === 'Home') { event.preventDefault(); resetRef.current(); return; }
                        const delta = event.shiftKey ? 48 : 16;
                        const offsets: Record<string, [number, number]> = { ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta] };
                        const offset = offsets[event.key];
                        if (!offset) return;
                        event.preventDefault(); movedRef.current = true; setHasMoved(true);
                        moveTo(x.get() + offset[0], y.get() + offset[1]);
                      }}
                    ><GripHorizontal aria-hidden className="size-5" /></button>
                  )}
                  <span className={cn("guide-step-label", ACCENT_BADGES[accentColor])}>Step {stepIndex + 1} of {steps.length}</span>
                  <button type="button" className="guide-control guide-icon-button" aria-label={isMinimized ? "Expand demo guide" : "Minimize guide"} data-od-id="guide-minimize" onClick={() => setIsMinimized(value => !value)}>
                    {isMinimized ? <ChevronRight aria-hidden className="size-4" /> : <Minus aria-hidden className="size-4" />}
                  </button>
                  <button type="button" className="guide-control guide-icon-button" aria-label="Close guide" data-od-id="guide-close" onClick={closeGuide}><X aria-hidden className="size-4" /></button>
                </div>
                {isMinimized ? (
                  <button type="button" className="guide-control guide-minimized-title" aria-label="Expand demo guide" onClick={() => setIsMinimized(false)}>{step.title}</button>
                ) : (
                  <>
                    <div className="guide-body" aria-live="polite" aria-atomic="true">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div key={stepIndex} initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }} transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}>
                          <h4 id={titleId} className="guide-title" data-od-id="guide-title">{step.title}</h4>
                          <p className="guide-instruction">{step.instruction}</p>
                          {step.tip && <p className="guide-tip"><strong>Tip.</strong> {step.tip}</p>}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="guide-footer">
                      <button type="button" onClick={handlePrev} disabled={isFirst} className="guide-control guide-icon-button" aria-label="Previous step" data-od-id="guide-previous"><ChevronLeft aria-hidden className="size-4" /></button>
                      <div className="guide-progress" aria-label="Guide steps">
                        {steps.map((_, index) => (
                          <button key={index} type="button" className="guide-control guide-progress-step" aria-label={`Jump to step ${index + 1}`} aria-current={index === stepIndex ? "step" : undefined} onClick={() => { setCurrentStep(index); onStepChange?.(index); }}>
                            <span aria-hidden />
                          </button>
                        ))}
                      </div>
                      <GlassButton size="sm" onClick={isLast ? handleRestart : handleNext} aria-label={isLast ? "Restart guide" : "Next step"} data-od-id="guide-next">
                        {isLast ? <RotateCcw aria-hidden className="size-3.5" /> : null}{isLast ? 'Restart' : 'Next'}{!isLast && <ChevronRight aria-hidden className="size-3.5" />}
                      </GlassButton>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>, document.body,
      )}
    </>
  );
}
