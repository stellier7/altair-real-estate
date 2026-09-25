import Link from "next/link";
import { site, whatsappHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">{site.name}</p>
          <p className="mt-2 text-sm text-slate-400">{site.tagline}</p>
        </div>
        <div>
          <p className="font-medium text-white">Ubicación y contacto</p>
          <p className="mt-2 text-sm">{site.address.line1}</p>
          <p className="text-sm">
            {site.address.city} — {site.address.region}
          </p>
          <p className="mt-3 text-sm">
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/propiedades" className="hover:text-white">Propiedades</Link>
          <a
            href={whatsappHref("Hola, me gustaría información sobre una propiedad.")}
            className="hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a href={site.sourceUrl} className="hover:text-white" target="_blank" rel="noreferrer">
            Sitio original (Wasi)
          </a>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {site.name}. Datos migrados desde bienesraicesaltair.com.
      </div>
    </footer>
  );
}
