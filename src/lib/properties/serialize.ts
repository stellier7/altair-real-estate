import type { Property } from "./types";

export type PropertyRow = {
  id: string;
  slug: string;
  name: string;
  status: string;
  property_type: string;
  featured: boolean;
  published: boolean;
  data: Property;
  created_at?: string;
  updated_at?: string;
};

export function propertyToRow(
  property: Property,
  options?: { published?: boolean },
): Omit<PropertyRow, "created_at" | "updated_at"> {
  return {
    id: property.id,
    slug: property.slug,
    name: property.name,
    status: property.status,
    property_type: property.propertyType,
    featured: Boolean(property.featured),
    published: options?.published ?? true,
    data: property,
  };
}

const FALLBACK_HERO_SRC = "https://images.wasi.co/empresas/b20190828112855.png";

export function rowToProperty(row: PropertyRow): Property {
  const data = (row.data ?? {}) as Partial<Property>;
  const name = row.name || data.name || "Sin título";
  const hero = data.media?.heroImage;

  return {
    ...data,
    id: row.id,
    slug: row.slug,
    name,
    title: data.title || name,
    status: data.status ?? (row.status as Property["status"]) ?? "available",
    propertyType:
      data.propertyType ??
      (row.property_type as Property["propertyType"]) ??
      "house",
    featured: Boolean(row.featured),
    location: data.location ?? { label: name, country: "Honduras" },
    media: {
      gallery: data.media?.gallery ?? [],
      video: data.media?.video,
      virtualTour: data.media?.virtualTour,
      heroImage: {
        src: hero?.src?.trim() || FALLBACK_HERO_SRC,
        alt: hero?.alt?.trim() || name,
        width: hero?.width,
        height: hero?.height,
      },
    },
    seo: data.seo ?? { title: name },
  };
}

export function slugifyName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
