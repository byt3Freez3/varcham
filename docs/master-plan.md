# वर्चम · Varcham India — Brand Master Plan

*Rooted in Faith, Inspired by Divine*

**Brand · UX · E-commerce Master Plan** — the complete brand strategy, visual identity, UX architecture, catalog plan and build prompts for varcham.in, from the coming-soon page to a full e-commerce store.

- **Brand:** Varcham India (वर्चम) — P-79 Swami Swarupananda Sarani, behind VIP Market, near Phoolbagan PS, Kolkata 700054
- **Contact:** +91 90079 96100 · varchamindia@gmail.com · varcham.in
- **Version:** v1.0 — 10 November 2026
- **Build route:** React + TypeScript + Vite + Tailwind + shadcn/ui → GitHub → Supabase + Razorpay + Shiprocket → Netlify

---

## 01 · Brand Foundation

- **Positioning:** For Kolkata households who take their rituals seriously, Varcham India is the spiritual-essentials house that makes every puja complete and pure — pairing a real neighbourhood store and festival-ready kits with authentic, carefully sourced samagri, sandalwood and attars, from a ₹20 packet of roli to a ₹3,200 red-sandalwood bracelet.
- **Master Tagline:** *Rooted in Faith, Inspired by Divine*
- **Hero Promise:** *Every ritual, complete and pure.*
- **Personality:** Devout, serene, refined, trustworthy, warm.

## 02 · Visual Identity System

- **Ivory:** `#FDFBF7` (page background)
- **Parchment:** `#F5EEE1` (secondary surface, image wells)
- **Sandal:** `#EFE3CC` (hover fills, skeletons)
- **Espresso:** `#29180E` (headings + body text)
- **Walnut:** `#5A3E2B` (secondary text, captions, Hindi sub-names)
- **Antique Gold:** `#8C6D38` (eyebrows, icons, hairlines, active tabs)
- **Gold Light:** `#C9A96A` (gold on dark green)
- **Tulsi Green:** `#1C4328` (primary buttons, links, footer, announcement bar), Hover `#153520`
- **Sindoor:** `#A8322A` (sale / festival essential badges, errors)
- **Hairline:** `#E6DCC8` (borders, dividers)
- **Typography:** Cinzel (eyebrows / uppercase labels), Playfair Display (headings H1–H4, product names), Plus Jakarta Sans (body, UI, prices, forms), Tiro Devanagari Hindi (Hindi names & wordmark).

## 03 · Animation & Motion System

- `--ease-temple`: `cubic-bezier(0.22, 1, 0.36, 1)`
- Scroll reveals via IntersectionObserver (`threshold: 0.15`, `80ms` stagger).
- Respects `prefers-reduced-motion`.

## 04 · Tech Architecture (Supabase Next Steps)

Core Postgres tables:
`products`, `product_variants`, `product_images`, `collections`, `festivals`, `festival_kit_items`, `profiles`, `addresses`, `orders`, `order_items`, `order_events`, `wishlists`, `reviews`, `coupons`, `bulk_enquiries`, `reminders`, `banners`, `store_settings`.

Edge Functions:
`create-order`, `razorpay-webhook`, `check-pincode`, `create-shipment`, `track-order`, `abandoned-cart`, `festival-reminders`, `invoice-pdf`.

## 13 · Catalog & Merchandising

277 store SKUs across 31 store categories grouped into 8 web collections:
1. Puja Samagri & Essentials
2. Agarbatti & Dhoop
3. Attars & Sacred Waters
4. Diyas & Lighting
5. Brass & Marble Puja Articles
6. Sandalwood Malas & Sacred Stones
7. Festive Décor & Aasan
8. Herbaa Wellness

13 items in `docs/catalog.csv` flagged with `PRICE MISSING` or duplicate name require owner confirmation before final live seed.

