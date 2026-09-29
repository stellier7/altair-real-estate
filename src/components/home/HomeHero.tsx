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
          <h1 className="type-display-hero max-w-4xl">{siteConfig.name}</h1>
          <p className="type-meta mt-4">
            Tegucigalpa, Francisco Morazán · Honduras
          </p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={100}>
          <p className="prose-editorial mt-6">{siteConfig.description}</p>
          <p className="type-caption mt-4">{siteConfig.tagline}</p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={180} className="mt-10 grid w-full grid-cols-3 gap-2 sm:gap-3">
          <Button href="/properties?listing=sale" variant="primary" className="hero-cta-btn w-full min-w-0 justify-center">
            Ver ventas
          </Button>
          <Button href="/properties?listing=rent" variant="outline" className="hero-cta-btn w-full min-w-0 justify-center">
            Ver alquileres
          </Button>
          <Button href="/contact" variant="ghost" className="hero-cta-btn w-full min-w-0 justify-center">
            Contacto
          </Button>
        </RevealOnScroll>
        {stats.total > 0 ? (
          <RevealOnScroll delayMs={240} className="mt-6 sm:mt-8">
            <dl className="grid w-full grid-cols-3 gap-2 sm:gap-4">
              <div className="stat-pill hero-stat-pill">
                <dt className="type-stat-label">Inmuebles</dt>
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
