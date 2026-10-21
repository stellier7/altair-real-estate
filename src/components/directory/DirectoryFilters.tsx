import type { PropertyType } from "@/lib/properties/types";
import { formatPropertyType } from "@/lib/properties/specs";
import { coverageCities } from "@/content/site/coverage";
import { propertyCopy } from "@/lib/i18n/property-copy";
import { Button } from "@/components/ui/Button";

const TYPES: PropertyType[] = [
  "house",
  "apartment",
  "villa",
  "land",
  "commercial",
  "office",
  "retail",
  "industrial",
  "condominium",
];

type DirectoryFiltersProps = {
  currentType?: string;
  currentListing?: string;
  currentQuery?: string;
  currentCity?: string;
};

export function DirectoryFilters({
  currentType,
  currentListing,
  currentQuery,
  currentCity,
}: DirectoryFiltersProps) {
  return (
    <form
      method="get"
      className="surface-panel mt-8 grid gap-4 border border-accent/25 bg-surface/70 px-5 py-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_auto_auto] sm:items-end sm:px-6"
    >
      <label className="grid gap-2 text-sm sm:col-span-2 lg:col-span-1">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">Buscar</span>
        <input
          type="search"
          name="q"
          defaultValue={currentQuery ?? ""}
          placeholder="Título, zona o código"
          className="input-soft focus-ring border border-accent/25 bg-background/50 px-4 py-2.5 text-foreground outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">Ciudad</span>
        <select
          name="city"
          defaultValue={currentCity ?? ""}
          className="input-soft focus-ring border border-accent/25 bg-background/50 px-4 py-2.5 outline-none"
        >
          <option value="">Todas</option>
          {coverageCities.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">Tipo</span>
        <select
          name="type"
          defaultValue={currentType ?? ""}
          className="input-soft focus-ring border border-accent/25 bg-background/50 px-4 py-2.5 outline-none"
        >
          <option value="">Todos</option>
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {formatPropertyType(type)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">Negocio</span>
        <select
          name="listing"
          defaultValue={currentListing ?? ""}
          className="input-soft focus-ring border border-accent/25 bg-background/50 px-4 py-2.5 outline-none"
        >
          <option value="">Venta y alquiler</option>
          <option value="sale">Venta</option>
          <option value="rent">Alquiler</option>
        </select>
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{propertyCopy.catalogFilterHint}</p>
        <Button type="submit" variant="primary" className="shrink-0">
          Aplicar filtros
        </Button>
      </div>
    </form>
  );
}
