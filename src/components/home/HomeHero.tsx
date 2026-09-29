"use client";

import Link from "next/link";
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
    "Residencia contemporánea con vista al valle al atardecer, imagen principal del sitio",
} as const;

type HomeHeroProps = {
  heroImage: string;
  stats: { total: number; forSale: number; forRent: number };
};

export function HomeHero({ heroImage, stats }: HomeHeroProps) {
  return (
    <ParallaxMedia
      src={heroImage}
      alt={heroCopy.imageAlt}
      priority
      minHeightClass="hero-shell-min"
      imageClassName="hero-bg-image"
    >
      <Container className="hero-panel relative w-full">
        <RevealOnScroll>
          <h1 className="type-display-hero max-w-4xl text-pretty">{heroCopy.headline}</h1>
          <p className="type-meta mt-4 max-w-2xl text-pretty">
            <span className="block font-medium text-foreground sm:inline">{siteConfig.name}</span>
            <span aria-hidden="true" className="hidden sm:inline">
              {" "}
              ·{" "}
            </span>
            <span className="mt-1 block sm:mt-0 sm:inline">
              Tegucigalpa, Francisco Morazán, Honduras
            </span>
          </p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={100}>
          <p className="prose-editorial mt-5 max-w-2xl sm:mt-6">{heroCopy.lead}</p>
        </RevealOnScroll>

        {stats.total > 0 ? (
          <RevealOnScroll delayMs={160} className="hero-stat-band w-full max-w-2xl">
            <p className="sr-only">
              Resumen del catálogo: {stats.total} inmuebles publicados, {stats.forSale} en venta y{" "}
              {stats.forRent} en alquiler.
            </p>
            <dl className="hero-stat-grid sm:max-w-xl" aria-label="Resumen del catálogo">
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

        <RevealOnScroll delayMs={220} className="hero-actions w-full max-w-none sm:max-w-[36rem]">
          <div className="hero-catalog-actions">
            <Button
              href="/properties?listing=sale"
              variant="primary"
              className="hero-cta-btn w-full min-w-0 justify-center"
            >
              <span className="sm:hidden">En venta</span>
              <span className="hidden sm:inline">Propiedades en venta</span>
            </Button>
            <Button
              href="/properties?listing=rent"
              variant="outline"
              className="hero-cta-btn w-full min-w-0 justify-center"
            >
              <span className="sm:hidden">En alquiler</span>
              <span className="hidden sm:inline">Propiedades en alquiler</span>
            </Button>
          </div>
          <Link
            href="/contact"
            className="focus-ring type-meta inline-flex min-h-11 max-w-full items-center py-2 text-pretty transition-colors hover:text-accent"
          >
            <span className="sm:hidden">Formulario de contacto</span>
            <span className="hidden sm:inline">También puedes usar el formulario de contacto</span>
          </Link>
        </RevealOnScroll>
      </Container>
    </ParallaxMedia>
  );
}
