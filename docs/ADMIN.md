# Admin dashboard (owner + assistant)

Internal panel at `/admin` for managing property listings.

## Safety first

See [DATA-SAFETY.md](./DATA-SAFETY.md). Your existing catalog is backed up under
`backups/catalog-2026-10-12/` and the public site keeps using JSON until you flip a flag.

## One-time setup (free tier is enough)

1. Create a project at [supabase.com](https://supabase.com) (free).
2. SQL Editor → run [`supabase/migrations/001_admin_cms.sql`](../supabase/migrations/001_admin_cms.sql).
3. Authentication → Users → add two users (owner email + assistant email).
4. Table Editor → `profiles` → insert one row per user:

| id (from Auth) | email | role | full_name |
|----------------|-------|------|-----------|
| uuid… | you@… | `owner` | … |
| uuid… | assistant@… | `assistant` | … |

5. Project Settings → API → copy URL and keys into env (below).
6. Locally: `cp .env.example .env.local` and fill values.
7. Seed: `npm run seed:supabase`
8. Open `/admin/login` and sign in.
9. When ready for the **public site** to read the database:

```bash
PROPERTIES_DATA_SOURCE=supabase
```

Until step 9, the website keeps serving `src/data/properties.json` (safe).

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server/seed only — never expose to the browser
PROPERTIES_DATA_SOURCE=json  # or supabase
NEXT_PUBLIC_SITE_URL=
```

## Roles

| Action | Owner | Assistant |
|--------|-------|-----------|
| Create / edit listings | yes | yes |
| Change status / featured | yes | yes |
| Delete listings | yes | no |
| Download backups | yes | yes |

## Features in v1

- Login
- Property list + search
- Create / edit form (status, pricing, location, media URLs, SEO, draft/publish)
- Homepage featured slug order
- JSON export / frozen backup download
- Audit log table (writes on create/update/delete)

## Image hosting

Paste existing Wasi (or other) image URLs in v1. Optional: upload to the
`property-images` Supabase Storage bucket (public) and paste the resulting URL.
