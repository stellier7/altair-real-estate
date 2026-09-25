# Deploy on Vercel

## Connect the repo

1. [Vercel](https://vercel.com) → **Add New** → **Project** → import **`stellier7/real-estate-template`** (or your fork).
2. **Production branch:** `main`
3. **Root directory:** leave empty (repository root)
4. **Framework preset:** Next.js (auto-detected)

## Environment variable

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://your-project.vercel.app` |

Redeploy after adding this so sitemap and Open Graph URLs are correct.

## Git submodules (Impeccable)

This repo includes an optional `.impeccable` submodule for Cursor skills. **The website does not need it to build.**

If a deployment fails while cloning submodules:

- Project **Settings** → **Git** → turn off **Include Git Submodules**, then redeploy.

## Open the correct URL

Use the **project** deployment URL from the Vercel dashboard, for example:

`https://real-estate-template-xxxx.vercel.app`

A team URL like `https://tiago-telliers-projects.vercel.app` is **not** your app unless you assigned a project to that hostname. If you see Vercel’s black **“This page doesn’t exist”** page with `404 NOT_FOUND`, you are usually on a URL with no deployment attached.

## Check a failed deploy

1. **Deployments** → latest row → must be **Ready** (not Error).
2. If **Error**, open **Build Logs** (common fixes: wrong root directory, Node version, submodule clone).
3. Use **Redeploy** on the latest successful `main` commit after fixes.

## Local check before pushing

```bash
npm install
npm run build
npm run start
```

Visit `http://localhost:3000` — the home page should load.
