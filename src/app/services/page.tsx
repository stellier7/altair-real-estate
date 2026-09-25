import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { buildSiteMetadata } from "@/lib/seo/metadata";

const services = [
  {
    title: "Venta de inmuebles",
    body: "Casas, apartamentos, terrenos, fincas y edificios en Tegucigalpa y a nivel nacional.",
  },
  {
    title: "Alquileres",
    body: "Residencial y comercial: apartamentos, casas, locales, oficinas y bodegas.",
  },
  {
    title: "Propiedad comercial",
    body: "Locales, oficinas, bodegas y edificios para su negocio o inversión.",
  },
  {
    title: "Asesoría integral",
    body: "Acompañamiento en visitas, negociación y documentación con nuestro equipo en Metropolis.",
  },
];

export const metadata: Metadata = buildSiteMetadata({
  title: "Servicios",
  description: "Ventas, alquileres y asesoría inmobiliaria en Honduras.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Section>
        <h1 className="font-display text-5xl sm:text-6xl">Servicios</h1>
        <p className="prose-editorial mt-6 max-w-2xl">
          Ventas y rentas de propiedades comerciales, residenciales e industriales. Contáctenos para
          asesoría personalizada.
        </p>
      </Section>
      <Section className="bg-surface">
        <div className="grid gap-12 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="border-t border-line pt-6">
              <h2 className="font-display text-3xl">{service.title}</h2>
              <p className="prose-editorial mt-4">{service.body}</p>
            </article>
          ))}
        </div>
        <a
          href={buildWhatsAppUrl()}
          className="focus-ring mt-12 inline-block text-sm uppercase tracking-[0.18em] text-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar por WhatsApp →
        </a>
      </Section>
    </>
  );
}
