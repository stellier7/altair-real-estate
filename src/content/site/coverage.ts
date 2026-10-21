export type CoverageCity = {
  /** Display label in the UI */
  label: string;
  /** Canonical query value for `/properties?city=` */
  slug: string;
  /** Catalog city strings that should match this coverage entry */
  matchNames: string[];
  featured: boolean;
};

/**
 * Altair coverage for the homepage Cobertura strip.
 * Featured four are shown as photo cards; the rest feed the secondary marquee.
 */
export const coverageCities: CoverageCity[] = [
  {
    label: "Tegucigalpa",
    slug: "tegucigalpa",
    matchNames: ["Tegucigalpa"],
    featured: true,
  },
  {
    label: "Comayagua",
    slug: "comayagua",
    matchNames: ["Comayagua"],
    featured: true,
  },
  {
    label: "Roatán",
    slug: "roatan",
    matchNames: ["Roatán", "Roatan"],
    featured: true,
  },
  {
    label: "Valle de Ángeles",
    slug: "valle-de-angeles",
    matchNames: ["Valle de Ángeles", "Valle de Ángele", "Valle de Angeles"],
    featured: true,
  },
  {
    label: "Santa Lucía",
    slug: "santa-lucia",
    matchNames: ["Santa Lucía", "Santa Lucia"],
    featured: false,
  },
  {
    label: "Villa de San Francisco",
    slug: "villa-de-san-francisco",
    matchNames: ["Villa de San Francisco"],
    featured: false,
  },
];

export const homeServiceLinks = [
  {
    label: "Venta residencial",
    href: "/properties?listing=sale&type=house",
  },
  {
    label: "Alquileres",
    href: "/properties?listing=rent",
  },
  {
    label: "Propiedad comercial",
    href: "/properties?type=commercial",
  },
  {
    label: "Terrenos y fincas",
    href: "/properties?type=land",
  },
  {
    label: "Oficinas y locales",
    href: "/properties?type=office",
  },
  {
    label: "Asesoría personalizada",
    href: "/contact",
  },
] as const;

export function findCoverageCityBySlug(slug: string): CoverageCity | undefined {
  const normalized = slug.trim().toLowerCase();
  return coverageCities.find((city) => city.slug === normalized);
}

export function normalizeCityKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

export function cityMatchesCoverage(
  propertyCity: string,
  coverage: CoverageCity,
): boolean {
  const key = normalizeCityKey(propertyCity);
  return coverage.matchNames.some((name) => normalizeCityKey(name) === key);
}
