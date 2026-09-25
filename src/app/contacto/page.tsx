import { site, whatsappHref } from "@/lib/site";

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold">Contáctenos</h1>
      <p className="mt-3 text-slate-600">
        Estamos en {site.address.line1}, {site.address.city}.
      </p>
      <ul className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm">
        <li>
          <span className="font-medium text-slate-900">Teléfono fijo:</span>{" "}
          <a href={`tel:${site.phone}`} className="text-sky-700">{site.phone}</a>
        </li>
        <li>
          <span className="font-medium text-slate-900">Móvil / WhatsApp:</span>{" "}
          <a href={`tel:${site.mobile}`} className="text-sky-700">{site.mobile}</a>
        </li>
        <li>
          <span className="font-medium text-slate-900">Email:</span>{" "}
          <a href={`mailto:${site.email}`} className="text-sky-700">{site.email}</a>
        </li>
      </ul>
      <a
        href={whatsappHref("Hola, quisiera contactar a Bienes Raíces Altair.")}
        className="mt-6 inline-block rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white"
        target="_blank"
        rel="noreferrer"
      >
        Escribir por WhatsApp
      </a>
    </div>
  );
}
