"use client";

import Link from "next/link";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site/config";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";

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
  const whatsappUrl = buildWhatsAppUrl();

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
          <p className="prose-editorial mt-6 max-w-2xl">{heroCopy.lead}</p>
        </RevealOnScroll>

        {stats.total > 0 ? (
          <RevealOnScroll delayMs={160} className="hero-stat-band w-full max-w-2xl">
            <p className="sr-only">
              Resumen del catálogo: {stats.total} inmuebles publicados, {stats.forSale} en venta y{" "}
              {stats.forRent} en alquiler.
            </p>
            <dl
              className="grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-4"
              aria-label="Resumen del catálogo"
            >
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

        <RevealOnScroll delayMs={220} className="hero-actions w-full">
          <Button
            href={whatsappUrl}
            variant="secondary"
            className="hero-cta-btn w-full justify-center normal-case tracking-normal sm:tracking-[0.06em]"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp · {siteConfig.whatsapp.display}
          </Button>
          <div className="hero-catalog-actions">
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
          </div>
          <Link
            href="/contact"
            className="focus-ring type-meta inline-flex min-h-11 items-center py-2 transition-colors hover:text-accent"
          >
            También puedes usar el formulario de contacto
          </Link>
        </RevealOnScroll>
      </Container>
    </ParallaxMedia>
  );
}
