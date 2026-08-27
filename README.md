# MuRa White-Label Storefront (Frontend)

Frontend-only white-label ecommerce storefront built with **Next.js**. One admin panel controls branding and homepage content; changes reflect across the entire customer site.

## What's included

- **Customer storefront** — Home, shop, product pages, cart, about, contact, login
- **Staff dashboard** — Inventory, storefront branding, orders, SEO, coupons
- **Built-in API routes** — `/api/*` (no separate backend server required)

## White-label flow

1. Open **Staff Dashboard → Homepage & branding** (`/staff-dashboard/storefront`)
2. Update site name, logo, banners, footer, contact details
3. Save — changes appear on header, footer, homepage, and contact page

## Local development

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Without `MONGODB_URI`, settings and products use a local JSON fallback (`frontend/data/local-db.json`).

## Deploy

See [VERCEL.md](./VERCEL.md). Set Vercel **Root Directory** to `frontend`.

## Project structure

```
frontend/          ← Next.js app (storefront + staff panel + API)
.github/           ← Vercel deploy workflow
VERCEL.md          ← Deployment guide
```
