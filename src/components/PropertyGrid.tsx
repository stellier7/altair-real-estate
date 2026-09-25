import type { Property } from "@/lib/properties";
import { PropertyCard } from "@/components/PropertyCard";

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
        No hay propiedades que coincidan con su búsqueda. Si el catálogo está vacío, ejecute{" "}
        <code className="rounded bg-white px-1">python3 scripts/scrape-altair.py</code> para importar
        desde bienesraicesaltair.com.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
