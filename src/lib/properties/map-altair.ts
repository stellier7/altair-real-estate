import type { Property, PropertyPricing, PropertyType } from "./types";

export type AltairCatalog = {
  agency: {
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
  properties: AltairRawProperty[];
  stats: { total: number; forSale: number; forRent: number };
};

export type AltairRawProperty = {
  id: string;
  slug: string;
  url: string;
  title: string;
  description: string;
  listingType: string;
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
  attributes: Record<string, string | undefined>;
};

function mapPropertyType(label: string): PropertyType {
  const key = label.toLowerCase();
  if (key.includes("apartamento") || key.includes("penthouse")) return "apartment";
  if (key.includes("casa de playa") || key.includes("villa")) return "villa";
  if (key.includes("casa")) return "house";
  if (key.includes("terreno") || key.includes("finca")) return "land";
  if (key.includes("local")) return "retail";
  if (key.includes("oficina")) return "office";
  if (key.includes("bodega") || key.includes("industrial")) return "industrial";
  if (key.includes("edificio")) return "commercial";
  if (key.includes("hotel")) return "hotel";
  return "residential";
}

function parseNumber(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number.parseInt(value.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : undefined;
}

function extractPricing(raw: AltairRawProperty): PropertyPricing | undefined {
  if (raw.priceLabel?.trim()) {
    return { display: raw.priceLabel.trim() };
  }
  const text = raw.description;
  const hnl = text.match(/L\s*([\d][\d,]*)/i);
  if (hnl) {
    const amount = Number.parseInt(hnl[1].replace(/,/g, ""), 10);
    return {
      amount,
      currency: "HNL",
      display: `L${hnl[1]} HNL`,
    };
  }
  const usd = text.match(/(?:US\$|USD\s*)\$?\s*([\d][\d,]*)/i) ?? text.match(/Precio\s*\$?\s*([\d][\d,]*)/i);
  if (usd) {
    const amount = Number.parseInt(usd[1].replace(/,/g, ""), 10);
    return {
      amount,
      currency: "USD",
      display: `US$${usd[1]} USD`,
    };
  }
  const generic = text.match(/\$\s*([\d][\d,]*)/);
  if (generic) {
    return { display: `US$${generic[1]} USD` };
  }
  return { priceOnRequest: true, display: "Consultar precio" };
}

function uniqueSlug(raw: AltairRawProperty): string {
  return `${raw.slug}-${raw.id}`;
}

function shortDescription(text: string): string {
  const line = text.split("\n").map((l) => l.trim()).find(Boolean) ?? text;
  return line.length > 160 ? `${line.slice(0, 157)}…` : line;
}

export function mapAltairProperty(
  raw: AltairRawProperty,
  featured: boolean,
  scrapedAt?: string,
): Property {
  const propertyType = mapPropertyType(raw.propertyType || "");
  const hero = raw.coverImage || raw.images[0] || "";
  const gallery = raw.images.filter((src) => src && src !== hero).slice(0, 8);

  const listingTag =
    raw.listingType === "sale"
      ? "venta"
      : raw.listingType === "rent"
        ? "alquiler"
        : "listado";

  const locationLabel = [raw.city, raw.region, raw.country].filter(Boolean).join(", ");

  const residential =
    parseNumber(raw.bedrooms) ||
    parseNumber(raw.bathrooms) ||
    parseNumber(raw.garage)
      ? {
          bedrooms: parseNumber(raw.bedrooms),
          bathrooms: parseNumber(raw.bathrooms),
          parking: parseNumber(raw.garage),
        }
      : undefined;

  return {
    id: raw.id,
    slug: uniqueSlug(raw),
    name: raw.title.trim(),
    title: raw.title.trim(),
    shortDescription: shortDescription(raw.description),
    description: raw.description.trim(),
    propertyType,
    status: "available",
    featured,
    tags: [listingTag, raw.propertyType?.toLowerCase() ?? "inmueble"],
    location: {
      label: locationLabel || "Honduras",
      country: raw.country,
      region: raw.region,
      city: raw.city,
    },
    pricing: extractPricing(raw),
    media: {
      heroImage: {
        src: hero || "https://images.wasi.co/empresas/b20190828112855.png",
        alt: raw.title,
        width: 1200,
        height: 800,
      },
      gallery: gallery.map((src) => ({
        src,
        alt: raw.title,
        width: 1200,
        height: 800,
      })),
    },
    residential,
    features: raw.condition ? [`Estado: ${raw.condition}`] : undefined,
    seo: {
      title: raw.title.trim(),
      description: shortDescription(raw.description),
      canonicalPath: `/properties/${uniqueSlug(raw)}`,
    },
    publishedAt: scrapedAt,
    contact: { ctaLabel: "Consultar por WhatsApp" },
  };
}

export function mapAltairCatalog(catalog: AltairCatalog): Property[] {
  const scrapedAt = catalog.agency.scrapedAt;
  return catalog.properties.map((raw, index) =>
    mapAltairProperty(raw, index < 8, scrapedAt),
  );
}
