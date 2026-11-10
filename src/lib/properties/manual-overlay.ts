import type { Property } from "./types";

/**
 * Manual listings replace a database row with the same id or slug, and are
 * added when neither is already present. Featured state stays with the row
 * that was already published.
 */
export function overlayManualProperties(
  properties: Property[],
  manual: Property[],
): Property[] {
  if (manual.length === 0) {
    return properties;
  }

  const byId = new Map(manual.map((property) => [property.id, property]));
  const bySlug = new Map(manual.map((property) => [property.slug, property]));
  const consumed = new Set<string>();

  const merged = properties.map((property) => {
    const replacement = byId.get(property.id) ?? bySlug.get(property.slug);
    if (!replacement) {
      return property;
    }
    consumed.add(replacement.id);
    return {
      ...replacement,
      featured: property.featured,
    };
  });

  const additions = manual.filter((property) => !consumed.has(property.id));
  return [...additions, ...merged];
}
