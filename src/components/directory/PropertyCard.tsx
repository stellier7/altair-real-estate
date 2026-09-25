import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/properties/types";
import {
  formatPropertyType,
  formatStatus,
  getDisplayPrice,
} from "@/lib/properties/specs";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({ property, priority }: PropertyCardProps) {
  const price = getDisplayPrice(property);

  return (
    <article className="group grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10">
      <Link
        href={`/properties/${property.slug}`}
        className="focus-ring relative block aspect-[4/3] overflow-hidden bg-foreground/5 lg:aspect-[16/11]"
      >
        <Image
          src={property.media.heroImage.src}
          alt={property.media.heroImage.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
        />
      </Link>
      <div className="flex flex-col gap-3 pb-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          {formatPropertyType(property.propertyType)} · {formatStatus(property.status)}
        </p>
        <h2 className="font-display text-3xl leading-tight sm:text-4xl">
          <Link href={`/properties/${property.slug}`} className="focus-ring">
            {property.name}
          </Link>
        </h2>
        <p className="text-sm text-muted">{property.location.label}</p>
        {property.shortDescription ? (
          <p className="prose-editorial text-base">{property.shortDescription}</p>
        ) : null}
        {price ? (
          <p className="mt-2 text-sm uppercase tracking-[0.16em]">{price}</p>
        ) : null}
        <Link
          href={`/properties/${property.slug}`}
          className="focus-ring mt-4 text-sm uppercase tracking-[0.18em] text-accent"
        >
          View property
        </Link>
      </div>
    </article>
  );
}
