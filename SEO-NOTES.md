# SEO-NOTES — for the owner

## 1. Google Search Console
1. Go to https://search.google.com/search-console and add a **Domain** property for
   `valuebleai.com`.
2. Verify with the DNS TXT record Google gives you (add it at your domain registrar). DNS
   verification covers http/https and www/non-www in one go.
3. Sitemaps → submit `https://valuebleai.com/sitemap.xml`.
4. URL Inspection → request indexing for `/`, `/voice-agent`, `/orderrise`,
   `/maps-lead-scraper`, `/custom-ai-agents`, `/pricing`.
5. Check Pages → "Why pages aren't indexed" after a week. The old `/products/*` URLs are
   meant to show as "Excluded by noindex" (they forward to the new pages).

## 2. Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters and choose **Import from Google Search Console**
   (fastest), or verify with a DNS CNAME / meta tag.
2. Submit `https://valuebleai.com/sitemap.xml`.
3. Bing also feeds DuckDuckGo, Yahoo and ChatGPT search.

## 3. Fix the LinkedIn homepage URL
Your LinkedIn profile website field currently shows **valueleai.com** (missing the "b").
Change it to `https://valuebleai.com`. Do the same anywhere else the domain is listed
(WhatsApp Business profile, Instagram bio, Chrome Web Store listing, email signature).

## 4. Listings worth doing
- **Chrome Web Store**: list Maps Lead Scraper with screenshots, the $200 one-time price and a
  link to `/maps-lead-scraper`. A real store rating can later go in the proof block.
- **Product Hunt**: launch OrderRise or the scraper (one at a time) and link the product page.
- **AlternativeTo**: list the scraper as an alternative to paid Maps scrapers and OrderRise as
  an alternative to delivery-platform ordering.
- Google Business Profile, if you want to appear for local searches.

## 5. Before you promote anything
- Confirm every voice agent capability on `/voice-agent` matches the real product.
- Finish the three blog outlines in `src/content/blog.ts`.
- Keep `site.url` in `src/lib/site.ts` matching the live domain; it drives canonicals,
  the sitemap and OG images.

## 6. Keywords to track (15)
| # | Keyword | Target page |
| --- | --- | --- |
| 1 | whatsapp ordering bot for restaurants | /orderrise |
| 2 | whatsapp ai agent | /orderrise |
| 3 | take restaurant orders on whatsapp automatically | /orderrise, blog |
| 4 | whatsapp food ordering system | /orderrise |
| 5 | google maps lead scraper | /maps-lead-scraper |
| 6 | google maps scraper chrome extension | /maps-lead-scraper |
| 7 | scrape google maps leads to csv | /maps-lead-scraper, blog |
| 8 | google maps scraper with email enrichment | /maps-lead-scraper |
| 9 | one-time purchase google maps scraper | /maps-lead-scraper |
| 10 | ai voice agent for business | /voice-agent |
| 11 | ai receptionist for small business | /voice-agent |
| 12 | ai phone answering after hours | /voice-agent, blog |
| 13 | ai voice agent for restaurants | /voice-agent, blog |
| 14 | custom ai agents for small business | /custom-ai-agents |
| 15 | business process automation ai | /custom-ai-agents |

Track monthly in Search Console (Performance → Queries) and note position changes after each
content update.
