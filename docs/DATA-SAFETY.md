# Data safety

## Is the catalog safe?

Yes. Nothing in this migration deletes or overwrites your live listings by default.

| Copy | Location | Purpose |
|------|----------|---------|
| Live public catalog | `src/data/properties.json` | What the website reads today |
| Frozen snapshot | `backups/catalog-2026-10-12/` | Point-in-time backup before the admin CMS |
| Database (after seed) | Supabase `properties` table | Editable source once you opt in |
| On-demand export | `/admin/backup` | Download JSON anytime while logged in |

## What we will not do automatically

- We do **not** delete `src/data/properties.json` when Supabase is connected.
- We do **not** switch the public site to the database until you set  
  `PROPERTIES_DATA_SOURCE=supabase`.
- Assistants cannot permanently delete listings (owners only).

## Recommended habit

1. Keep the frozen folder in git (already committed).
2. After major edits in the panel, use **Respaldo → Descargar catálogo**.
3. Store that file in Drive/email as a second copy outside the server.

## Restore options

- **Public site still on JSON:** copy `backups/catalog-2026-10-12/properties.json` back to `src/data/properties.json` and redeploy.
- **Site on Supabase:** re-run `npm run seed:supabase` from a JSON export (upsert by id).
