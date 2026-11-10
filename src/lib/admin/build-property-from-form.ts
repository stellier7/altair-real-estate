import type { Property, PropertyStatus, PropertyType } from "@/lib/properties/types";
import { normalizeDescriptionText } from "@/lib/properties/description-paragraphs";
import {
  listingTagsFromMode,
  parseListingMode,
} from "@/lib/properties/specs";
import { slugifyName } from "@/lib/properties/serialize";

function parseOptionalNumber(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function uniqueUrls(lines: string[]): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const line of lines) {
    const src = line.trim();
    if (!src || seen.has(src)) continue;
    seen.add(src);
    urls.push(src);
  }
  return urls;
}

function parseGalleryUrls(raw: string, draft: string): { src: string; alt: string }[] {
  return uniqueUrls([...raw.split("\n"), draft]).map((src) => ({
    src,
    alt: "Galería",
  }));
}

export function buildPropertyFromForm(
  formData: FormData,
  existing?: Property,
): Property {
  const id =
    (formData.get("id") as string)?.trim() ||
    existing?.id ||
    `p-${Date.now()}`;
  const name = (formData.get("name") as string)?.trim() || "Sin título";
  const slugInput = (formData.get("slug") as string)?.trim();
  const slug = slugInput || existing?.slug || `${slugifyName(name)}-${id}`;
  const listing = parseListingMode(formData.get("listing") as string);
  const listingTags = listingTagsFromMode(listing);
  const propertyType = (formData.get("propertyType") as PropertyType) || "house";
  const status = (formData.get("status") as PropertyStatus) || "available";
  const featured = formData.get("featured") === "on";
  const shortDescription =
    normalizeDescriptionText((formData.get("shortDescription") as string) || "") ||
    undefined;
  const description =
    normalizeDescriptionText((formData.get("description") as string) || "") ||
    undefined;
  const city = (formData.get("city") as string)?.trim() || undefined;
  const region = (formData.get("region") as string)?.trim() || undefined;
  const country =
    (formData.get("country") as string)?.trim() || "Honduras";
  const address = (formData.get("address") as string)?.trim() || undefined;
  const locationLabel =
    (formData.get("locationLabel") as string)?.trim() ||
    [city, region, country].filter(Boolean).join(", ") ||
    "Honduras";
  const priceDisplay = (formData.get("priceDisplay") as string)?.trim();
  const priceAmount = parseOptionalNumber(formData.get("priceAmount"));
  const currency = (formData.get("currency") as string)?.trim() || "USD";
  const priceOnRequest = formData.get("priceOnRequest") === "on";
  const heroSrc =
    (formData.get("heroImageSrc") as string)?.trim() ||
    existing?.media.heroImage.src ||
    "";
  const heroAlt =
    (formData.get("heroImageAlt") as string)?.trim() || name;
  const galleryRaw = (formData.get("galleryUrls") as string) || "";
  const galleryDraft = (formData.get("galleryUrlDraft") as string) || "";
  const galleryTouched = formData.get("galleryTouched") === "1";
  const extraTags = parseTags((formData.get("tags") as string) || "");
  const tags = Array.from(new Set([...listingTags, ...extraTags]));

  const bedrooms = parseOptionalNumber(formData.get("bedrooms"));
  const bathrooms = parseOptionalNumber(formData.get("bathrooms"));
  const parking = parseOptionalNumber(formData.get("parking"));
  const totalArea = parseOptionalNumber(formData.get("totalArea"));
  const lotSize = parseOptionalNumber(formData.get("lotSize"));
  const yearBuilt = parseOptionalNumber(formData.get("yearBuilt"));

  const residential =
    bedrooms || bathrooms || parking || totalArea || lotSize || yearBuilt
      ? { bedrooms, bathrooms, parking, totalArea, lotSize, yearBuilt }
      : undefined;

  const submittedGallery = parseGalleryUrls(galleryRaw, galleryDraft);
  const keepStoredGallery =
    submittedGallery.length === 0 &&
    !galleryTouched &&
    (existing?.media.gallery?.length ?? 0) > 0;
  const galleryImages = keepStoredGallery
    ? existing?.media.gallery ?? []
    : submittedGallery.map((img) => ({
        ...img,
        alt: heroAlt,
        width: 1200,
        height: 800,
      }));

  const seoTitle = (formData.get("seoTitle") as string)?.trim() || name;
  const seoDescription =
    (formData.get("seoDescription") as string)?.trim() || shortDescription;

  return {
    id,
    slug,
    name,
    title: name,
    shortDescription,
    description,
    propertyType,
    status,
    featured,
    tags,
    location: {
      label: locationLabel,
      country,
      region,
      city,
      address,
    },
    pricing: priceOnRequest
      ? { priceOnRequest: true, display: "Consultar precio" }
      : {
          amount: priceAmount,
          currency,
          display: priceDisplay || undefined,
          priceOnRequest: false,
        },
    media: {
      heroImage: {
        src: heroSrc || "https://images.wasi.co/empresas/b20190828112855.png",
        alt: heroAlt,
        width: 1200,
        height: 800,
      },
      gallery: galleryImages,
    },
    residential,
    features: existing?.features,
    amenities: existing?.amenities,
    seo: {
      title: seoTitle,
      description: seoDescription,
      canonicalPath: `/properties/${slug}`,
      noIndex: formData.get("noIndex") === "on",
    },
    contact: existing?.contact ?? { ctaLabel: "Consultar por WhatsApp" },
    publishedAt: existing?.publishedAt ?? new Date().toISOString(),
    relatedPropertyIds: existing?.relatedPropertyIds,
  };
}
