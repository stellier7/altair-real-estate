"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import type { CoverageCityCard } from "@/lib/properties/coverage-media";

type HomeCoverageProps = {
  featured: CoverageCityCard[];
  secondary: CoverageCityCard[];
};

function CoverageCityLink({
  city,
  priority = false,
}: {
  city: CoverageCityCard;
  priority?: boolean;
}) {
  return (
    <Link
      href={city.href}
      className="coverage-card focus-ring group block"
      aria-label={`Ver propiedades en ${city.label}`}
    >
      <span className="coverage-card-media">
        {city.image ? (
          <PropertyListingImage
            src={city.image.src}
            alt={city.image.alt}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            priority={priority}
          />
        ) : (
          <span className="coverage-card-fallback" aria-hidden />
        )}
        <span className="coverage-card-scrim" aria-hidden />
        <span className="coverage-card-label">{city.label}</span>
      </span>
    </Link>
  );
}

export function HomeCoverage({ featured, secondary }: HomeCoverageProps) {
  const [showAll, setShowAll] = useState(false);
  const panelId = useId();
  const cities = showAll ? [...featured, ...secondary] : featured;
  const canExpand = secondary.length > 0;

  return (
    <Section id="cobertura" className="bg-surface/70">
      <RevealOnScroll className="mb-10 max-w-2xl">
        <p className="type-meta-caps text-accent">Cobertura</p>
        <h2 className="type-display-section mt-3 text-accent">Zonas de atención</h2>
        <p className="prose-editorial mt-4">
          Presencia activa en Tegucigalpa y ciudades clave de Honduras. Explore el catálogo por
          zona.
        </p>
      </RevealOnScroll>

      <div
        id={panelId}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
      >
        {cities.map((city, index) => (
          <RevealOnScroll key={city.slug} delayMs={Math.min(index, 5) * 60}>
            <CoverageCityLink city={city} priority={!showAll && index < 2} />
          </RevealOnScroll>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        {canExpand ? (
          <button
            type="button"
            className="focus-ring type-meta-caps inline-flex min-h-11 items-center text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent"
            aria-expanded={showAll}
            aria-controls={panelId}
            onClick={() => setShowAll((open) => !open)}
          >
            {showAll ? "Ver menos ←" : "Todas las zonas →"}
          </button>
        ) : null}
        <Link
          href="/properties"
          className="focus-ring type-meta-caps inline-flex min-h-11 items-center text-accent/80 underline decoration-accent/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          Más en catálogo →
        </Link>
      </div>
    </Section>
  );
}
