import { altairCatalog } from "./catalog";
import { mapAltairCatalog } from "./map-altair";
import type { Property, PropertyFilter } from "./types";

export interface PropertyRepository {
  getAll(): Property[];
  getBySlug(slug: string): Property | undefined;
  getById(id: string): Property | undefined;
  filter(filters: PropertyFilter): Property[];
}

const properties = mapAltairCatalog(altairCatalog);

function matchesFilter(property: Property, filters: PropertyFilter): boolean {
  if (filters.type && property.propertyType !== filters.type) {
    return false;
  }
  if (filters.status && property.status !== filters.status) {
    return false;
  }
  if (filters.listing) {
    const tag = filters.listing === "sale" ? "venta" : "alquiler";
    if (!property.tags?.includes(tag)) {
      return false;
    }
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    const haystack = [
      property.name,
      property.title,
      property.shortDescription,
      property.location.label,
      property.location.city,
      property.location.region,
      property.tags?.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) {
      return false;
    }
  }
  return true;
}

export const propertyRepository: PropertyRepository = {
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
    return propertyRepository.getAll().filter((p) => matchesFilter(p, filters));
  },
};

export function catalogStats() {
  return altairCatalog.stats;
}

export function catalogAgency() {
  return altairCatalog.agency;
}
