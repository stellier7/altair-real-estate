export const PROPERTIES_PAGE_SIZE = 12;

export function parsePropertiesPage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

export type PaginatedResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  rangeStart: number;
  rangeEnd: number;
};

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number = PROPERTIES_PAGE_SIZE,
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalItems);

  return {
    items: items.slice(start, end),
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    rangeStart: totalItems === 0 ? 0 : start + 1,
    rangeEnd: end,
  };
}

export function buildPropertiesQueryString(params: {
  type?: string;
  listing?: string;
  q?: string;
  page?: number;
}): string {
  const search = new URLSearchParams();
  if (params.q?.trim()) {
    search.set("q", params.q.trim());
  }
  if (params.type?.trim()) {
    search.set("type", params.type.trim());
  }
  if (params.listing === "sale" || params.listing === "rent") {
    search.set("listing", params.listing);
  }
  if (params.page !== undefined && params.page > 1) {
    search.set("page", String(params.page));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}
