import type { MetadataRoute } from "next";
import { getAllProperties } from "@/lib/properties/service";
import { absoluteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/properties", "/about", "/services", "/contact"].map(
    (path) => ({
      url: absoluteUrl(path || "/"),
      lastModified: new Date(),
    }),
  );

  const properties = await getAllProperties();
  const propertyRoutes = properties.map((property) => {
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
