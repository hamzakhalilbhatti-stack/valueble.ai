/**
 * File-based blog. Each post is a typed object with real metadata and a
 * structured outline. Add a post by adding an entry here; the index, the post
 * route, the sitemap and the OG image all pick it up automatically.
 *
 * These are STARTER STUBS: each section holds an outline of what the article
 * will cover, written only from facts already on the site. TODO (owner):
 * write the full articles before promoting them, and remove `draft: true`
 * once a post is complete. Drafts render with an "Outline" badge; `todo`
 * notes on sections are never rendered.
 */

export type PostSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** TODO note for the owner. Never rendered. */
  todo?: string;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  draft: boolean;
  keyword: string;
  related: { label: string; href: string };
  intro: string;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "take-restaurant-orders-on-whatsapp-automatically",
    title: "How to take restaurant orders on WhatsApp automatically",
    description:
      "A practical outline of how a restaurant can take WhatsApp orders automatically: menu, cart, address, confirmation and a clean kitchen ticket.",
    date: "2026-10-06",
    draft: true,
    keyword: "take restaurant orders on WhatsApp automatically",
    related: { label: "OrderRise, the WhatsApp ordering bot for restaurants", href: "/orderrise" },
    intro:
      "Restaurants already take orders on WhatsApp. It works right up until the rush, when the phone is behind the counter and three people are typing at once. This guide outlines what it takes to automate that without losing the personal channel customers already use.",
    sections: [
      {
        heading: "Why WhatsApp orders break during the rush",
        bullets: [
          "The phone is behind the counter while staff are serving",
          "Several customers type at once and messages get missed",
          "Addresses and modifications get misread",
          "The alternatives: delivery platforms that take a share of the ticket, or an app nobody installs",
        ],
      },
      {
        heading: "What an automated WhatsApp ordering flow needs to do",
        bullets: [
          "Show the menu and answer questions about it",
          "Build the cart, including modifications and coupons",
          "Collect the address and delivery instructions in a structured form",
          "Confirm the order back before anything is sent to the kitchen",
          "Send a complete ticket to the dashboard and kitchen display",
          "Keep the customer updated in the same WhatsApp thread",
        ],
      },
      {
        heading: "What to check before going live",
        todo: "outline WhatsApp Business platform requirements, menu setup, and how onboarding works, only from verified details.",
      },
      {
        heading: "When a person should still step in",
        todo: "complaints, unusual requests and large orders. Explain the handoff in plain terms.",
      },
    ],
  },
  {
    slug: "scrape-google-maps-leads-for-outreach",
    title: "How to scrape Google Maps leads for outreach",
    description:
      "An outline for turning a Google Maps search into a scored, contactable lead list with emails, filters and CSV export, without a paid API.",
    date: "2026-10-06",
    draft: true,
    keyword: "scrape Google Maps leads to CSV",
    related: { label: "the Maps Lead Scraper Chrome extension", href: "/maps-lead-scraper" },
    intro:
      "Google Maps already knows every dentist in Lahore and every gym in Dubai. What it does not give you is a list. This guide outlines how to turn a Maps search into a lead list a sales team can actually work from.",
    sections: [
      {
        heading: "Why Maps prospecting takes so long by hand",
        bullets: [
          "Results arrive one card at a time",
          "Phone numbers can be read but not copied in bulk",
          "Emails are not on the listing at all; they live on each business website",
        ],
      },
      {
        heading: "The workflow, step by step",
        bullets: [
          "Choose the search queries and a target number of valid leads",
          "Set filters before export: minimum rating, minimum reviews, must have email",
          "Collect listings from the results panel",
          "Visit each business website to find emails and social profiles",
          "Score each lead by how contactable it is, then export to CSV, JSON or TXT",
        ],
      },
      {
        heading: "Staying on the right side of the line",
        todo: "explain reading only public pages, no CAPTCHA solving or login walls, and that outreach rules depend on the recipient's country. Have this section reviewed before publishing.",
      },
      {
        heading: "Working the list",
        todo: "how to use the 0–100 score to prioritise outreach.",
      },
    ],
  },
  {
    slug: "ai-voice-agent-vs-answering-service-for-restaurants",
    title: "AI voice agent vs answering service for restaurants",
    description:
      "An honest comparison outline: what an AI voice agent and a human answering service each do well for restaurants, and which calls belong with a person.",
    date: "2026-10-06",
    draft: true,
    keyword: "AI phone answering after hours",
    related: { label: "the AI voice agent for business", href: "/voice-agent" },
    intro:
      "Calls at 11pm, during the dinner rush, or while staff are with a customer. This guide compares the two common fixes, an answering service and an AI voice agent, without pretending either one is right for every call.",
    sections: [
      {
        heading: "What a missed call costs a restaurant",
        todo: "use only real, sourced figures here, or describe the cost qualitatively. Do not invent statistics.",
      },
      {
        heading: "What an answering service does",
        bullets: ["Answers and takes a message", "Reads from a script", "Usually cannot book, take an order or update your systems"],
      },
      {
        heading: "What an AI voice agent does",
        bullets: [
          "Answers every call, including after hours",
          "Takes orders and bookings in natural speech",
          "Answers FAQs such as hours, prices and location",
          "Logs the call and transfers anything ambiguous to a person",
        ],
        todo: "confirm each capability against the actual product before publishing.",
      },
      {
        heading: "Which calls should still go to a person",
        bullets: ["Complaints", "Large or unusual orders", "Anything sensitive", "Callers who ask for a human"],
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
