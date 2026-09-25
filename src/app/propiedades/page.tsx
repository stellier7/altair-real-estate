import { Suspense } from "react";
import { PropertyGrid } from "@/components/PropertyGrid";
import { SearchBar } from "@/components/SearchBar";
import { filterProperties, type ListingType } from "@/lib/properties";

function listingFromParam(tipo: string | undefined): ListingType | "all" {
  if (tipo === "venta") return "sale";
  if (tipo === "alquiler") return "rent";
  return "all";
}

export default async function PropiedadesPage({
  searchParams,
}: PageProps<"/propiedades">) {
  const { tipo, q, tipoInmueble } = await searchParams;
  const listingType = listingFromParam(
    Array.isArray(tipo) ? tipo[0] : tipo,
  );
  const query = Array.isArray(q) ? q[0] : q;
  const propType = Array.isArray(tipoInmueble) ? tipoInmueble[0] : tipoInmueble;

  const properties = filterProperties({
    listingType,
    query,
    propertyType: propType && propType !== "all" ? propType : undefined,
  });

  const title =
    listingType === "sale"
      ? "Propiedades en venta"
      : listingType === "rent"
        ? "Propiedades en alquiler"
        : "Catálogo de propiedades";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{properties.length} resultados</p>
      <div className="mt-6">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
      <div className="mt-8">
        <PropertyGrid properties={properties} />
      </div>
    </div>
  );
}
