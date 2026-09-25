import type { Metadata } from "next";
import { siteConfig } from "@/content/site/config";
import type { Property } from "@/lib/properties/types";

const baseUrl = siteConfig.url.replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalized}`;
}

export function buildSiteMetadata(overrides?: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const title = overrides?.title
    ? `${overrides.title} · ${siteConfig.name}`
    : `${siteConfig.name} · ${siteConfig.tagline}`;
  const description = overrides?.description ?? siteConfig.description;
  const path = overrides?.path ?? "/";
  const image = overrides?.image ?? siteConfig.defaultOgImage;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: overrides?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function buildPropertyMetadata(property: Property): Metadata {
  const title =
    property.seo.title ?? property.title ?? property.name;
  const description =
    property.seo.description ??
    property.shortDescription ??
    siteConfig.description;
  const path = property.seo.canonicalPath ?? `/properties/${property.slug}`;
  const image =
    property.seo.ogImage?.src ?? property.media.heroImage.src;

  return buildSiteMetadata({
    title,
    description,
    path,
    image,
    noIndex: property.seo.noIndex,
  });
}

export function buildPropertyJsonLd(property: Property): Record<string, unknown> {
  const price = property.pricing?.amount;
  const currency = property.pricing?.currency ?? "EUR";

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.name,
    description: property.shortDescription ?? property.description,
    url: absoluteUrl(`/properties/${property.slug}`),
    image: property.media.heroImage.src,
    ...(price !== undefined
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability:
              property.status === "available"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
          },
        }
      : {}),
    address: property.location.address
      ? {
          "@type": "PostalAddress",
          streetAddress: property.location.address,
          addressLocality: property.location.city,
          addressRegion: property.location.region,
          addressCountry: property.location.country,
        }
      : undefined,
  };
}
