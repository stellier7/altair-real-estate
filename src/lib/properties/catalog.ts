import {
  mapAltairProperty,
  type AltairCatalog,
  type AltairRawProperty,
} from "./map-altair";
import type { Property } from "./types";
import catalogJson from "@/data/properties.json";
import manualJson from "@/data/manual-properties.json";

export type ManualListing = {
  property: Property;
  aliases: string[];
};

const scrapedCatalog = catalogJson as unknown as AltairCatalog;
const manualProperties = (
  manualJson as { properties?: AltairRawProperty[] }
).properties ?? [];

function mergeManualProperties(catalog: AltairCatalog): AltairCatalog {
  const seen = new Set(catalog.properties.map((property) => property.id));
  const additions = manualProperties.filter((property) => !seen.has(property.id));
  const properties = [...additions, ...catalog.properties];

  return {
    ...catalog,
    properties,
    stats: {
      total: properties.length,
      forSale: properties.filter((property) => property.listingType === "sale").length,
      forRent: properties.filter((property) => property.listingType === "rent").length,
    },
  };
}

export const altairCatalog = mergeManualProperties(scrapedCatalog);

let manualListingCache: ManualListing[] | undefined;

export function listManualListings(): ManualListing[] {
  if (!manualListingCache) {
    manualListingCache = manualProperties.map((raw) => ({
      property: mapAltairProperty(raw, false, scrapedCatalog.agency.scrapedAt),
      aliases: (raw.aliases ?? []).map((alias) => alias.trim()).filter(Boolean),
    }));
  }
  return manualListingCache;
}

export function findManualListing(slug: string): ManualListing | undefined {
  return listManualListings().find(
    (entry) => entry.property.slug === slug || entry.aliases.includes(slug),
  );
}
