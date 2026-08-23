# MuRa@23 Static Site

Exact UI clone of https://murai-website-wine.vercel.app/ for Cloudflare Pages deployment.

## Local preview

```bash
npx serve . -l 8787
```

## Cloudflare Pages (permanent)

1. Create a Cloudflare API token with **Cloudflare Pages — Edit** permission.
2. Export it: `export CLOUDFLARE_API_TOKEN=your_token`
3. Deploy:

```bash
./deploy-cloudflare.sh
```

Your site will be available at `https://murai-website.pages.dev` (or your custom domain).

## Next.js integration

The same UI is also integrated into the Next.js frontend at `/` via middleware rewrite to `/murai/index.html`.
