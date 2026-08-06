import { cn } from "@/lib/cn";

/**
 * Maps Lead Scraper — product demonstration.
 *
 * Every control, column and score in here is taken from the real v5.2 source
 * (popup.html control ids, content.js calculateLeadScore weights, popup.js
 * export targets). It is a mockup only in the sense that the pixels are ours;
 * the behaviour it depicts is the behaviour the extension actually has.
 *
 * TODO: replace with real screenshots when Hamza supplies them. The layout is
 * built to be swapped 1:1.
 */

/** calculateLeadScore() from content.js — these weights are verbatim. */
const SCORE_WEIGHTS = [
  { field: "email", points: 28 },
  { field: "phone", points: 22 },
  { field: "website", points: 15 },
  { field: "socials", points: 10 },
  { field: "address", points: 8 },
  { field: "rating", points: 6 },
  { field: "reviews", points: 6 },
  { field: "category", points: 5 },
];

type Lead = {
  name: string;
  category: string;
  email: string | null;
  phone: string;
  site: string;
  rating: string;
  reviews: number;
  score: number;
};

/** Scores below are consistent with the real weighting, not decorative. */
const LEADS: Lead[] = [
  { name: "Bella Napoli Pizzeria", category: "Italian restaurant", email: "info@bellanapoli.ae", phone: "+971 4 555 0142", site: "bellanapoli.ae", rating: "4.6", reviews: 312, score: 95 },
  { name: "The Curry Leaf", category: "Indian restaurant", email: "hello@curryleaf.ae", phone: "+971 4 555 0198", site: "curryleaf.ae", rating: "4.4", reviews: 188, score: 95 },
  { name: "Marina Grill House", category: "Steak house", email: "book@marinagrill.ae", phone: "+971 4 555 0233", site: "marinagrill.ae", rating: "4.7", reviews: 521, score: 95 },
  { name: "Saffron Kitchen", category: "Persian restaurant", email: null, phone: "+971 4 555 0117", site: "saffronkitchen.ae", rating: "4.2", reviews: 96, score: 67 },
  { name: "Corner Shawarma", category: "Fast food restaurant", email: "orders@cornershawarma.ae", phone: "+971 4 555 0165", site: "cornershawarma.ae", rating: "4.5", reviews: 402, score: 95 },
  { name: "Green Fork Cafe", category: "Vegetarian restaurant", email: null, phone: "+971 4 555 0271", site: "greenfork.ae", rating: "4.1", reviews: 64, score: 67 },
];

function ScoreBar({ score }: { score: number }) {
  // 80+ is "high quality" — the threshold the emails-only / high-quality
  // exports key off.
  const strong = score >= 80;
  return (
    <span className="flex items-center gap-2">
      <span className="relative h-1 w-12 overflow-hidden bg-rule">
        <span
          className={cn("absolute inset-y-0 left-0", strong ? "bg-signal" : "bg-bone-faint")}
          style={{ width: `${score}%` }}
        />
      </span>
      <span className={cn("tabular-nums", strong ? "text-signal" : "text-bone-faint")}>{score}</span>
    </span>
  );
}

/** The extension popup, with the real control set from popup.html. */
export function ScraperPanel({ className }: { className?: string }) {
  return (
    <div className={cn("border border-rule bg-surface/90 backdrop-blur-sm", className)}>
      <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
        <span className="size-2 rounded-full bg-signal" />
        <span className="label text-bone">Maps Lead Scraper</span>
        <span className="label ml-auto text-bone-faint">v5.2</span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="label mb-1.5 text-bone-faint">Search queries</p>
          <div className="border border-rule bg-void px-3 py-2 text-xs text-bone">
            restaurants in Dubai Marina
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Valid leads", value: "100" },
            { label: "Min rating", value: "4.0" },
            { label: "Min reviews", value: "25" },
          ].map((f) => (
            <div key={f.label}>
              <p className="label mb-1.5 text-bone-faint">{f.label}</p>
              <div className="border border-rule bg-void px-2 py-1.5 text-center text-xs tabular-nums text-bone">
                {f.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            ["Enrich from website", true],
            ["Scrape socials", true],
            ["Must have email", true],
            ["Must have phone", false],
          ].map(([label, on]) => (
            <span
              key={label as string}
              className={cn(
                "label border px-2 py-1",
                on ? "border-signal/50 text-signal" : "border-rule text-bone-faint",
              )}
            >
              {on ? "✓ " : ""}
              {label as string}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-rule pt-3 text-center">
          {[
            { label: "Queued", value: "128" },
            { label: "Leads", value: "100" },
            { label: "With email", value: "74" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl leading-none text-bone tabular-nums">{s.value}</p>
              <p className="label mt-1 text-bone-faint">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["CSV", "CSV · emails only", "CSV · high quality", "JSON", "TXT"].map((f) => (
            <span key={f} className="label border border-rule px-2 py-1 text-bone-soft">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The exported result: what the buyer actually receives. */
export function LeadsTable({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden border border-rule bg-surface/70 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <span className="label text-bone">google-maps-ui-leads.csv</span>
        <span className="label text-bone-faint">100 rows</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="label text-bone-faint">
              {["Business", "Email", "Phone", "Rating", "Score"].map((h) => (
                <th key={h} className="border-b border-rule px-4 py-2 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {LEADS.map((lead) => (
              <tr key={lead.name} className="border-b border-rule/60 last:border-0">
                <td className="px-4 py-2.5">
                  <span className="block text-bone">{lead.name}</span>
                  <span className="label text-bone-faint">{lead.category}</span>
                </td>
                <td className="px-4 py-2.5">
                  {lead.email ? (
                    <span className="text-bone-soft">{lead.email}</span>
                  ) : (
                    <span className="text-bone-faint">— not published</span>
                  )}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-bone-soft">{lead.phone}</td>
                <td className="px-4 py-2.5 tabular-nums text-bone-soft">
                  {lead.rating}
                  <span className="text-bone-faint"> · {lead.reviews}</span>
                </td>
                <td className="px-4 py-2.5">
                  <ScoreBar score={lead.score} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** How the 0–100 score is composed. Straight from calculateLeadScore(). */
export function ScoreBreakdown({ className }: { className?: string }) {
  return (
    <div className={cn("border border-rule bg-surface/70 p-4 backdrop-blur-sm", className)}>
      <p className="label mb-3 text-bone-faint">Contactability score · out of 100</p>
      <ul className="space-y-1.5">
        {SCORE_WEIGHTS.map((w) => (
          <li key={w.field} className="flex items-center gap-3 text-xs">
            <span className="w-16 text-bone-soft">{w.field}</span>
            <span className="relative h-1 flex-1 overflow-hidden bg-rule">
              <span
                className="absolute inset-y-0 left-0 bg-signal/70"
                style={{ width: `${(w.points / 28) * 100}%` }}
              />
            </span>
            <span className="w-8 text-right tabular-nums text-bone-faint">+{w.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
