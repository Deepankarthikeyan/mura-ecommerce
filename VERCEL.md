# MuRa@23 — Vercel deployment

This repository is **frontend-only**. The Next.js app (storefront + staff panel + API routes) lives in **`frontend/`**.

## Quick deploy (recommended)

1. Open [vercel.com/new](https://vercel.com/new)
2. Import **`Deepankarthikeyan/mura-ecommerce`**
3. Set **Root Directory** → `frontend`
4. Framework: **Next.js** (auto-detected)
5. Add environment variables (Production):

| Variable | Required | Notes |
|----------|----------|-------|
| `MONGODB_URI` | Yes (for admin/DB products) | MongoDB connection string |
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://your-app.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Optional | Image uploads |
| `CLOUDINARY_API_KEY` | Optional | Image uploads |
| `CLOUDINARY_API_SECRET` | Optional | Image uploads |
| `RAZORPAY_KEY_ID` | Optional | Payments |
| `RAZORPAY_KEY_SECRET` | Optional | Payments |

6. Click **Deploy**

Without `MONGODB_URI`, the site still loads with the same MuRa UI but shows empty product sections until you add inventory in the staff dashboard.

## GitHub Actions (auto deploy on push)

Add these secrets in **GitHub → Settings → Secrets → Actions**:

- `VERCEL_TOKEN` — from [vercel.com/account/tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` — run `vercel link` locally, then read `.vercel/project.json`
- `VERCEL_PROJECT_ID` — same file

Push to `main` triggers `.github/workflows/vercel-deploy.yml`.

## CLI deploy

```bash
cd frontend
npx vercel login
npx vercel link
npx vercel --prod
```

## Build verified

```bash
cd frontend && npm run build
```
