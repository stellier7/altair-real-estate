import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades?tipo=venta", label: "Ventas" },
  { href: "/propiedades?tipo=alquiler", label: "Alquileres" },
  { href: "/contacto", label: "Contáctenos" },
];

export function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src={site.logo}
            alt={site.name}
            className="h-12 w-auto max-w-[200px] object-contain"
          />
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium text-slate-700">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden text-right text-xs text-slate-600 md:block">
          <a href={`tel:${site.phone}`} className="block hover:text-sky-700">
            {site.phone}
          </a>
          <a href={`tel:${site.mobile}`} className="block hover:text-sky-700">
            {site.mobile}
          </a>
        </div>
      </div>
    </header>
  );
}
