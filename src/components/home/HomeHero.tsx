"use client";

import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site/config";

const heroCopy = {
  headline: "Compra o alquila en Tegucigalpa",
  lead:
    "Casas, apartamentos, terrenos y locales comerciales en venta y alquiler, con asesoría local de Bienes Raíces Altair.",
  imageAlt:
    "Vista de una propiedad en Tegucigalpa, Honduras, representando el catálogo de la agencia",
} as const;

type HomeHeroProps = {
  heroImage: string;
  stats: { total: number; forSale: number; forRent: number };
};

export function HomeHero({ heroImage, stats }: HomeHeroProps) {
  return (
    <ParallaxMedia src={heroImage} alt={heroCopy.imageAlt} priority>
      <Container className="relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28">
        <RevealOnScroll>
          <h1 className="type-display-hero max-w-4xl">{heroCopy.headline}</h1>
          <p className="type-meta mt-4">
            {siteConfig.name} · Tegucigalpa, Francisco Morazán, Honduras
          </p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={100}>
          <p className="prose-editorial mt-6">{heroCopy.lead}</p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={180} className="mt-10 grid w-full grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <Button
            href="/properties?listing=sale"
            variant="primary"
            className="hero-cta-btn w-full min-w-0 justify-center"
          >
            Propiedades en venta
          </Button>
          <Button
            href="/properties?listing=rent"
            variant="outline"
            className="hero-cta-btn w-full min-w-0 justify-center"
          >
            Propiedades en alquiler
          </Button>
          <Button
            href="/contact"
            variant="ghost"
            className="hero-cta-btn w-full min-w-0 justify-center"
          >
            Hablar con un asesor
          </Button>
        </RevealOnScroll>
        {stats.total > 0 ? (
          <RevealOnScroll delayMs={240} className="mt-6 sm:mt-8">
            <p className="sr-only">
              Resumen del catálogo: {stats.total} inmuebles publicados, {stats.forSale} en venta y{" "}
              {stats.forRent} en alquiler.
            </p>
            <dl className="grid w-full grid-cols-3 gap-2 sm:gap-4" aria-label="Resumen del catálogo">
              <div className="stat-pill hero-stat-pill">
                <dt className="type-stat-label">En catálogo</dt>
                <dd className="type-stat-value mt-1">{stats.total}</dd>
              </div>
              <div className="stat-pill hero-stat-pill">
                <dt className="type-stat-label">En venta</dt>
                <dd className="type-stat-value mt-1">{stats.forSale}</dd>
              </div>
              <div className="stat-pill hero-stat-pill">
                <dt className="type-stat-label">En alquiler</dt>
                <dd className="type-stat-value mt-1">{stats.forRent}</dd>
              </div>
            </dl>
          </RevealOnScroll>
        ) : null}
      </Container>
    </ParallaxMedia>
  );
}
