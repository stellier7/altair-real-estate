import Link from "next/link";
import { buildPropertiesQueryString } from "@/lib/properties/pagination";

type DirectoryPaginationProps = {
  currentPage: number;
  totalPages: number;
  filterQuery: {
    type?: string;
    listing?: string;
    q?: string;
  };
};

export function DirectoryPagination({
  currentPage,
  totalPages,
  filterQuery,
}: DirectoryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const linkClass =
    "focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line/80 bg-surface/80 px-4 text-xs font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav
      className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
      aria-label="Paginación del catálogo"
    >
      <p className="type-meta text-muted">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {prevPage ? (
          <Link
            href={`/properties${buildPropertiesQueryString({ ...filterQuery, page: prevPage })}`}
            className={linkClass}
            rel="prev"
          >
            Anterior
          </Link>
        ) : (
          <span className={`${linkClass} opacity-40`} aria-disabled="true">
            Anterior
          </span>
        )}
        {nextPage ? (
          <Link
            href={`/properties${buildPropertiesQueryString({ ...filterQuery, page: nextPage })}`}
            className={linkClass}
            rel="next"
          >
            Siguiente
          </Link>
        ) : (
          <span className={`${linkClass} opacity-40`} aria-disabled="true">
            Siguiente
          </span>
        )}
      </div>
    </nav>
  );
}
