import type { Property, PropertyType } from "./types";

const RESIDENTIAL_TYPES: PropertyType[] = [
  "residential",
  "apartment",
  "villa",
  "house",
  "condominium",
];

const COMMERCIAL_TYPES: PropertyType[] = [
  "commercial",
  "office",
  "retail",
  "hotel",
  "industrial",
];

const TYPE_LABELS: Record<PropertyType, string> = {
  residential: "Residencial",
  apartment: "Apartamento",
  villa: "Villa",
  house: "Casa",
  condominium: "Condominio",
  commercial: "Comercial",
  office: "Oficina",
  retail: "Local comercial",
  hotel: "Hotel",
  development: "Desarrollo",
  land: "Terreno",
  lot: "Lote",
  industrial: "Industrial",
  investment: "Inversión",
};

const STATUS_LABELS: Record<Property["status"], string> = {
  available: "Disponible",
  sold: "Vendido",
  reserved: "Reservado",
  under_development: "En desarrollo",
  coming_soon: "Próximamente",
  off_market: "Fuera de mercado",
};

export function supportsResidentialSpecs(type: PropertyType): boolean {
  return RESIDENTIAL_TYPES.includes(type);
}

export function supportsCommercialSpecs(type: PropertyType): boolean {
  return COMMERCIAL_TYPES.includes(type);
}

export function supportsLandSpecs(type: PropertyType): boolean {
  return type === "land" || type === "lot" || type === "development";
}

export function supportsInvestmentBlock(property: Property): boolean {
  return (
    property.investment !== undefined ||
    property.propertyType === "investment" ||
    property.tags?.includes("investment") === true
  );
}

export function formatPropertyType(type: PropertyType): string {
  return TYPE_LABELS[type] ?? type;
}

export function formatStatus(status: Property["status"]): string {
  return STATUS_LABELS[status] ?? status;
}

export function formatListingTag(tag: string): string {
  if (tag === "venta") return "Venta";
  if (tag === "alquiler") return "Alquiler";
  return tag;
}

export function getDisplayPrice(property: Property): string | null {
  if (property.pricing?.display) {
    return property.pricing.display;
  }
  if (property.pricing?.priceOnRequest) {
    return "Consultar precio";
  }
  if (
    property.pricing?.amount !== undefined &&
    property.pricing.currency
  ) {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: property.pricing.currency,
      maximumFractionDigits: 0,
    }).format(property.pricing.amount);
  }
  return null;
}
