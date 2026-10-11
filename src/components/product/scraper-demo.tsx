"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Globe, Mail, MapPin, Phone, Play, Search, Star, Square } from "lucide-react";
import { DemoLabel } from "@/components/ui";
import { LiquidCloudBubble, type WalkthroughStep } from "@/components/ui/liquid-cloud-bubble";
import { cn } from "@/lib/cn";

/**
 * Maps Lead Scraper — an interactive mock of the extension.
 *
 * Type a search ("dentists in Austin"), set a target and filters, press Start,
 * and watch the scored table fill in. "Export CSV" downloads the rows you see.
 *
 * Everything in the table is generated demo data, seeded from the query so the
 * same search gives the same list. Emails use the reserved `.example` domain and
 * phones use 555 numbers so nothing here can be mistaken for a real business.
 *
 * Score weighting below is illustrative of the real extension's ordering
 * (email counts most, then phone, then website and socials).
 * TODO (owner): align the weights with the shipped v5.2 scorer if they differ.
 */

type Lead = {
  name: string;
  rating: number;
  reviews: number;
  email: string | null;
  phone: string | null;
  website: boolean;
  socials: number;
  score: number;
};

const PREFIX = ["Northside", "Lakeview", "Bright", "Riverbend", "Summit", "Elm Street", "Capitol", "Westgate", "Bluebonnet", "Parkway", "Cedar", "Main Street", "Oakridge", "Harbor", "Sunset", "Hilltop", "Greenway", "Union", "Old Town", "Maple"];
const SUFFIX = ["", " Co.", " Group", " Studio", " & Partners", " Center", " House", " Collective"];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function rng(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function parse(q: string) {
  const m = q.trim().match(/^(.*?)\s+(?:in|near)\s+(.+)$/i);
  const cat = (m ? m[1] : q).trim() || "businesses";
  const city = (m ? m[2] : "your city").trim();
  const singular = cat.replace(/ies$/i, "y").replace(/(?<!s)s$/i, "");
  const title = singular.replace(/\b\w/g, (c) => c.toUpperCase());
  return { cat, city, title };
}
function makeLeads(query: string, n: number): Lead[] {
  const { title } = parse(query);
  const r = rng(hash(query.toLowerCase()));
  const used = new Set<string>();
  const out: Lead[] = [];
  for (let i = 0; out.length < n && i < n * 6; i++) {
    const name = `${PREFIX[Math.floor(r() * PREFIX.length)]} ${title}${SUFFIX[Math.floor(r() * SUFFIX.length)]}`;
    if (used.has(name)) continue;
    used.add(name);
    const website = r() > 0.18;
    const email = website && r() > 0.32 ? `hello@${name.toLowerCase().replace(/[^a-z]+/g, "")}.example` : null;
    const phone = r() > 0.1 ? `+1 555 01${String(Math.floor(r() * 90) + 10)}` : null;
    const socials = website ? Math.floor(r() * 4) : 0;
    const score = (email ? 40 : 0) + (phone ? 25 : 0) + (website ? 20 : 0) + Math.min(socials, 3) * 5;
    out.push({ name, rating: Math.round((3.5 + r() * 1.5) * 10) / 10, reviews: Math.floor(8 + r() * 640), email, phone, website, socials, score });
  }
  return out;
}

const STAGES = ["Scrolling the Maps results", "Visiting business websites", "Scoring and filtering"];


const SCRAPER_STEPS: WalkthroughStep[] = [
  {
    title: "1. Choose niche & city",
    instruction: "Enter a niche and city, such as 'dentists in Austin', then select 5, 10, or 20 target leads and a minimum rating.",
    tip: "Scrapes directly from Google Maps without Places API keys.",
    badge: "Step 1",
  },
  {
    title: "2. Launch scraper",
    instruction: "Tap 'Start'. Watch the demo results fill with business names, ratings, contact details, and scores.",
    tip: "Visits each company's website to pull verified emails & socials.",
    badge: "Step 2",
  },
  {
    title: "3. Export clean CSV",
    instruction: "When the progress bar reaches 100%, tap 'Export CSV' to download your cleaned lead sheet ready for cold outreach.",
    tip: "One-time purchase · Lifetime use · No subscription fees.",
    badge: "Step 3",
  },
];

export function ScraperDemo({ className }: { className?: string }) {
  const [query, setQuery] = useState("dentists in Austin");
  const [target, setTarget] = useState(10);
  const [minRating, setMinRating] = useState(4);
  const [enrich, setEnrich] = useState(true);
  const [mustEmail, setMustEmail] = useState(false);

  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState(0);
  const [rows, setRows] = useState<Lead[]>([]);
  const [ran, setRan] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  const stop = () => {
    clearInterval(timer.current);
    setRunning(false);
  };

  const run = () => {
    if (!query.trim()) return;
    clearInterval(timer.current);
    const leads = makeLeads(query, 80);
    setRan(query);
    setRows([]);
    setChecked(0);
    setRunning(true);
    let i = 0;
    const kept: Lead[] = [];
    timer.current = window.setInterval(() => {
      const lead = leads[i++];
      setChecked(i);
      if (lead) {
        let l = lead;
        if (!enrich) l = { ...l, email: null, socials: 0, score: (l.phone ? 25 : 0) + (l.website ? 20 : 0) };
        const pass = l.rating >= minRating && (!mustEmail || l.email);
        if (pass) {
          kept.push(l);
          setRows([...kept].sort((a, b) => b.score - a.score));
        }
      }
      if (kept.length >= target || i >= leads.length) {
        clearInterval(timer.current);
        setRunning(false);
      }
    }, 260);
  };

  const exportCsv = () => {
    const head = ["name", "rating", "reviews", "email", "phone", "has_website", "socials", "score"];
    const esc = (v: string | number | boolean | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const body = rows.map((r) => [r.name, r.rating, r.reviews, r.email, r.phone, r.website, r.socials, r.score].map(esc).join(","));
    const blob = new Blob([[head.join(","), ...body].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(ran ?? "leads").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-DEMO.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const stage = !running ? null : rows.length === 0 && checked < 4 ? 0 : checked % 3 === 0 ? 2 : 1;
  const pct = Math.min(100, Math.round((rows.length / target) * 100));
  const done = !running && ran !== null;
  const { city } = parse(ran ?? query);

  const field = "min-h-11 w-full rounded-lg border border-rule-strong bg-ink-2 px-3 text-sm text-paper transition-colors hover:border-paper/40 focus-visible:border-accent";

  return (
    <div className={cn("relative grid min-w-0 gap-4 lg:grid-cols-[19rem_minmax(0,1fr)]", className)} data-od-id="scraper-demo">
      {/* Extension popup */}
      <form
        className="panel flex flex-col gap-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (running) stop();
          else run();
        }}
        aria-label="Maps Lead Scraper demo controls"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-paper">
            <span aria-hidden className="grid size-7 place-items-center rounded-lg bg-scan/12 text-scan">
              <MapPin className="size-4" />
            </span>
            Maps Lead Scraper
          </span>
          <span className="ui-label text-faint">v5.2</span>
        </div>

        <label className="grid gap-1.5">
          <span className="ui-label text-faint">Search query</span>
          <span className="relative">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} disabled={running} className={cn(field, "pl-9")} placeholder="dentists in Austin" />
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5">
            <span className="ui-label text-faint">Target leads</span>
            <select value={target} onChange={(e) => setTarget(Number(e.target.value))} disabled={running} className={field}>
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="ui-label text-faint">Min rating</span>
            <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} disabled={running} className={field}>
              {[0, 3.5, 4, 4.5].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Any" : `${n}+`}
                </option>
              ))}
            </select>
          </label>
        </div>

        {[
          { id: "enrich", label: "Enrich from website", sub: "Find emails and socials", on: enrich, set: setEnrich },
          { id: "email", label: "Must have email", sub: "Skip leads without one", on: mustEmail, set: setMustEmail },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="switch"
            aria-checked={t.on}
            disabled={running}
            onClick={() => t.set(!t.on)}
            className="flex min-h-11 items-center justify-between gap-3 rounded-lg text-left disabled:opacity-60"
          >
            <span>
              <span className="block text-sm text-paper">{t.label}</span>
              <span className="block text-xs text-faint">{t.sub}</span>
            </span>
            <span aria-hidden className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200", t.on ? "bg-scan" : "bg-rule-strong")}>
              <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200", t.on ? "translate-x-[1.125rem]" : "translate-x-0.5")} />
            </span>
          </button>
        ))}

        <div className="flex items-center justify-between rounded-lg bg-ink-3 px-3 py-2 text-xs text-mute">
          <span>Output</span>
          <span className="font-medium text-paper">CSV · JSON · TXT</span>
        </div>

        <button
          type="submit"
          className={cn(
            "inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[background-color,transform] hover:-translate-y-0.5",
            running ? "border border-rule-strong bg-ink-2 text-paper hover:bg-ink-3" : "bg-paper text-ink hover:bg-paper/90",
          )}
        >
          {running ? <Square aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          {running ? "Stop" : ran ? "Run again" : "Start"}
        </button>
      </form>

      {/* Results */}
      <div className="panel flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-rule px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-paper">{ran ? `Results · ${ran}` : "Results"}</p>
            <p className="mt-0.5 text-xs text-mute" aria-live="polite">
              {running && stage !== null
                ? `${STAGES[stage]}… checked ${checked}, kept ${rows.length}/${target}`
                : done
                  ? `Done. Checked ${checked} businesses in ${city}, kept ${rows.length}.`
                  : "Type a search and press Start."}
            </p>
          </div>
          <DemoLabel>Demo data</DemoLabel>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!done || rows.length === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-on-accent transition-[background-color,opacity] hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download aria-hidden className="size-4" /> Export CSV
          </button>
        </div>
        <div className="h-1 bg-ink-3" aria-hidden>
          <div className="h-full bg-scan transition-[width] duration-300 ease-out" style={{ width: `${ran ? pct : 0}%` }} />
        </div>

        <div className="h-[22rem] overflow-auto overscroll-contain sm:h-[26rem]" tabIndex={0} aria-label="Scrollable demo leads">
          {rows.length === 0 ? (
            <div className="grid h-full place-items-center p-8 text-center">
              <div className="max-w-xs">
                <span aria-hidden className="mx-auto grid size-12 place-items-center rounded-2xl bg-scan/10 text-scan">
                  <MapPin className="size-6" />
                </span>
                <p className="mt-4 font-medium text-paper">{running ? "Working the results panel…" : "Your scored leads appear here"}</p>
                <p className="mt-1 text-sm text-mute">Try “plumbers in Dallas” or “gyms in Dubai”.</p>
              </div>
            </div>
          ) : (
            <>
            <ul className="space-y-3 p-3 sm:hidden" aria-label="Demo lead cards">
              {rows.map((l, i) => (
                <li key={l.name} className="rounded-xl border border-rule bg-ink-2 p-4" data-od-id={`lead-card-${i}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold text-paper">{l.name}</p>
                    <span className="shrink-0 rounded-full bg-ink-3 px-2.5 py-1 text-xs font-semibold tabular-nums text-paper">{l.score}/100</span>
                  </div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div><dt className="text-xs text-faint">Rating</dt><dd className="text-paper">{l.rating.toFixed(1)} · {l.reviews} reviews</dd></div>
                    <div><dt className="text-xs text-faint">Email</dt><dd className="break-all text-paper">{l.email ?? "None found"}</dd></div>
                    <div><dt className="text-xs text-faint">Phone</dt><dd className="text-paper">{l.phone ?? "None found"}</dd></div>
                    <div><dt className="text-xs text-faint">Website & socials</dt><dd className="text-paper">{l.website ? "Website found" : "No website"} · {l.socials} social profiles</dd></div>
                  </dl>
                  <div className="mt-3 h-1.5 rounded-full bg-ink-3" aria-label={`Lead score ${l.score} out of 100`}>
                    <div className="h-full rounded-full bg-scan" style={{ width: `${l.score}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <table className="hidden w-full min-w-[40rem] text-left text-sm sm:table">
              <caption className="sr-only">Demo leads for {ran}, sorted by score</caption>
              <thead className="sticky top-0 z-[1] bg-ink-2">
                <tr className="border-b border-rule text-xs text-faint">
                  <th scope="col" className="px-5 py-2.5 font-medium">Business</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Rating</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Email</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Contact</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.name} className="row-in border-b border-rule/70 transition-colors last:border-0 hover:bg-ink-3">
                    <td className="max-w-[13rem] truncate px-5 py-2.5 font-medium text-paper">{l.name}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-mute">
                      <Star aria-hidden className="mr-1 inline size-3.5 -translate-y-px fill-warm text-warm" />
                      {l.rating.toFixed(1)} <span className="text-faint">({l.reviews})</span>
                    </td>
                    <td className="max-w-[14rem] truncate px-3 py-2.5">
                      {l.email ? <span className="text-paper">{l.email}</span> : <span className="text-faint">none found</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="flex gap-1.5 text-faint">
                        <Phone aria-label={l.phone ? "Phone found" : "No phone"} className={cn("size-4", l.phone && "text-paper")} />
                        <Globe aria-label={l.website ? "Website found" : "No website"} className={cn("size-4", l.website && "text-paper")} />
                        <Mail aria-label={l.email ? "Email found" : "No email"} className={cn("size-4", l.email && "text-paper")} />
                      </span>
                    </td>
                    <td className="px-5 py-2.5">
                      <span className="flex items-center justify-end gap-2.5">
                        <span aria-hidden className="h-1.5 w-14 overflow-hidden rounded-full bg-ink-3">
                          <span className={cn("block h-full rounded-full", l.score >= 80 ? "bg-scan" : l.score >= 50 ? "bg-warm" : "bg-faint")} style={{ width: `${l.score}%` }} />
                        </span>
                        <span className={cn("w-7 text-right font-semibold tabular-nums", l.score >= 80 ? "text-scan" : "text-paper")}>{l.score}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </>
          )}
        </div>
      </div>
      <LiquidCloudBubble
        steps={SCRAPER_STEPS}
        position="bottom-right"
        accentColor="emerald"
      />
    </div>
  );
}
