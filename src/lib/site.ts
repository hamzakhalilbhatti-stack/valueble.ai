/**
 * Single source of truth for everything that changes when the business changes:
 * contact channels, product copy, proof numbers.
 *
 * Anything marked TODO is a placeholder Hamza still needs to supply.
 */

export const site = {
  name: "valueble.ai",
  legalName: "Valueble AI",
  domain: "valuebleai.com",
  url: "https://valuebleai.com", // TODO: confirm final domain before deploy
  tagline: "AI systems that do the work your team runs out of hours for.",
  description:
    "valueble.ai builds AI agents and growth tools for businesses and agencies — lead extraction, WhatsApp ordering agents, and custom automation built around how you already work.",
  founder: "Hamza Khalil Bhatti",
  founderRole: "Founder & AI Systems Engineer",
} as const;

export const contact = {
  whatsappNumber: "923001794940",
  whatsappMessage: "Hi Hamza — I found valueble.ai and I'd like to talk about a project.",
  linkedin: "https://www.linkedin.com/in/hamza-khalil-34380923a",
  email: "hamzakhalilbhattibrothers@gmail.com",

  /**
   * Booking destinations.
   *
   * `orderRise` is a product-specific cal.com event and must only be used from
   * OrderRise surfaces — sending an agency lead to a restaurant-ordering demo
   * loses the lead.
   *
   * TODO: `general` currently routes to the on-site contact page, which is
   * neutral and always works. Replace with a generic cal.com discovery-call
   * event type when one exists.
   */
  bookingOrderRise: "https://cal.com/hamza-khalil-expyr5/meeting-for-orderrise",
  bookingGeneral: "/contact",
} as const;

/** Pre-fills WhatsApp with context so the first reply is not "which product?". */
function waLink(message: string) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Per-product conversion destinations. Each product page and each orbit CTA uses its own. */
export const productCta: Record<ProductSlug, { href: string; label: string }> = {
  "lead-extractor": {
    href: waLink(
      "Hi Hamza — I'd like a sample lead list from the Maps Lead Scraper. My category and cities are:",
    ),
    label: "Ask for a sample list",
  },
  orderrise: {
    href: "https://cal.com/hamza-khalil-expyr5/meeting-for-orderrise",
    label: "Book an OrderRise demo",
  },
  "ai-agents": {
    href: waLink("Hi Hamza — I'd like to scope a custom AI agent. The process I want handled is:"),
    label: "Start a scoping conversation",
  },
};

