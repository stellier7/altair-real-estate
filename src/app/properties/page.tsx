import type { Metadata } from "next";
import { PropertyCard } from "@/components/directory/PropertyCard";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { DirectoryPagination } from "@/components/directory/DirectoryPagination";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { propertyCopy } from "@/lib/i18n/property-copy";
import { catalogStats, propertyRepository } from "@/lib/properties/repository";
import {
  paginateItems,
  parsePropertiesPage,
} from "@/lib/properties/pagination";
import { parsePropertyFilterType } from "@/lib/properties/specs";
import { buildSiteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildSiteMetadata({
  title: "Propiedades",
  description:
    "Catálogo de casas, apartamentos, terrenos y locales en venta y alquiler en Tegucigalpa y Honduras.",
  path: "/properties",
});

type PropertiesPageProps = {
  searchParams: Promise<{
    type?: string;
    listing?: string;
    q?: string;
    page?: string;
  }>;
};

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const type = parsePropertyFilterType(params.type);
  const listing =
    params.listing === "sale" || params.listing === "rent" ? params.listing : undefined;
  const query = params.q?.trim() || undefined;
  const requestedPage = parsePropertiesPage(params.page);
  const hasActiveFilters = Boolean(type || listing || query);

  const results = propertyRepository.filter({
    type,
    listing,
    query,
  });

  const pagination = paginateItems(results, requestedPage);
  const filterQuery = {
    type: type,
    listing: params.listing,
    q: query,
  };

  const stats = catalogStats();

  return (
    <>
      <Section className="pb-0">
        <RevealOnScroll>
          <h1 className="font-display text-5xl sm:text-6xl">Propiedades</h1>
          <p className="prose-editorial mt-6 max-w-2xl">
            {stats.total} inmuebles en venta y alquiler en Tegucigalpa y Honduras — {stats.forSale}{" "}
            en venta y {stats.forRent} en alquiler. Use los filtros para acotar la búsqueda; cada
            ficha incluye fotos, descripción y contacto con Bienes Raíces Altair.
          </p>
        </RevealOnScroll>
        <DirectoryFilters
          currentType={type}
          currentListing={params.listing}
          currentQuery={query}
        />
      </Section>

      <Section className="pt-10" id="catalog-results">
        <a
          href="#catalog-results"
          className="focus-ring sr-only rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:mb-6 focus:inline-block"
        >
          {propertyCopy.catalogSkipToResults}
        </a>
        {pagination.totalItems === 0 ? (
          <div className="max-w-xl rounded-[var(--radius-lg)] border border-line/80 bg-surface/60 px-6 py-8">
            <h2 className="font-display text-2xl">{propertyCopy.catalogEmptyTitle}</h2>
            <p className="prose-editorial mt-3 text-muted">{propertyCopy.catalogEmptyBody}</p>
            <Button href="/properties" variant="outline" className="mt-6">
              {propertyCopy.catalogViewAll}
            </Button>
          </div>
        ) : (
          <p className="mb-10 text-sm text-muted">
            Mostrando {pagination.rangeStart}–{pagination.rangeEnd} de {pagination.totalItems}{" "}
            resultados
            {hasActiveFilters ? " con los filtros aplicados" : ""}
          </p>
        )}
        {pagination.items.length > 0 ? (
          <>
            <div className="catalog-results grid gap-8 lg:gap-10">
              {pagination.items.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  priority={pagination.currentPage === 1 && index < 2}
                />
              ))}
            </div>
            <DirectoryPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              filterQuery={filterQuery}
            />
          </>
        ) : null}
      </Section>
    </>
  );
}
