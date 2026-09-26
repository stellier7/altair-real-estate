import type { PropertyType } from "@/lib/properties/types";
import { formatPropertyType } from "@/lib/properties/specs";
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
};

export function DirectoryFilters({
  currentType,
  currentListing,
  currentQuery,
}: DirectoryFiltersProps) {
  return (
    <form
      method="get"
      className="grid gap-4 border-y border-line py-6 sm:grid-cols-[1fr_auto_auto] sm:items-end"
    >
      <label className="grid gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">Buscar</span>
        <input
          type="search"
          name="q"
          defaultValue={currentQuery ?? ""}
          placeholder="Ciudad, título o zona"
          className="focus-ring border-b border-line bg-transparent py-2 text-foreground outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">Tipo</span>
        <select
          name="type"
          defaultValue={currentType ?? ""}
          className="focus-ring border-b border-line bg-transparent py-2 outline-none"
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
        <span className="text-xs uppercase tracking-[0.2em] text-muted">Negocio</span>
        <select
          name="listing"
          defaultValue={currentListing ?? ""}
          className="focus-ring border-b border-line bg-transparent py-2 outline-none"
        >
          <option value="">Venta y alquiler</option>
          <option value="sale">Venta</option>
          <option value="rent">Alquiler</option>
        </select>
      </label>
      <div className="sm:col-span-3">
        <Button type="submit" variant="secondary">
          Aplicar filtros
        </Button>
      </div>
    </form>
  );
}
