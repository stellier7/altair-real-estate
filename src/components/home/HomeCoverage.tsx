import Link from "next/link";
import { CityMarquee } from "@/components/home/CityMarquee";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import type { CoverageCityCard } from "@/lib/properties/coverage-media";

type HomeCoverageProps = {
  featured: CoverageCityCard[];
  secondary: CoverageCityCard[];
};

export function HomeCoverage({ featured, secondary }: HomeCoverageProps) {
  const marqueeItems = secondary.map((city) => ({
    id: city.slug,
    label: city.label,
    href: city.href,
    image: city.image,
  }));

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {featured.map((city, index) => (
          <RevealOnScroll key={city.slug} delayMs={index * 70}>
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
                    priority={index < 2}
                  />
                ) : (
                  <span className="coverage-card-fallback" aria-hidden />
                )}
                <span className="coverage-card-scrim" aria-hidden />
                <span className="coverage-card-label">{city.label}</span>
              </span>
            </Link>
          </RevealOnScroll>
        ))}
      </div>

      {marqueeItems.length > 0 ? (
        <div className="mt-12 grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <RevealOnScroll delayMs={80} className="min-w-0">
            <CityMarquee items={marqueeItems} />
          </RevealOnScroll>
          <RevealOnScroll delayMs={120} className="lg:justify-self-end">
            <Link
              href="/properties"
              className="focus-ring type-meta-caps inline-flex min-h-11 items-center text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent"
            >
              Más en catálogo →
            </Link>
          </RevealOnScroll>
        </div>
      ) : (
        <div className="mt-10">
          <Link
            href="/properties"
            className="focus-ring type-meta-caps inline-flex min-h-11 items-center text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent"
          >
            Más en catálogo →
          </Link>
        </div>
      )}
    </Section>
  );
}
