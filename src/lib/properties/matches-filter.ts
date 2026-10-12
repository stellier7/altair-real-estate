import type { Property, PropertyFilter } from "./types";

export function matchesPropertyFilter(
  property: Property,
  filters: PropertyFilter,
): boolean {
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
    const q = filters.query.toLowerCase().trim();
    if (!q) {
      return true;
    }
    const haystack = [
      property.id,
      property.slug,
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
