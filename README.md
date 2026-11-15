# वर्चम · Varcham India

> *Rooted in Faith, Inspired by Divine*

Complete e-commerce storefront, festival kit builder, and store operations dashboard for **Varcham India** — Kolkata's boutique house of authentic puja samagri, attars, sandalwood malas, and sacred brass & marble.

## Running Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix primitives), React Router, Lucide Icons, `react-helmet-async`
- **Data layer**: All mock catalog, collection, festival, review, and article data lives in `src/data/*.ts` and is consumed asynchronously through `src/lib/api.ts` (`getProducts`, `getProductBySlug`, `getCollections`, `getFestivals`, `getFestivalKit`, `getReviews`, `getArticles`, `checkPincode`, etc.).
- **Design tokens**: Configured in `src/index.css` and `tailwind.config.ts` (Ivory `#FDFBF7`, Parchment `#F5EEE1`, Sandal `#EFE3CC`, Espresso `#29180E`, Walnut `#5A3E2B`, Gold `#8C6D38`, Tulsi `#1C4328`, Sindoor `#A8322A`, Hairline `#E6DCC8`).
- **Store**: `P-79 Swami Swarupananda Sarani, behind VIP Market, near Phoolbagan PS, Kolkata 700054` · `+91 90079 96100` · `varchamindia@gmail.com`

## Documentation

- Brand & Build Master Plan: `docs/master-plan.md`
- Master Rate List CSV (28 Oct 2026): `docs/catalog.csv`

## Next: backend

1. **Supabase**: Provision Postgres tables (`products`, `product_variants`, `product_images`, `collections`, `festivals`, `festival_kit_items`, `profiles`, `addresses`, `orders`, `order_items`, `order_events`, `wishlists`, `reviews`, `coupons`, `bulk_enquiries`, `reminders`, `banners`, `store_settings`) with row-level security.
2. **Seed Catalog**: Import `docs/catalog.csv` (resolving the 13 items flagged with missing prices) into `products` and `product_variants`.
3. **Swap API Layer**: Update `src/lib/api.ts` functions to query Supabase instead of `src/data/*.ts`.
4. **Auth & Cart Merge**: Enable Supabase phone OTP login and sync `localStorage` cart/wishlist on sign-in.
5. **Payments & Logistics**: Deploy Supabase Edge Functions (`create-order`, `razorpay-webhook`, `check-pincode`, `create-shipment`, `invoice-pdf`) with Razorpay, Shiprocket, and Resend.
6. **Deploy**: Connect repo to Netlify (`npm run build`, publish `dist`) and configure custom domain `varcham.in`.

