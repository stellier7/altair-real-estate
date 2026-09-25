import catalog from "@/data/properties.json";

export type ListingType = "sale" | "rent" | "unknown";

export type Property = {
  id: string;
  slug: string;
  url: string;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: string;
  priceLabel: string;
  country: string;
  region: string;
  city: string;
  condition: string;
  bedrooms?: string | null;
  bathrooms?: string | null;
  garage?: string | null;
  code: string;
  coverImage: string;
  images: string[];
};

export type AgencyInfo = {
  name: string;
  description: string;
  logo: string;
  phone: string;
  mobile: string;
  email: string;
  whatsapp: string;
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
  };
  sourceWebsite: string;
  scrapedAt: string;
};

type CatalogFile = {
  agency: AgencyInfo;
  properties: Property[];
  stats: { total: number; forSale: number; forRent: number };
};

const data = catalog as CatalogFile;

export function getAgency(): AgencyInfo {
  return data.agency;
}

export function getProperties(): Property[] {
  return data.properties;
}

export function getPropertyById(id: string): Property | undefined {
  return data.properties.find((p) => p.id === id);
}

export function getFeaturedProperties(limit = 8): Property[] {
  return data.properties.slice(0, limit);
}

export function filterProperties(opts: {
  listingType?: ListingType | "all";
  propertyType?: string;
  query?: string;
}): Property[] {
  const q = opts.query?.trim().toLowerCase();
  return data.properties.filter((p) => {
    if (opts.listingType && opts.listingType !== "all" && p.listingType !== opts.listingType) {
      return false;
    }
    if (opts.propertyType && opts.propertyType !== "all" && p.propertyType !== opts.propertyType) {
      return false;
    }
    if (q) {
      const hay = `${p.title} ${p.city} ${p.region} ${p.propertyType} ${p.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function propertyTypes(): string[] {
  const set = new Set<string>();
  for (const p of data.properties) {
    if (p.propertyType) set.add(p.propertyType);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es"));
}

export function getStats() {
  return data.stats;
}
