import { HomeHero } from "@/components/home/HomeHero";
import { PropertyCard } from "@/components/directory/PropertyCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site/config";
import { catalogStats, propertyRepository } from "@/lib/properties/repository";
import type { Property } from "@/lib/properties/types";

function getHomeFeaturedProperties(): Property[] {
  return siteConfig.homeFeaturedPropertySlugs
    .map((slug) => propertyRepository.getBySlug(slug))
    .filter((property): property is Property => property !== undefined);
}

export default function HomePage() {
  const featured = getHomeFeaturedProperties();
  const stats = catalogStats();
  const heroImage = siteConfig.heroImage;

  return (
    <>
      <HomeHero heroImage={heroImage} stats={stats} />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <RevealOnScroll>
            <p className="type-meta-caps text-accent">Altair</p>
            <h2 className="type-display-section mt-3 text-accent">Quiénes somos</h2>
          </RevealOnScroll>
          <RevealOnScroll delayMs={100}>
            <p className="prose-editorial">
              Somos una empresa de bienes raíces en Tegucigalpa especializada en ventas y rentas de
              propiedades comerciales, residenciales e industriales. Ofrecemos experiencia,
              profesionalismo y ética a nuestros clientes.
            </p>
          </RevealOnScroll>
        </div>
      </Section>

      <Section id="featured" className="bg-[color-mix(in_srgb,var(--accent-soft)_55%,transparent)]">
        <RevealOnScroll className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="type-meta-caps text-accent">Catálogo</p>
            <h2 className="type-display-section mt-3 text-accent">Inmuebles destacados</h2>
          </div>
          <Button href="/properties" variant="primary">
            Ver catálogo
          </Button>
        </RevealOnScroll>
        <div className="grid gap-8 lg:gap-10">
          {featured.map((property, index) => (
            <RevealOnScroll key={property.id} delayMs={index * 80}>
              <PropertyCard property={property} priority={index === 0} />
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      <Section className="bg-surface/80">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <p className="type-meta-caps text-accent">Oferta</p>
            <h2 className="type-display-section mt-3 text-accent">Servicios</h2>
            <p className="prose-editorial mt-6">
              Asesoría en compra y venta de casas, apartamentos, terrenos, locales, bodegas y
              oficinas en Tegucigalpa y otras ciudades de Honduras.
            </p>
            <Button href="/services" variant="primary" className="mt-8">
              Conocer servicios
            </Button>
          </RevealOnScroll>
          <RevealOnScroll delayMs={120}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                "Venta residencial",
                "Alquileres",
                "Propiedad comercial",
                "Terrenos y fincas",
                "Oficinas y locales",
                "Asesoría personalizada",
              ].map((item, i) => (
                <li
                  key={item}
                  className="service-line type-meta-caps border-t border-accent/35 pt-4 text-accent"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </Section>
    </>
  );
}
