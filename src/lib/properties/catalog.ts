import type { AltairCatalog, AltairRawProperty } from "./map-altair";
import catalogJson from "@/data/properties.json";
import manualJson from "@/data/manual-properties.json";

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
