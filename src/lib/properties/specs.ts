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
  return type.replace(/_/g, " ");
}

export function formatStatus(status: Property["status"]): string {
  return status.replace(/_/g, " ");
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
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: property.pricing.currency,
      maximumFractionDigits: 0,
    }).format(property.pricing.amount);
  }
  return null;
}
