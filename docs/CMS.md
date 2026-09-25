# CMS migration guide (when you are ready)

The site already separates **data** from **presentation**. You do not need a CMS on day one.

## Current boundary

| Layer | Location |
|-------|----------|
| Property records | `src/content/properties/properties.ts` |
| Access API | `propertyRepository` in `src/lib/properties/repository.ts` |
| UI | Pages and components under `src/components/property/` |

## Migration path (high level)

1. **Keep types** — `src/lib/properties/types.ts` stays the contract.
2. **Add an adapter** — e.g. `src/lib/properties/adapters/cms.ts` that fetches from Sanity, Contentful, Strapi, or your API and returns `Property[]`.
3. **Swap the repository** — point `propertyRepository` at the CMS adapter instead of the local array.
4. **Caching** — use Next.js `fetch` caching, `unstable_cache`, or ISR (`revalidate`) on listing and detail routes.
5. **Media** — store image URLs from the CMS CDN in `ImageAsset.src`; keep required `alt` in the CMS.

## What not to change

- Do not create per-property page files.
- Do not hard-code listing fields inside `PropertyCard` or `PropertyPageComposer`.
- Keep conditional sections driven by `specs.ts` + optional fields.

## Suggested CMS fields

Mirror the property schema: slug, type, status, location, pricing, media, optional specs blocks, SEO block, `featured` flag, `publishedAt`.

When you pick a CMS, we can map collections and preview URLs in a follow-up pass.
