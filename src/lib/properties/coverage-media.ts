import { coverageCities, cityMatchesCoverage } from "@/content/site/coverage";
import type { CoverageCity } from "@/content/site/coverage";
import type { Property } from "./types";

export type CoverageCityCard = CoverageCity & {
  href: string;
  image: { src: string; alt: string } | null;
  listingCount: number;
};

function pickHeroImage(properties: Property[]): { src: string; alt: string } | null {
  const withImage = properties.find((property) => property.media.heroImage?.src);
  if (!withImage?.media.heroImage?.src) {
    return null;
  }
  return {
    src: withImage.media.heroImage.src,
    alt: withImage.media.heroImage.alt || withImage.name,
  };
}

export function buildCoverageCityCards(properties: Property[]): {
  featured: CoverageCityCard[];
  secondary: CoverageCityCard[];
} {
  const cards = coverageCities.map((city) => {
    const matches = properties.filter((property) => {
      const propertyCity = property.location.city;
      return propertyCity ? cityMatchesCoverage(propertyCity, city) : false;
    });
    return {
      ...city,
      href: `/properties?city=${encodeURIComponent(city.slug)}`,
      image: pickHeroImage(matches),
      listingCount: matches.length,
    };
  });

  return {
    featured: cards.filter((city) => city.featured),
    secondary: cards.filter((city) => !city.featured && city.listingCount > 0),
  };
}
