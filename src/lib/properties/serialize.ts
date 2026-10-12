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

export function rowToProperty(row: PropertyRow): Property {
  const data = row.data;
  return {
    ...data,
    id: row.id,
    slug: row.slug,
    name: row.name,
    status: data.status ?? (row.status as Property["status"]),
    propertyType:
      data.propertyType ?? (row.property_type as Property["propertyType"]),
    featured: row.featured,
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
