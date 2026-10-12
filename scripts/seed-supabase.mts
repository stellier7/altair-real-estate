/**
 * Seed Supabase `properties` from the frozen catalog backup (or live JSON).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-supabase.mts
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { mapAltairCatalog, type AltairCatalog } from "../src/lib/properties/map-altair";
import { propertyToRow } from "../src/lib/properties/serialize";
import { siteConfig } from "../src/content/site/config";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.",
    );
    process.exit(1);
  }

  const backupPath = path.join(
    process.cwd(),
    "backups/catalog-2026-10-12/properties.json",
  );
  const livePath = path.join(process.cwd(), "src/data/properties.json");

  let catalogRaw: string;
  try {
    catalogRaw = await readFile(backupPath, "utf8");
    console.log(`Reading frozen backup: ${backupPath}`);
  } catch {
    catalogRaw = await readFile(livePath, "utf8");
    console.log(`Frozen backup missing; reading live JSON: ${livePath}`);
  }

  const catalog = JSON.parse(catalogRaw) as AltairCatalog;
  const properties = mapAltairCatalog(catalog);
  const featuredSlugs = new Set(siteConfig.homeFeaturedPropertySlugs);

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const batchSize = 50;
  let upserted = 0;

  for (let i = 0; i < properties.length; i += batchSize) {
    const slice = properties.slice(i, i + batchSize).map((property) => {
      const withFeatured = {
        ...property,
        featured: featuredSlugs.has(property.slug) || Boolean(property.featured),
      };
      return propertyToRow(withFeatured, { published: true });
    });

    const { error } = await supabase.from("properties").upsert(slice, {
      onConflict: "id",
    });

    if (error) {
      console.error(`Batch starting at ${i} failed:`, error.message);
      process.exit(1);
    }

    upserted += slice.length;
    console.log(`Upserted ${upserted}/${properties.length}`);
  }

  const { error: settingsError } = await supabase.from("site_settings").upsert({
    key: "homeFeaturedPropertySlugs",
    value: [...siteConfig.homeFeaturedPropertySlugs],
  });

  if (settingsError) {
    console.error("Failed to seed featured slugs:", settingsError.message);
    process.exit(1);
  }

  console.log("Seed complete.");
  console.log(
    "Create Auth users, insert profiles (owner/assistant), then set PROPERTIES_DATA_SOURCE=supabase when ready.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
