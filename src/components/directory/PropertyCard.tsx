import Link from "next/link";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";
import {
  isUnavailableListing,
  PropertyStatusOverlay,
} from "@/components/property/PropertyStatusOverlay";
import type { Property } from "@/lib/properties/types";
import {
  formatPropertyListing,
  formatPropertyType,
  formatStatus,
  getDisplayPrice,
} from "@/lib/properties/specs";
import { propertyCopy } from "@/lib/i18n/property-copy";
import { Button } from "@/components/ui/Button";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({ property, priority }: PropertyCardProps) {
  const price = getDisplayPrice(property);
  const tags = Array.isArray(property.tags) ? property.tags : [];
  const listingLabel =
    tags.includes("venta") || tags.includes("alquiler")
      ? formatPropertyListing(tags)
      : null;
  const unavailable = isUnavailableListing(property.status);
  const name =
    typeof property.name === "string" && property.name.trim()
      ? property.name
      : "Propiedad";
  const heroSrc =
    typeof property.media?.heroImage?.src === "string"
      ? property.media.heroImage.src.trim()
      : "";
  const heroAlt =
    (typeof property.media?.heroImage?.alt === "string" &&
      property.media.heroImage.alt.trim()) ||
    name;
  const slug =
    typeof property.slug === "string" && property.slug.trim()
      ? property.slug
      : property.id;
  const summary =
    typeof property.shortDescription === "string"
      ? property.shortDescription.trim()
      : "";

  return (
    <article className="property-card group overflow-hidden">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:p-8">
        <Link
          href={`/properties/${slug}`}
          className="focus-ring image-frame relative block aspect-[4/3] overflow-hidden bg-foreground/10 lg:aspect-[16/11] rounded-[var(--radius-lg)]"
        >
          <PropertyListingImage
            src={heroSrc}
            alt={heroAlt}
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 48vw"
            className={`transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none ${
              unavailable ? "brightness-[0.88] saturate-[0.75]" : ""
            }`}
          />
          <PropertyStatusOverlay status={property.status} />
        </Link>
        <div className="flex flex-col gap-3 lg:py-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="type-meta-caps text-accent">
              {`${formatPropertyType(property.propertyType)} · ${formatStatus(property.status)}`}
            </p>
            {listingLabel ? (
              <span className="type-meta-caps rounded-full border border-accent/35 bg-accent-soft px-3 py-1 text-accent shadow-[var(--shadow-soft)]">
                {listingLabel}
              </span>
            ) : null}
            {property.status === "sold" ? (
              <span className="type-meta-caps rounded-sm bg-foreground px-3 py-1 text-background">
                Vendido
              </span>
            ) : null}
          </div>
          <h2 className="type-display-card">
            <Link
              href={`/properties/${slug}`}
              className="focus-ring rounded-sm transition-colors hover:text-accent"
            >
              {name}
            </Link>
          </h2>
          <p className="type-meta">{property.location?.label ?? ""}</p>
          {summary ? (
            <p className="prose-editorial line-clamp-3">{summary}</p>
          ) : null}
          {price ? (
            <p className="type-meta-caps mt-1 inline-flex w-fit rounded-full border border-accent/40 bg-accent-soft px-4 py-1.5 text-accent shadow-[var(--shadow-soft)]">
              {price}
            </p>
          ) : null}
          <Button
            href={`/properties/${slug}`}
            variant="primary"
            className="mt-3 w-fit"
          >
            {propertyCopy.viewProperty}
          </Button>
        </div>
      </div>
    </article>
  );
}
