import Link from "next/link";
import { PropertyGrid } from "@/components/PropertyGrid";
import { getFeaturedProperties, getStats } from "@/lib/properties";
import { site, whatsappHref } from "@/lib/site";

export default function HomePage() {
  const featured = getFeaturedProperties(9);
  const stats = getStats();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-200">Tegucigalpa · Honduras</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
            {site.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-sky-100">{site.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/propiedades?tipo=venta"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-900 hover:bg-sky-50"
            >
              Ver ventas
            </Link>
            <Link
              href="/propiedades?tipo=alquiler"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Ver alquileres
            </Link>
            <a
              href={whatsappHref("Hola, busco asesoría en bienes raíces.")}
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
          {stats.total > 0 ? (
            <dl className="mt-10 flex flex-wrap gap-8 text-sm">
              <div>
                <dt className="text-sky-300">Inmuebles</dt>
                <dd className="text-2xl font-bold">{stats.total}</dd>
              </div>
              <div>
                <dt className="text-sky-300">En venta</dt>
                <dd className="text-2xl font-bold">{stats.forSale}</dd>
              </div>
              <div>
                <dt className="text-sky-300">En alquiler</dt>
                <dd className="text-2xl font-bold">{stats.forRent}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-slate-900">Últimos inmuebles</h2>
            <p className="mt-1 text-slate-600">Destacados del catálogo importado de bienesraicesaltair.com</p>
          </div>
          <Link href="/propiedades" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
            Ver todo el catálogo →
          </Link>
        </div>
        <PropertyGrid properties={featured} />
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Ubicación y contacto</h2>
            <p className="mt-3 text-slate-600">{site.address.line1}</p>
            <p className="text-slate-600">
              {site.address.city} — {site.address.region}, {site.address.country}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <strong>Teléfono:</strong>{" "}
                <a href={`tel:${site.phone}`} className="text-sky-700">{site.phone}</a>
              </li>
              <li>
                <strong>Móvil:</strong>{" "}
                <a href={`tel:${site.mobile}`} className="text-sky-700">{site.mobile}</a>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${site.email}`} className="text-sky-700">{site.email}</a>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-100 p-6">
            <h3 className="font-semibold text-slate-900">¿Busca asesoría?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Escríbanos por WhatsApp o visite nuestra oficina en Metropolis.
            </p>
            <a
              href={whatsappHref("Hola, me gustaría recibir asesoría de Bienes Raíces Altair.")}
              className="mt-4 inline-block rounded-full bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white"
              target="_blank"
              rel="noreferrer"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
