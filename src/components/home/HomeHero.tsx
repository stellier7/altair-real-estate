"use client";

import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site/config";

type HomeHeroProps = {
  heroImage: string;
  stats: { total: number; forSale: number; forRent: number };
};

export function HomeHero({ heroImage, stats }: HomeHeroProps) {
  return (
    <ParallaxMedia src={heroImage} alt={siteConfig.name} priority>
      <Container className="relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28">
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            Tegucigalpa · Francisco Morazán · Honduras
          </p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={80}>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delayMs={140}>
          <p className="prose-editorial mt-6 max-w-2xl">{siteConfig.description}</p>
          <p className="mt-4 text-sm text-muted">{siteConfig.tagline}</p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={200} className="mt-10 flex flex-wrap gap-4">
          <Button href="/properties?listing=sale" variant="primary">
            Ver ventas
          </Button>
          <Button href="/properties?listing=rent" variant="outline">
            Ver alquileres
          </Button>
          <Button href="/contact" variant="ghost">
            Contacto
          </Button>
        </RevealOnScroll>
        {stats.total > 0 ? (
          <RevealOnScroll delayMs={260} className="mt-10">
            <dl className="flex flex-wrap gap-10 text-sm">
              <div className="stat-pill">
                <dt className="text-muted">Inmuebles</dt>
                <dd className="font-display text-3xl">{stats.total}</dd>
              </div>
              <div className="stat-pill">
                <dt className="text-muted">En venta</dt>
                <dd className="font-display text-3xl">{stats.forSale}</dd>
              </div>
              <div className="stat-pill">
                <dt className="text-muted">En alquiler</dt>
                <dd className="font-display text-3xl">{stats.forRent}</dd>
              </div>
            </dl>
          </RevealOnScroll>
        ) : null}
      </Container>
    </ParallaxMedia>
  );
}
