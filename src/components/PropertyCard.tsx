import Link from "next/link";
import type { Property } from "@/lib/properties";

function listingLabel(type: Property["listingType"]): string {
  switch (type) {
    case "sale":
      return "Venta";
    case "rent":
      return "Alquiler";
    default:
      return "Propiedad";
  }
}

export function PropertyCard({ property }: { property: Property }) {
  const img = property.coverImage || "/placeholder-property.svg";
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/propiedad/${property.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={img}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold text-white">
          {listingLabel(property.listingType)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 text-base font-semibold text-slate-900">
          <Link href={`/propiedad/${property.id}`} className="hover:text-sky-800">
            {property.title}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {[property.city, property.region].filter(Boolean).join(", ") || property.country}
        </p>
        {property.propertyType ? (
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            {property.propertyType}
          </p>
        ) : null}
        {property.priceLabel ? (
          <p className="mt-3 text-lg font-bold text-sky-900">{property.priceLabel}</p>
        ) : null}
        <Link
          href={`/propiedad/${property.id}`}
          className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          Más información →
        </Link>
      </div>
    </article>
  );
}
