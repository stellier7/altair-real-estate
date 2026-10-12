import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { siteConfig } from "@/content/site/config";
import { buildSiteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildSiteMetadata({
  title: "Nosotros",
  description:
    "Desde 2014, Bienes Raíces Altair ayuda a familias, empresas e inversionistas a comprar, vender, rentar y administrar propiedades en Honduras. Atención en español e inglés.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section>
        <p className="type-meta-caps text-accent">Nosotros</p>
        <h1 className="mt-3 max-w-4xl font-display text-5xl text-accent sm:text-6xl">
          {siteConfig.name}
        </h1>
        <div className="prose-editorial mt-8 max-w-2xl space-y-6">
          <p>
            Desde 2014 ayudamos a familias, embajadas, organizaciones diplomáticas, empresas e
            inversionistas a comprar, vender, rentar y administrar propiedades en toda Honduras.
          </p>
          <p>
            Somos especialistas en propiedades residenciales, comerciales e industriales: casas,
            apartamentos, terrenos, locales, bodegas y activos de inversión. Además de la
            compraventa, administramos propiedades para dueños que quieren rentabilidad sin
            preocupaciones.
          </p>
          <p>
            Atención en español e inglés, ideal para clientes en el extranjero e inversionistas
            internacionales.
          </p>
        </div>
        <p className="type-meta mt-10 max-w-2xl">
          Oficina: {siteConfig.offices[0].address}
        </p>
      </Section>

      <Section className="bg-surface">
        <p className="type-meta-caps text-accent">English</p>
        <h2 className="mt-3 font-display text-3xl text-accent sm:text-4xl">About Altair</h2>
        <p className="prose-editorial mt-6 max-w-2xl">
          Since 2014, we've helped families, businesses, diplomatic organizations, and investors
          buy, sell, rent, and manage property across Honduras, with residential, commercial, and
          industrial expertise and full property management for owners. Bilingual service in English
          and Spanish.
        </p>
      </Section>
    </>
  );
}
