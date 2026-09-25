import type { MetadataRoute } from "next";
import { propertyRepository } from "@/lib/properties/repository";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/properties", "/about", "/services", "/contact"].map(
    (path) => ({
      url: absoluteUrl(path || "/"),
      lastModified: new Date(),
    }),
  );

  const propertyRoutes = propertyRepository.getAll().map((property) => {
    const parsed = property.publishedAt
      ? new Date(property.publishedAt)
      : new Date();
    const lastModified = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    return {
      url: absoluteUrl(`/properties/${property.slug}`),
      lastModified,
    };
  });

  return [...staticRoutes, ...propertyRoutes];
}
