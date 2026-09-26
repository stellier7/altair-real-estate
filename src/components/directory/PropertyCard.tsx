import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/properties/types";
import {
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
  const listingTag = property.tags?.find((tag) => tag === "venta" || tag === "alquiler");

  return (
    <article className="property-card group overflow-hidden">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:p-8">
        <Link
          href={`/properties/${property.slug}`}
          className="focus-ring image-frame relative block aspect-[4/3] overflow-hidden bg-foreground/5 lg:aspect-[16/11] rounded-[var(--radius-lg)]"
        >
          <Image
            src={property.media.heroImage.src}
            alt={property.media.heroImage.alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </Link>
        <div className="flex flex-col gap-3 lg:py-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {formatPropertyType(property.propertyType)} · {formatStatus(property.status)}
            </p>
            {listingTag ? (
              <span className="rounded-full border border-line/80 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-muted shadow-[0_8px_20px_-16px_rgba(18,17,14,0.35)]">
                {listingTag === "venta" ? "Venta" : "Alquiler"}
              </span>
            ) : null}
          </div>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            <Link
              href={`/properties/${property.slug}`}
              className="focus-ring rounded-sm transition-colors hover:text-accent"
            >
              {property.name}
            </Link>
          </h2>
          <p className="text-sm text-muted">{property.location.label}</p>
          {property.shortDescription ? (
            <p className="prose-editorial text-base line-clamp-3">{property.shortDescription}</p>
          ) : null}
          {price ? (
            <p className="mt-1 inline-flex w-fit rounded-full border border-line/70 bg-surface/80 px-4 py-1.5 text-xs uppercase tracking-[0.16em] shadow-[0_10px_24px_-18px_rgba(18,17,14,0.3)]">
              {price}
            </p>
          ) : null}
          <Button
            href={`/properties/${property.slug}`}
            variant="outline"
            className="mt-3 w-fit"
          >
            {propertyCopy.viewProperty}
          </Button>
        </div>
      </div>
    </article>
  );
}