/** wa.me deep link with the intro message pre-filled. */
export const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  contact.whatsappMessage,
)}`;

export type ProductSlug = "lead-extractor" | "orderrise" | "ai-agents";

export type Product = {
  slug: ProductSlug;
  index: string;
  name: string;
  /** Short kicker used in nav and index rows. */
  kind: string;
  /**
   * Seeds the block-field arrangement on this product's hero. Different seed
   * per product, so each page shows a different corner of the same world.
   */
  seed: number;
  /**
   * Who this is for, in their own words. Shown before the product name on the
   * home index — a visitor's first question is "is this for me", and two of
   * these three are bought by completely different people.
   */
  audience: string;
  /**
   * What it costs, stated plainly. Only OrderRise has a confirmed figure; the
   * other two say what actually happens next instead of inventing a number.
   */
  price: string;
  tagline: string;
  /** One-paragraph summary used on the home index and in metadata. */
  summary: string;
  status: "Live" | "In private beta" | "Available now";
  hero: {
    headline: string;
    sub: string;
  };
  problem: {
    heading: string;
    body: string[];
  };
  steps: { title: string; body: string }[];
  features: { title: string; body: string }[];
  facts: { label: string; value: string }[];
  cta: {
    heading: string;
    body: string;
    label: string;
  };
};

export const products: Product[] = [
  {
    slug: "lead-extractor",
    // Copy below is written against the verified v5.2 source (manifest, content.js,
    // popup.js). Do not add capabilities here that the extension does not have.
    index: "01",
    name: "Maps Lead Scraper",
    kind: "Chrome extension",
    seed: 4021,
    audience: "For agencies and sales teams",
    price: "$200 one-time",
    tagline: "Turn any Google Maps search into a scored, contactable lead list.",
    summary:
      "A Chrome extension that reads a Google Maps result set, follows each business to its own website, and pulls out the contact surface — emails, phones, socials — then scores every lead and hands you a spreadsheet instead of forty browser tabs.",
    status: "Live",
    hero: {
      headline: "Every business on the map, with a way to reach them.",
      sub: "Search once. Export a lead list your sales team can actually work from — filtered, deduplicated, and ranked by how contactable each business actually is.",
    },
    problem: {
      heading: "Prospecting on Maps is real work pretending to be easy.",
      body: [
        "Google Maps already knows every dentist in Lahore, every gym in Dubai, every restaurant in a three-mile radius. What it does not give you is a list. It gives you a scroll — one card at a time, one tab at a time, phone numbers you can read but not copy in bulk, and websites you have to open individually to find an email on.",
        "So the work gets handed to a VA, or to an intern, or to nobody. A list of 400 prospects becomes a weekend. Most teams settle for the first 40 and call it a market.",
      ],
    },
    steps: [
      {
        title: "Give it your searches and a target",
        body: "One query or a whole list of them. Set how many valid leads you actually want, plus any filters — minimum rating, minimum reviews, must have an email.",
      },
      {
        title: "It works the results panel",
        body: "It scrolls the Google Maps result list the way a person would, collecting listing links until it has enough queued to hit your target rather than stopping short.",
      },
      {
        title: "Then it visits their websites",
        body: "For each business it opens the site listed on Maps and reads the pages where contact details actually live — pulling out email addresses and social profiles Maps never shows you.",
      },
      {
        title: "Scored, filtered, exported",
        body: "Every lead gets a 0–100 contactability score. Export everything, or just the ones with emails, or just the high-quality ones — as CSV, JSON or plain text.",
      },
    ],
    features: [
      {
        title: "Emails, which Maps never gives you",
        body: "The single most valuable field, and the one you cannot get from a Maps listing. It follows through to the business website to find it — including addresses written to dodge scrapers.",
      },
      {
        title: "A contactability score on every lead",
        body: "Each business is scored out of 100 on how reachable it actually is — an email counts most, then a phone, then a website and social profiles. Sort by it and work the top of the list first.",
      },
      {
        title: "Filters before you export, not after",
        body: "Minimum rating, minimum review count, must-have-email, must-have-phone, must-have-website. Set a target of 100 good leads and it keeps working until it has 100 good leads.",
      },
      {
        title: "Socials as well as email",
        body: "Facebook, Instagram, LinkedIn, WhatsApp, X and YouTube profiles collected from the same pass, so you can reach a business on whichever channel it actually reads.",
      },
      {
        title: "Resume, append, and a failure log",
        body: "Stop a run and pick it back up. Add to an existing list instead of starting over. Export the skipped and failed businesses separately so nothing quietly disappears.",
      },
      {
        title: "No API, no bypassing anything",
        body: "It reads the public Google Maps interface and public website pages. No Places API bill, no CAPTCHA solving, no login walls, no proxy evasion — which is also why it keeps working.",
      },
    ],
    facts: [
      { label: "Price", value: "$200 one-time — not a subscription" },
      { label: "Platform", value: "Chrome / Chromium" },
      { label: "Version", value: "5.2" },
      { label: "Enriches from", value: "Business websites" },
      { label: "Exports", value: "CSV · JSON · TXT" },
      { label: "Lead score", value: "0–100 per business" },
      { label: "API cost", value: "None" },
    ],
    cta: {
      heading: "Want it pointed at your market?",
      body: "Tell me the category and the cities. I will run it and send you the first list before you pay for anything.",
      label: "Ask for a sample list",
    },
  },
  {
    slug: "orderrise",
    index: "02",
    name: "OrderRise",
    kind: "WhatsApp AI agent",
    seed: 7734,
    audience: "For restaurants and takeaways",
    price: "$50 / month",
    tagline: "A restaurant's WhatsApp, answered instantly — even at 11pm on a Friday.",
    summary:
      "An AI ordering assistant that lives in the WhatsApp number a restaurant already gives out. It shows the menu, builds the cart, takes delivery details, and drops a finished order onto the kitchen screen.",
    status: "Live",
    hero: {
      headline: "The number is already on the door. Now it answers.",
      sub: "Customers order in WhatsApp — no app to download, no link to trust, no account to make. The kitchen sees a clean ticket. Nobody misses a rush.",
    },
    problem: {
      heading: "Every unanswered message is a paid order that walked.",
      body: [
        "Restaurants already take orders on WhatsApp. It works right up until it doesn't — the phone is behind the counter during the rush, three people are typing at once, an address gets misread, and an order that was worth money becomes an argument.",
        "The usual fix is a delivery platform that takes a third of the ticket, or an app nobody installs. Neither one gives the restaurant back the thing it actually lost, which is the ability to answer.",
      ],
    },
    steps: [
      {
        title: "Customer sends a message",
        body: "To the same WhatsApp number already on the storefront, the flyer, and the Instagram bio. Nothing new to install.",
      },
      {
        title: "The assistant shows the menu and builds the cart",
        body: "It answers questions, handles modifications, applies coupons, and confirms the order back before anything is sent.",
      },
      {
        title: "The order lands on the dashboard",
        body: "A complete ticket — items, notes, address, delivery instructions — on the restaurant dashboard and the kitchen display at the same moment.",
      },
      {
        title: "The customer gets kept in the loop",
        body: "Confirmation, receipt, and status updates go back through the same WhatsApp thread the order started in.",
      },
    ],
    features: [
      {
        title: "Answers during the rush",
        body: "The hour when staff physically cannot reach the phone is the hour the assistant is most useful.",
      },
      {
        title: "Live dashboard",
        body: "Every order in one place, in order, with the state it is in — instead of scattered through a chat history.",
      },
      {
        title: "Kitchen display",
        body: "A separate view built to be read at a distance, in a hurry, by someone holding a pan.",
      },
      {
        title: "Pickup and delivery",
        body: "Addresses, delivery instructions, and driver details collected properly, once, in a structured form.",
      },
      {
        title: "Coupons and loyalty",
        body: "Promo codes and repeat-customer rewards handled inside the conversation.",
      },
      {
        title: "Analytics that answer questions",
        body: "What sells, when the peaks are, and which items carry the night.",
      },
    ],
    facts: [
      { label: "Channel", value: "WhatsApp" },
      { label: "Price", value: "$50 / month per restaurant" },
      { label: "Includes", value: "Menu setup & onboarding" },
      { label: "Customer app required", value: "None" },
    ],
    cta: {
      heading: "Talk to the demo before you talk to me.",
      body: "There is a live restaurant running on it. Message it, place an order, and see the whole flow from the customer's side.",
      label: "Try the WhatsApp demo",
    },
  },
  {
    slug: "ai-agents",
    index: "03",
    name: "Custom AI Agents",
    kind: "Built for your business",
    seed: 1518,
    audience: "For any repetitive process",
    price: "Project-based",
    tagline: "The repetitive part of your operation, handed to something that does not get tired.",
    summary:
      "Agents built around one specific process you already run — qualifying inbound leads, answering the same forty questions, moving data between tools that were never meant to talk. Scoped to a real workflow, not a demo.",
    status: "Available now",
    hero: {
      headline: "Most businesses do not need AI. They need one job done every day without fail.",
      sub: "I build the agent for that job — the one your team does manually, at volume, and resents. Then I make it hold up in production.",
    },
    problem: {
      heading: "The gap is never the model. It's everything around it.",
      body: [
        "Getting a language model to produce something impressive takes an afternoon. Getting a system that runs unattended for six months — that handles the customer who types in three languages, the tool that rate-limits at the worst moment, the edge case nobody described in the brief — is a different job entirely.",
        "That second job is the one worth paying for, and it is the one I do. Both products on this site started as a specific business problem and were built until they held.",
      ],
    },
    steps: [
      {
        title: "We find the one process",
        body: "A short call to identify the task that is high-volume, rules-shaped, and currently eating hours. Not a strategy deck — one process.",
      },
      {
        title: "I scope it honestly",
        body: "What can be automated fully, what can be automated with a human checkpoint, and what should stay manual. You get told which parts are not worth it.",
      },
      {
        title: "Build and connect",
        body: "The agent gets built against your real tools — WhatsApp, email, your CRM, your sheets, your site — and tested against your real messy inputs.",
      },
      {
        title: "Hand over and support",
        body: "You get something you can run, with the failure modes documented and a person to call when reality does something new.",
      },
    ],
    features: [
      {
        title: "Customer-facing conversation agents",
        body: "Support, qualification, booking, and ordering — on WhatsApp, web chat, or wherever your customers already are.",
      },
      {
        title: "Lead research and enrichment",
        body: "Pipelines that find prospects, verify contact details, and score them before anyone on your team opens a tab.",
      },
      {
        title: "Internal tooling",
        body: "The dashboard, extension, or script that removes a recurring manual step from your week.",
      },
      {
        title: "Integration work",
        body: "Getting the systems you already pay for to hand data to each other reliably.",
      },
    ],
    facts: [
      { label: "Engagement", value: "Project-based" },
      { label: "Starts with", value: "A 20-minute scoping call" },
      { label: "Typical first build", value: "2–4 weeks" },
      { label: "You own", value: "The system and its data" },
    ],
    cta: {
      heading: "Bring the process, not the spec.",
      body: "You do not need to know how it should be built. You need to know which twenty hours a month you want back.",
      label: "Book a scoping call",
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Numbers shown on the home page. TODO: replace every one of these with a real figure. */
/**
 * Stage 7 proof numbers.
 *
 * PLACEHOLDER — every figure below is unverified and flagged in the UI. These
 * must be replaced with real measured numbers before this site goes public;
 * shipping invented statistics on a page selling credibility is the fastest
 * way to lose it.
 */
export const proofPointsArePlaceholder = true;

export const proofPoints: { value: string; label: string }[] = [
  { value: "2", label: "Products live and in the hands of paying users" },
  { value: "$50", label: "Monthly cost of replacing a missed-order problem" },
  { value: "24/7", label: "Hours the agents cover that staff cannot" },
];

export const nav: { label: string; href: string }[] = [
  { label: "Work", href: "/#work" },
  { label: "Approach", href: "/#approach" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
