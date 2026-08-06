import Link from "next/link";
import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";
import { ArrowUpRight, Body, BoxButton, Head, List, Section } from "@/components/ui";
import { contact, products, whatsappUrl } from "@/lib/site";

const BlockField = dynamic(() =>
  import("@/components/block-field").then((m) => m.BlockField),
);

/**
 * Home.
 *
 * Problem → solution → what it is → who builds it → contact. Five sections and
 * nothing else. The argument has to land for someone who has never heard of
 * any of this, so it is told in plain business terms first and only names the
 * products once the reader already wants them.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Section label="The problem" id="problem">
        <Head>Small teams lose the work before they ever get to do it</Head>

        <div className="mt-8 space-y-6">
          <Body>
            The businesses that need help most are the ones with the fewest spare hours. To
            grow, the same handful of people are expected to:
          </Body>

          <List
            items={[
              "Find and qualify prospects by hand, one browser tab at a time",
              "Answer every enquiry personally — including the ones at 11pm on a Friday",
              "Re-key the same information between tools that were never meant to talk",
              "Repeat all of it tomorrow, at the same volume, without dropping anything",
            ]}
          />

          <Body>
            So it gets done badly, or late, or not at all. The lost revenue never shows up on
            a report, because a customer who was never reached and a message that was never
            answered leave no record behind.
          </Body>
        </div>
      </Section>

      {/* Full-bleed scene break, in place of the reference's video interstitial. */}
      <SceneBreak />

      <Section label="The solution" id="solution">
        <Head>Systems that hold the line without being asked</Head>

        <div className="mt-8 space-y-6">
          <Body>
            valueble.ai builds the software that absorbs that load. Not advice, not a
            strategy deck — running systems, pointed at one specific job each, built until
            they hold up against real customers and real mess.
          </Body>

          <List
            items={[
              "Reach a whole market without opening a single browser tab",
              "Answer every customer instantly, in the app they already use",
              "Hand a recurring internal process to something that never forgets it",
              "Own the system and its data outright — no platform commission, no lock-in",
            ]}
          />
        </div>
      </Section>

      <Section label="How it works" id="work">
        <Head>Three products, one idea</Head>
        <Body className="mt-8">
          Each one started as a real problem in a real business and was built until it
          worked. Two are live and in use today.
        </Body>

        <ul className="mt-16 space-y-0">
          {products.map((product) => (
            <li key={product.slug} className="hairline reveal">
              <Link
                href={`/products/${product.slug}`}
                className="group block py-10 transition-opacity duration-300 hover:opacity-65"
              >
                <div className="flex items-baseline gap-5">
                  <span className="text-fine text-faint">{product.index}</span>
                  <div className="flex-1">
                    <h3 className="flex items-center gap-3 text-sub text-paper">
                      {product.name}
                      <ArrowUpRight className="size-3 shrink-0 opacity-40 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </h3>
                    <p className="mt-1 text-fine text-faint">
                      {product.kind} · {product.status}
                    </p>
                    <p className="mt-4 max-w-[52ch] text-mute">{product.tagline}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="About us" id="approach">
        <Head>Built by one person who ships</Head>

        <div className="mt-8 space-y-10">
          <div className="space-y-3">
            <h3 className="text-paper">Who</h3>
            <Body>
              I am Hamza Khalil Bhatti. I build AI agents and growth tools for businesses and
              agencies, and I do the work myself — scoping, building, and supporting it after
              it ships. You talk to the person writing the code.
            </Body>
          </div>

          <div className="space-y-3">
            <h3 className="text-paper">How</h3>
            <Body>
              Every engagement starts with one process, not a platform. We find the task that
              is high-volume, rules-shaped, and currently eating hours, and I tell you plainly
              which parts are worth automating and which are not.
            </Body>
          </div>

          <div className="space-y-3">
            <h3 className="text-paper">Why it holds up</h3>
            <Body>
              Getting a model to produce something impressive takes an afternoon. Getting a
              system that runs unattended for six months — through the customer who types in
              three languages and the API that rate-limits at the worst moment — is the
              actual job, and it is the one I do.
            </Body>
          </div>
        </div>
      </Section>

      <Section label="Get started">
        <Head>Bring the process, not the spec</Head>
        <Body className="mt-8">
          You do not need to know how it should be built. You need to know which twenty hours
          a month you want back. Tell me what those hours go on and I will tell you honestly
          whether I can take them.
        </Body>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <BoxButton href={whatsappUrl}>Message me on WhatsApp</BoxButton>
          <Link
            href={contact.bookingGeneral}
            className="reveal inline-flex items-center gap-2 py-3.5 text-mute transition-colors duration-200 hover:text-paper"
          >
            Or see every way to reach me
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </Section>
    </>
  );
}

/**
 * The scene, full-bleed, as a break between arguments — the same role the
 * reference's video interstitials play. Deliberately shallow: it is punctuation,
 * not a second hero.
 */
function SceneBreak() {
  return (
    <div className="relative h-[45svh] min-h-[18rem] w-full overflow-hidden md:h-[60svh]">
      <BlockField className="h-full w-full" density={9} />
      {/* Fades the strip into the black above and below it so it has no seams. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#000_0%,transparent_22%,transparent_78%,#000_100%)]"
      />
    </div>
  );
}
