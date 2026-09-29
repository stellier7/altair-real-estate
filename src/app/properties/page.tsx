import type { Metadata } from "next";
import { PropertyCard } from "@/components/directory/PropertyCard";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { DirectoryPagination } from "@/components/directory/DirectoryPagination";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { catalogStats, propertyRepository } from "@/lib/properties/repository";
import {
  paginateItems,
  parsePropertiesPage,
} from "@/lib/properties/pagination";
import type { PropertyType } from "@/lib/properties/types";
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
  const type = params.type as PropertyType | undefined;
  const listing =
    params.listing === "sale" || params.listing === "rent" ? params.listing : undefined;
  const query = params.q;
  const requestedPage = parsePropertiesPage(params.page);

  const results = propertyRepository.filter({
    type: type || undefined,
    listing,
    query: query || undefined,
  });

  const pagination = paginateItems(results, requestedPage);
  const filterQuery = {
    type: params.type,
    listing: params.listing,
    q: params.q,
  };

  const stats = catalogStats();

  return (
    <>
      <Section className="pb-0">
        <RevealOnScroll>
          <h1 className="font-display text-5xl sm:text-6xl">Propiedades</h1>
          <p className="prose-editorial mt-6 max-w-2xl">
            {stats.total} inmuebles importados de bienesraicesaltair.com — {stats.forSale} en venta y{" "}
            {stats.forRent} en alquiler. Cada ficha incluye galería, descripción y contacto directo.
          </p>
        </RevealOnScroll>
        <DirectoryFilters
          currentType={params.type}
          currentListing={params.listing}
          currentQuery={params.q}
        />
      </Section>

      <Section className="pt-10">
        {pagination.totalItems === 0 ? (
          <p className="text-muted">No hay propiedades que coincidan con su búsqueda.</p>
        ) : (
          <p className="mb-10 text-sm text-muted">
            Mostrando {pagination.rangeStart}–{pagination.rangeEnd} de {pagination.totalItems}{" "}
            resultados
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
