import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { siteConfig } from "@/content/site/config";
import { buildSiteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildSiteMetadata({
  title: "Nosotros",
  description:
    "Bienes Raíces Altair — ventas y alquileres de propiedades en Tegucigalpa y Honduras.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section>
        <h1 className="max-w-4xl font-display text-5xl sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="prose-editorial mt-8 max-w-2xl">{siteConfig.description}</p>
        <p className="prose-editorial mt-6 max-w-2xl">
          Nuestra oficina está en {siteConfig.offices[0].address}. Atendemos clientes que buscan
          casas, apartamentos, terrenos, locales comerciales y activos de inversión en Honduras.
        </p>
      </Section>
      <Section className="bg-surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Nuestro compromiso</h2>
            <p className="prose-editorial mt-6">
              Convertirnos en la mejor asesoría de bienes raíces en Tegucigalpa, con transparencia
              en cada operación y acompañamiento de principio a fin.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Cobertura</h2>
            <p className="prose-editorial mt-6">
              Catálogo activo en Tegucigalpa y otras regiones — Comayagua, Valle de Ángeles, Roatán
              y más — con fichas actualizadas importadas desde nuestro sistema Wasi.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
