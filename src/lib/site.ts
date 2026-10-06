/**
 * Single source of truth for everything that changes when the business changes:
 * contact channels, product copy, FAQs, routes.
 *
 * Anything marked TODO is a placeholder Hamza still needs to supply or confirm.
 */

export const site = {
  name: "valueble.ai",
  legalName: "Valueble AI",
  domain: "valuebleai.com",
  url: "https://valuebleai.com", // TODO: confirm final domain before deploy
  tagline: "AI systems that do the work your team runs out of hours for.",
  headline: "Find the customers. Answer them instantly.",
  description:
    "valueble.ai builds AI agents, a WhatsApp ordering bot for restaurants and a Google Maps lead scraper. One founder, honest scope, systems that hold up.",
  founder: "Hamza Khalil Bhatti",
  founderRole: "Founder & AI Systems Engineer",
  logo: "/brand/valueble-logo-black.svg",
} as const;

export const contact = {
  whatsappNumber: "923001794940",
  whatsappDisplay: "+92 300 179 4940",
  whatsappMessage: "Hi Hamza — I found valueble.ai and I'd like to talk about a project.",
  linkedin: "https://www.linkedin.com/in/hamza-khalil-34380923a",
  email: "hamzakhalilbhattibrothers@gmail.com",

  /**
   * `bookingOrderRise` is a product-specific cal.com event and must only be
   * used from OrderRise surfaces — sending an agency lead to a restaurant
   * demo loses the lead.
   *
   * TODO: `bookingGeneral` routes to the on-site contact page. Replace with a
   * generic cal.com discovery-call event when one exists.
   */
  bookingOrderRise: "https://cal.com/hamza-khalil-expyr5/meeting-for-orderrise",
  bookingGeneral: "/contact",
} as const;

/** Pre-fills WhatsApp with context so the first reply is not "which product?". */
export function waLink(message: string) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappUrl = waLink(contact.whatsappMessage);

export type ProductSlug = "lead-extractor" | "orderrise" | "ai-agents" | "voice-agent";

export type Faq = { q: string; a: string };

export type Product = {
  slug: ProductSlug;
  /** Canonical route. Legacy /products/[slug] URLs forward here. */
  path: string;
  index: string;
  name: string;
  kind: string;
  audience: string;
  price: string;
  priceNote?: string;
  tagline: string;
  summary: string;
  status: "Live" | "In private beta" | "Available now" | "Scoped per business";
  /** Accent token name, maps to --color-{accent}. */
  accent: "scan" | "warm" | "mind" | "voice";
  seo: { title: string; description: string };
  /** `eyebrow` is rendered inside the H1 as the keyword line; `headline` is the visible headline. */
  hero: { eyebrow: string; headline: string; sub: string };
  problem: { heading: string; body: string[] };
  steps: { title: string; body: string }[];
  features: { title: string; body: string }[];
  facts: { label: string; value: string }[];
  cta: { heading: string; body: string; label: string; href: string };
  faqs: Faq[];
};

