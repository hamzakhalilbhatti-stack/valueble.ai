import { contact, site, type Faq, type Product } from "@/lib/site";

/**
 * JSON-LD. Only ever describes content that is visible on the page it is
 * rendered on. No aggregateRating, no reviews — there are none to cite yet.
 * TODO (owner): add Review/AggregateRating only once real, verifiable reviews exist.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; `<` is escaped to avoid </script> breakouts.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}${site.logo}`,
  email: contact.email,
  founder: { "@id": `${site.url}/#founder` },
  sameAs: [contact.linkedin],
};

export const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#founder`,
  name: site.founder,
  jobTitle: site.founderRole,
  worksFor: { "@id": `${site.url}/#organization` },
  url: `${site.url}/about`,
  sameAs: [contact.linkedin],
};

export function faqLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href === "/" ? "" : item.href}`,
    })),
  };
}

export function productLd(product: Product) {
  const url = `${site.url}${product.path}`;
  const provider = { "@id": `${site.url}/#organization` };

  if (product.slug === "lead-extractor") {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: product.name,
      url,
      description: product.summary,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Chrome",
      softwareVersion: "5.2",
      publisher: provider,
      offers: {
        "@type": "Offer",
        price: "200",
        priceCurrency: "USD",
        description: "One-time purchase, not a subscription",
        url,
      },
    };
  }
  if (product.slug === "orderrise") {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: product.name,
      url,
      description: product.summary,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, WhatsApp",
      publisher: provider,
      offers: {
        "@type": "Offer",
        price: "50",
        priceCurrency: "USD",
        url,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "50",
          priceCurrency: "USD",
          unitText: "MONTH",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        },
      },
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: product.name,
    serviceType: product.slug === "voice-agent" ? "AI voice agent / AI receptionist" : "Custom AI agents and business automation",
    url,
    description: product.summary,
    provider,
    areaServed: "Worldwide",
  };
}
