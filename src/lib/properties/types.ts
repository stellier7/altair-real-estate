export type PropertyStatus =
  | "available"
  | "reserved"
  | "sold"
  | "under_development"
  | "coming_soon"
  | "off_market";

export type PropertyType =
  | "residential"
  | "apartment"
  | "villa"
  | "house"
  | "condominium"
  | "commercial"
  | "office"
  | "retail"
  | "hotel"
  | "development"
  | "land"
  | "lot"
  | "industrial"
  | "investment";

export type ImageAsset = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  focalPoint?: { x: number; y: number };
};

export type DocumentAsset = {
  title: string;
  url: string;
  type?: "pdf" | "link";
};

export type PropertyLocation = {
  label: string;
  country?: string;
  region?: string;
  city?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
};

export type PropertyPricing = {
  amount?: number;
  currency?: string;
  display?: string;
  priceOnRequest?: boolean;
};

export type PropertyMedia = {
  heroImage: ImageAsset;
  gallery?: ImageAsset[];
  video?: { url: string; provider?: "youtube" | "vimeo" | "file" };
  virtualTour?: { url: string; label?: string };
};

export type PropertySeo = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: ImageAsset;
  noIndex?: boolean;
};

export type ResidentialSpecs = {
  totalArea?: number;
  lotSize?: number;
  constructionArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  yearBuilt?: number;
};

export type CommercialSpecs = {
  useClass?: string;
  floors?: number;
  units?: number;
};

export type LandSpecs = {
  zoning?: string;
  buildableArea?: number;
};

export type InvestmentSpecs = {
  yield?: string;
  tenancy?: string;
  highlights?: string[];
};

export type Property = {
  id: string;
  slug: string;
  name: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  featured?: boolean;
  tags?: string[];
  location: PropertyLocation;
  pricing?: PropertyPricing;
  media: PropertyMedia;
  residential?: ResidentialSpecs;
  commercial?: CommercialSpecs;
  land?: LandSpecs;
  investment?: InvestmentSpecs;
  features?: string[];
  amenities?: string[];
  floorPlans?: DocumentAsset[];
  documents?: DocumentAsset[];
  seo: PropertySeo;
  contact?: { ctaLabel?: string };
  publishedAt?: string;
  relatedPropertyIds?: string[];
};

export type PropertyFilter = {
  type?: PropertyType;
  status?: PropertyStatus;
  listing?: "sale" | "rent";
  query?: string;
};
