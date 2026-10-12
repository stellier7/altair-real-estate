# CMS migration guide

The site separates **data** from **presentation**. Admin editing is implemented via Supabase;
the public site stays on JSON until you opt in.

## Current boundary

| Layer | Location |
|-------|----------|
| Frozen backup | `backups/catalog-2026-10-12/` |
| Live JSON catalog | `src/data/properties.json` |
| Access API | `src/lib/properties/service.ts` (JSON or Supabase) |
| Admin UI | `/admin` |
| Schema | `supabase/migrations/001_admin_cms.sql` |
| UI | Pages and components under `src/components/property/` |

## Switching to the database

1. Keep types — `src/lib/properties/types.ts` stays the contract.
2. Configure Supabase and run the migration (see [ADMIN.md](./ADMIN.md)).
3. Seed with `npm run seed:supabase`.
4. Set `PROPERTIES_DATA_SOURCE=supabase`.
5. Media — keep image URLs in `ImageAsset.src` (Wasi or Supabase Storage).

## What not to change

- Do not create per-property page files.
- Do not hard-code listing fields inside `PropertyCard` or `PropertyPageComposer`.
- Keep conditional sections driven by `specs.ts` + optional fields.

## Safety

See [DATA-SAFETY.md](./DATA-SAFETY.md).
