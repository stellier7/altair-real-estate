import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/properties";
import { site, whatsappHref } from "@/lib/site";

export default async function PropertyDetailPage({
  params,
}: PageProps<"/propiedad/[id]">) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  const images = property.images.length > 0 ? property.images : property.coverImage ? [property.coverImage] : [];
  const waMessage = `Hola, me interesa la propiedad ${property.title} (código ${property.code}).`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/propiedades" className="text-sm font-medium text-sky-700 hover:text-sky-900">
        ← Volver al catálogo
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-slate-900">{property.title}</h1>
      <p className="mt-2 text-slate-600">
        {[property.city, property.region, property.country].filter(Boolean).join(" · ")}
      </p>
      {property.priceLabel ? (
        <p className="mt-4 text-2xl font-bold text-sky-900">{property.priceLabel}</p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {images.slice(0, 8).map((src) => (
            <img
              key={src}
              src={src}
              alt={property.title}
              className="w-full rounded-2xl border border-slate-200 object-cover"
            />
          ))}
        </div>
        <div>
          <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            {property.propertyType ? (
              <>
                <dt className="text-slate-500">Tipo</dt>
                <dd className="font-medium">{property.propertyType}</dd>
              </>
            ) : null}
            {property.bedrooms ? (
              <>
                <dt className="text-slate-500">Alcobas</dt>
                <dd className="font-medium">{property.bedrooms}</dd>
              </>
            ) : null}
            {property.bathrooms ? (
              <>
                <dt className="text-slate-500">Baños</dt>
                <dd className="font-medium">{property.bathrooms}</dd>
              </>
            ) : null}
            {property.garage ? (
              <>
                <dt className="text-slate-500">Garaje</dt>
                <dd className="font-medium">{property.garage}</dd>
              </>
            ) : null}
            {property.condition ? (
              <>
                <dt className="text-slate-500">Estado</dt>
                <dd className="font-medium">{property.condition}</dd>
              </>
            ) : null}
            <dt className="text-slate-500">Código</dt>
            <dd className="font-medium">{property.code}</dd>
          </dl>

          {property.description ? (
            <div className="prose prose-slate mt-6 max-w-none text-sm">
              <h2 className="text-lg font-semibold">Descripción</h2>
              <p className="whitespace-pre-wrap">{property.description}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappHref(waMessage)}
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              target="_blank"
              rel="noreferrer"
            >
              Consultar por WhatsApp
            </a>
            <a
              href={property.url}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              target="_blank"
              rel="noreferrer"
            >
              Ver en sitio original
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            {site.name} · {site.phone} · {site.email}
          </p>
        </div>
      </div>
    </div>
  );
}