export const products: Product[] = [
  {
    slug: "voice-agent",
    path: "/voice-agent",
    index: "01",
    name: "AI Voice Agent",
    kind: "AI receptionist",
    audience: "For businesses that live on the phone",
    price: "Custom",
    priceNote: "Scoped to your call volume",
    tagline: "An AI voice agent that answers every call.",
    summary:
      "An AI voice agent for business that answers every inbound call 24/7, books appointments, takes orders, qualifies leads and answers common questions in natural speech, then hands off to a person when it should.",
    status: "Scoped per business",
    accent: "voice",
    seo: {
      title: "AI Voice Agent for Business | Answers Every Call",
      description:
        "An AI voice agent that answers business calls 24/7, books appointments, takes orders, qualifies leads and hands off to a human when it matters.",
    },
    hero: {
      eyebrow: "AI voice agent for business",
      headline: "An AI voice agent that answers every call.",
      sub: "Calls at 11pm, during the dinner rush, or while you're with a customer. Answered, understood and handled.",
    },
    problem: {
      heading: "A missed call is a customer who rang the next number on the list.",
      body: [
        "Most small businesses still run on the phone, and the phone rings at the worst possible moments: mid-service, mid-appointment, after closing. Voicemail is where those calls go to die, and hold music is where they hang up.",
        "An answering service helps, but it reads from a script and cannot book, cannot take an order and cannot see your calendar. The call gets answered and the work still lands back on your desk.",
      ],
    },
    // TODO (owner): this capability list is draft marketing copy, not verified
    // product truth. Confirm each capability matches the actual product before
    // publishing, and trim anything not yet built.
    steps: [
      {
        title: "Call comes in",
        body: "On your existing business number, at any hour. No hold music, no queue, no voicemail.",
      },
      {
        title: "Agent understands",
        body: "It listens in natural speech, works out what the caller actually wants and asks a follow-up when it is not clear.",
      },
      {
        title: "Agent acts",
        body: "It books the appointment, takes the order, answers the question or captures the lead's details, depending on the call.",
      },
      {
        title: "Delivered to your tools or a human",
        body: "The outcome lands in your CRM, sheet or inbox. Anything ambiguous or expensive is transferred to a person.",
      },
    ],
    // TODO (owner): draft capability list — confirm before publishing.
    features: [
      { title: "Answers inbound calls instantly", body: "Every call picked up on the first ring, 24/7, including after hours and on holidays." },
      { title: "Books appointments and takes orders", body: "Turns a phone call into a confirmed booking or a complete order instead of a callback note." },
      { title: "Qualifies leads and captures details", body: "Asks the questions your team would ask and records name, need, budget and contact details." },
      { title: "Answers FAQs", body: "Opening hours, prices, location and the other questions your staff answer twenty times a day." },
      { title: "Speaks multiple languages and accents", body: "Callers can talk the way they normally talk, not the way a phone menu wants them to." },
      { title: "Confirms by WhatsApp or SMS", body: "The caller gets a written confirmation of what was agreed, so nothing relies on memory." },
      { title: "Logs everything", body: "Every call summarised into your CRM, a sheet or your inbox, so the record exists even when you were busy." },
      { title: "Transfers to a human", body: "Anything ambiguous or expensive goes to a person. Same human checkpoint as everything else I build." },
    ],
    facts: [
      { label: "Coverage", value: "24 / 7, every inbound call" },
      { label: "Hands off to", value: "A human, on anything ambiguous" },
      { label: "Logs into", value: "Your CRM, sheet or inbox" },
      { label: "Price", value: "Custom, scoped to your call volume" },
    ],
    cta: {
      heading: "Hear a demo call",
      body: "Message me and I will send you a recorded demo call, then we can talk through which of your calls are worth handing to an agent.",
      label: "Hear a demo call",
      // TODO (owner): attach a real demo recording and link it here.
      href: waLink("Hi Hamza — I'd like to hear a demo call from the AI voice agent. My business is:"),
    },
    // TODO (owner): verify latency, telephony provider, number porting and
    // language claims below against the real build before publishing.
    faqs: [
      {
        q: "What is an AI voice agent for business?",
        a: "It is an AI receptionist that picks up your business phone line, holds a natural spoken conversation, and does something useful with the call: books an appointment, takes an order, answers a common question or captures a lead. When a call needs a person, it transfers it.",
      },
      {
        q: "Can it handle AI phone answering after hours?",
        a: "Yes. After-hours and overflow calls are the main reason to have one. It answers when nobody else can, and the call summary is waiting for you in the morning.",
      },
      {
        q: "How is it different from an answering service?",
        a: "An answering service takes a message. A voice agent can act on the call, for example checking availability and booking the slot, or taking a full order, and then logging it into the tools you already use.",
      },
      {
        q: "Which calls should not go to an AI voice agent?",
        a: "Complaints, sensitive conversations, anything expensive or unusual, and callers who clearly want a person. I will tell you honestly which of your calls are worth automating and set the agent to transfer the rest.",
      },
      {
        q: "How fast does it respond, and does it sound robotic?",
        a: "Modern voice agents respond quickly enough to feel like a normal conversation, though there can be a short pause on complex requests. The best way to judge is to hear a demo call before deciding.",
      },
      {
        q: "How much does it cost?",
        a: "Pricing is custom and scoped to your call volume and what the agent needs to do. Book a call and you will get a straight number after scoping.",
      },
    ],
  },
  {
    slug: "lead-extractor",
    path: "/maps-lead-scraper",
    index: "02",
    name: "Maps Lead Scraper",
    kind: "Chrome extension",
    audience: "For agencies and sales teams",
    price: "$200 one-time",
    priceNote: "Not a subscription",
    tagline: "Turn any Google Maps search into a scored, contactable lead list.",
    summary:
      "A Chrome extension that reads a Google Maps result set, follows each business to its own website, and pulls out the contact surface — emails, phones, socials — then scores every lead and hands you a spreadsheet instead of forty browser tabs.",
    status: "Live",
    accent: "scan",
    seo: {
      title: "Google Maps Lead Scraper Chrome Extension | Valueble",
      description:
        "Turn any Google Maps search into a scored, contactable lead list. Email enrichment from business websites, CSV export, $200 one-time.",
    },
    hero: {
      eyebrow: "Google Maps lead scraper · Chrome extension",
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
      { title: "Give it your searches and a target", body: "One query or a whole list of them. Set how many valid leads you actually want, plus any filters — minimum rating, minimum reviews, must have an email." },
      { title: "It works the results panel", body: "It scrolls the Google Maps result list the way a person would, collecting listing links until it has enough queued to hit your target rather than stopping short." },
      { title: "Then it visits their websites", body: "For each business it opens the site listed on Maps and reads the pages where contact details actually live — pulling out email addresses and social profiles Maps never shows you." },
      { title: "Scored, filtered, exported", body: "Every lead gets a 0–100 contactability score. Export everything, or just the ones with emails, or just the high-quality ones — as CSV, JSON or plain text." },
    ],
    features: [
      { title: "Emails, which Maps never gives you", body: "The single most valuable field, and the one you cannot get from a Maps listing. It follows through to the business website to find it — including addresses written to dodge scrapers." },
      { title: "A contactability score on every lead", body: "Each business is scored out of 100 on how reachable it actually is — an email counts most, then a phone, then a website and social profiles. Sort by it and work the top of the list first." },
      { title: "Filters before you export, not after", body: "Minimum rating, minimum review count, must-have-email, must-have-phone, must-have-website. Set a target of 100 good leads and it keeps working until it has 100 good leads." },
      { title: "Socials as well as email", body: "Facebook, Instagram, LinkedIn, WhatsApp, X and YouTube profiles collected from the same pass, so you can reach a business on whichever channel it actually reads." },
      { title: "Resume, append, and a failure log", body: "Stop a run and pick it back up. Add to an existing list instead of starting over. Export the skipped and failed businesses separately so nothing quietly disappears." },
      { title: "No API, no bypassing anything", body: "It reads the public Google Maps interface and public website pages. No Places API bill, no CAPTCHA solving, no login walls, no proxy evasion — which is also why it keeps working." },
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
      href: waLink("Hi Hamza — I'd like a sample lead list from the Maps Lead Scraper. My category and cities are:"),
    },
    // TODO (owner): verify the legality answer with your own advice for the
    // markets you sell into; the wording below is deliberately general.
    faqs: [
      {
        q: "How do I scrape Google Maps leads to CSV?",
        a: "Install the extension, type a Google Maps search such as \"dentists in Lahore\", set how many leads you want and any filters, and press Start. When it finishes you export the list as CSV, JSON or plain text.",
      },
      {
        q: "Is this a Google Maps scraper with email enrichment?",
        a: "Yes. Maps listings do not show email addresses, so for each business it follows the website listed on Maps and reads the pages where contact details live, pulling out emails and social profiles.",
      },
      {
        q: "Is it a one-time purchase or a subscription?",
        a: "One-time. It costs $200 once. There is no subscription and no Places API bill, because it reads the public Google Maps interface rather than a paid API.",
      },
      {
        q: "What does the lead score mean?",
        a: "Every business gets a 0–100 contactability score. An email counts most, then a phone number, then a website and social profiles. Sort by it and work the most reachable leads first.",
      },
      {
        q: "Is scraping Google Maps legal?",
        a: "The extension only reads publicly visible pages and bypasses no access control: no CAPTCHA solving, no login walls, no proxy evasion. How you contact the businesses afterwards is governed by the outreach and data-protection rules where you and they operate, so check those for your market.",
      },
      {
        q: "Can I try it before buying?",
        a: "Yes. Tell me the category and the cities and I will run it and send you the first list before you pay for anything.",
      },
    ],
  },
  {
    slug: "orderrise",
    path: "/orderrise",
    index: "03",
    name: "OrderRise",
    kind: "WhatsApp AI agent",
    audience: "For restaurants and takeaways",
    price: "$50 / month",
    priceNote: "Per restaurant",
    tagline: "A restaurant's WhatsApp, answered instantly — even at 11pm on a Friday.",
    summary:
      "An AI ordering assistant that lives in the WhatsApp number a restaurant already gives out. It shows the menu, builds the cart, takes delivery details, and drops a finished order onto the kitchen screen.",
    status: "Live",
    accent: "warm",
    seo: {
      title: "WhatsApp Ordering Bot for Restaurants | OrderRise",
      description:
        "OrderRise is a WhatsApp AI agent that takes restaurant orders 24/7, builds the cart and sends a clean ticket to the kitchen. $50/month per restaurant.",
    },
    hero: {
      eyebrow: "WhatsApp ordering bot for restaurants",
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
      { title: "Customer sends a message", body: "To the same WhatsApp number already on the storefront, the flyer, and the Instagram bio. Nothing new to install." },
      { title: "The assistant shows the menu and builds the cart", body: "It answers questions, handles modifications, applies coupons, and confirms the order back before anything is sent." },
      { title: "The order lands on the dashboard", body: "A complete ticket — items, notes, address, delivery instructions — on the restaurant dashboard and the kitchen display at the same moment." },
      { title: "The customer gets kept in the loop", body: "Confirmation, receipt, and status updates go back through the same WhatsApp thread the order started in." },
    ],
    features: [
      { title: "Answers during the rush", body: "The hour when staff physically cannot reach the phone is the hour the assistant is most useful." },
      { title: "Live dashboard", body: "Every order in one place, in order, with the state it is in — instead of scattered through a chat history." },
      { title: "Kitchen display", body: "A separate view built to be read at a distance, in a hurry, by someone holding a pan." },
      { title: "Pickup and delivery", body: "Addresses, delivery instructions, and driver details collected properly, once, in a structured form." },
      { title: "Coupons and loyalty", body: "Promo codes and repeat-customer rewards handled inside the conversation." },
      { title: "Analytics that answer questions", body: "What sells, when the peaks are, and which items carry the night." },
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
      label: "Book an OrderRise demo",
      href: contact.bookingOrderRise,
    },
    // TODO (owner): confirm the WhatsApp Business API / number requirements and
    // setup timeline answers against how OrderRise is actually onboarded.
    faqs: [
      {
        q: "How do I take restaurant orders on WhatsApp automatically?",
        a: "OrderRise connects an AI ordering assistant to your restaurant's WhatsApp number. Customers message as they already do; the assistant shows the menu, builds the cart, takes the address and confirms the order, then sends a complete ticket to your dashboard and kitchen display.",
      },
      {
        q: "How much does OrderRise cost?",
        a: "$50 a month per restaurant. Menu setup and onboarding are included.",
      },
      {
        q: "Do my customers need to download an app?",
        a: "No. They order inside WhatsApp, which they already use. No app to download, no link to trust and no account to make.",
      },
      {
        q: "Do I need a WhatsApp Business account?",
        a: "An automated assistant normally runs on WhatsApp's business platform rather than a personal app. Requirements depend on your number and region, and setup is handled during onboarding so you know exactly what is needed before going live.",
      },
      {
        q: "Does it handle pickup, delivery and coupons?",
        a: "Yes. It collects addresses and delivery instructions in a structured form, handles pickup orders, and applies promo codes and repeat-customer rewards inside the conversation.",
      },
      {
        q: "Can I try it first?",
        a: "Yes. There is a live demo restaurant running on it. Book a demo and you can place an order yourself and see both the customer side and the kitchen side.",
      },
    ],
  },
  {
    slug: "ai-agents",
    path: "/custom-ai-agents",
    index: "04",
    name: "Custom AI Agents",
    kind: "Built for your business",
    audience: "For any repetitive process",
    price: "Project-based",
    priceNote: "Starts with a 20-minute call",
    tagline: "The repetitive part of your operation, handed to something that does not get tired.",
    summary:
      "Agents built around one specific process you already run — qualifying inbound leads, answering the same forty questions, moving data between tools that were never meant to talk. Scoped to a real workflow, not a demo.",
    status: "Available now",
    accent: "mind",
    seo: {
      title: "Custom AI Agents and Automation for Small Business",
      description:
        "Custom AI agents built around one process you already run: lead qualification, support, data entry between tools. Honest scope, human checkpoints.",
    },
    hero: {
      eyebrow: "Custom AI agents · business automation",
      headline: "Most businesses do not need AI. They need one job done every day without fail.",
      sub: "I build the agent for that job — the one your team does manually, at volume, and resents. Then I make it hold up in production.",
    },
    problem: {
      heading: "The gap is never the model. It's everything around it.",
      body: [
        "Getting a language model to produce something impressive takes an afternoon. Getting a system that runs unattended for six months — that handles the customer who types in three languages, the tool that rate-limits at the worst moment, the edge case nobody described in the brief — is a different job entirely.",
        "That second job is the one worth paying for, and it is the one I do. Every product on this site started as a specific business problem and was built until it held.",
      ],
    },
    steps: [
      { title: "We find the one process", body: "A short call to identify the task that is high-volume, rules-shaped, and currently eating hours. Not a strategy deck — one process." },
      { title: "I scope it honestly", body: "What can be automated fully, what can be automated with a human checkpoint, and what should stay manual. You get told which parts are not worth it." },
      { title: "Build and connect", body: "The agent gets built against your real tools — WhatsApp, email, your CRM, your sheets, your site — and tested against your real messy inputs." },
      { title: "Hand over and support", body: "You get something you can run, with the failure modes documented and a person to call when reality does something new." },
    ],
    features: [
      { title: "Customer-facing conversation agents", body: "Support, qualification, booking, and ordering — on WhatsApp, web chat, or wherever your customers already are." },
      { title: "Lead research and enrichment", body: "Pipelines that find prospects, verify contact details, and score them before anyone on your team opens a tab." },
      { title: "Internal tooling", body: "The dashboard, extension, or script that removes a recurring manual step from your week." },
      { title: "Integration work", body: "Getting the systems you already pay for to hand data to each other reliably." },
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
      href: waLink("Hi Hamza — I'd like to scope a custom AI agent. The process I want handled is:"),
    },
    faqs: [
      {
        q: "What kind of processes can a custom AI agent automate?",
        a: "Tasks that are high-volume and rules-shaped: qualifying inbound leads, answering the same questions, booking, ordering, and moving data between tools that were never meant to talk.",
      },
      {
        q: "How long does a first build take?",
        a: "A typical first build takes two to four weeks, after a 20-minute scoping call to find the one process worth starting with.",
      },
      {
        q: "What does it cost?",
        a: "It is project-based. After the scoping call you get a clear scope, including which parts are not worth automating, and a price for the build.",
      },
      {
        q: "Who owns the system?",
        a: "You do. You own what gets built and the data that runs through it. No platform commission and no per-seat licence on your own workflow.",
      },
      {
        q: "What happens when the agent is not sure?",
        a: "It stops and asks a person. Anything ambiguous or expensive goes through a human checkpoint before it is acted on.",
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Display order for product grids: voice first, then the three originals. */
export const productOrder: ProductSlug[] = ["voice-agent", "lead-extractor", "orderrise", "ai-agents"];

export const homeFaqs: Faq[] = [
  {
    q: "What does valueble.ai build?",
    a: "Four things: an AI voice agent that answers business calls, the Maps Lead Scraper Chrome extension, OrderRise (a WhatsApp ordering bot for restaurants), and custom AI agents built around one process you already run.",
  },
  {
    q: "Who will I actually work with?",
    a: "Hamza Khalil Bhatti, the founder. He scopes the work, builds it and supports it after it ships. There is no account manager in between.",
  },
  {
    q: "What do the products cost?",
    a: "The Maps Lead Scraper is $200 one-time. OrderRise is $50 a month per restaurant. The AI voice agent is custom, scoped to your call volume. Custom AI agents are project-based.",
  },
  {
    q: "Will you tell me if something is not worth automating?",
    a: "Yes, and it is the first thing you will hear on any project. A system that handles eighty percent of a process reliably is worth more than one that claims all of it and fails on the cases that matter.",
  },
  {
    q: "How do I get started?",
    a: "Message on WhatsApp, email or LinkedIn and describe the task. If it is not a fit, you will be told so.",
  },
];

export const nav: { label: string; href: string }[] = [
  { label: "Products", href: "/#products" },
  { label: "Voice Agent", href: "/voice-agent" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
