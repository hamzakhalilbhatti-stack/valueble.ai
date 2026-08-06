import { cn } from "@/lib/cn";

/**
 * Custom AI Agents — a build, drawn as what it actually is.
 *
 * The other two products can show a screen. This one cannot: every build is
 * different, so a screenshot would be a lie about what you are buying. What is
 * consistent is the shape of the work — a trigger, a chain of steps, a human
 * checkpoint where one is warranted, and a destination in a tool you already
 * own. So that is what is drawn.
 *
 * The checkpoint row matters and is not decoration. Being told which parts
 * should stay manual is the part of this service worth paying for.
 */

const FLOW = [
  {
    step: "Trigger",
    body: "A WhatsApp message, a form submission, a new row, a scheduled time.",
    tone: "step" as const,
  },
  {
    step: "Understand",
    body: "Read the request in whatever language and format it actually arrived in.",
    tone: "step" as const,
  },
  {
    step: "Act",
    body: "Look things up, write records, call the tools you already pay for.",
    tone: "step" as const,
  },
  {
    step: "Checkpoint",
    body: "Anything ambiguous or expensive stops here and waits for a person.",
    tone: "human" as const,
  },
  {
    step: "Deliver",
    body: "Into your CRM, your sheet, your inbox — wherever the work already lives.",
    tone: "step" as const,
  },
];

export function AgentDemo({ className }: { className?: string }) {
  return (
    <div className={cn("panel", className)}>
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <span className="ui-label text-paper">One process, automated</span>
        <span className="ui-label text-faint">Built to your workflow</span>
      </div>

      <ol className="p-4 sm:p-6">
        {FLOW.map((node, i) => (
          <li key={node.step} className="relative flex gap-4 pb-7 last:pb-0">
            {/* Connector, stopping short of the final node. */}
            {i < FLOW.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[0.4375rem] top-4 h-full w-px bg-rule-strong"
              />
            )}

            <span
              aria-hidden
              className={cn(
                "relative mt-1 size-3.5 shrink-0 rounded-full border",
                node.tone === "human"
                  ? "border-mind bg-mind/25"
                  : "border-rule-strong bg-black",
              )}
            />

            <div className="min-w-0">
              <p
                className={cn(
                  "ui-label",
                  node.tone === "human" ? "text-mind" : "text-paper",
                )}
              >
                {node.step}
                {node.tone === "human" && " · human"}
              </p>
              <p className="mt-2 max-w-[46ch] text-sm text-mute">{node.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
