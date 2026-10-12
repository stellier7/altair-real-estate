import { altairCatalog } from "./catalog";
import { mapAltairCatalog } from "./map-altair";
import { matchesPropertyFilter } from "./matches-filter";
import type { Property, PropertyFilter } from "./types";

const properties = mapAltairCatalog(altairCatalog);

export const jsonPropertyRepository = {
  getAll(): Property[] {
    return [...properties];
  },

  getBySlug(slug: string): Property | undefined {
    return properties.find((p) => p.slug === slug);
  },

  getById(id: string): Property | undefined {
    return properties.find((p) => p.id === id);
  },

  filter(filters: PropertyFilter): Property[] {
    return jsonPropertyRepository
      .getAll()
      .filter((p) => matchesPropertyFilter(p, filters));
  },

  stats() {
    return altairCatalog.stats;
  },

  agency() {
    return altairCatalog.agency;
  },
};
