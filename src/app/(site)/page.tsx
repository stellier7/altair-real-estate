import { HomeHero } from "@/components/home/HomeHero";
import { PropertyMarquee } from "@/components/home/PropertyMarquee";
import { PropertyCard } from "@/components/directory/PropertyCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site/config";
import { getHomeFeaturedSlugs } from "@/lib/properties/featured";
import { selectMarqueeProperties } from "@/lib/properties/marquee";
import { getDisplayPrice } from "@/lib/properties/specs";
import {
  getAllProperties,
  getCatalogStats,
  getPropertyBySlug,
} from "@/lib/properties/service";
import type { Property } from "@/lib/properties/types";

async function getHomeFeaturedProperties(): Promise<Property[]> {
  const slugs = await getHomeFeaturedSlugs();
  const properties = await Promise.all(
    slugs.map((slug) => getPropertyBySlug(slug)),
  );
  return properties.filter((property): property is Property => property !== undefined);
}

export default async function HomePage() {
  const featured = await getHomeFeaturedProperties();
  const featuredSlugs = featured.map((property) => property.slug);
  const allProperties = await getAllProperties();
  const marqueeProperties = selectMarqueeProperties(allProperties, {
    excludeSlugs: featuredSlugs,
  });
  const marqueeItems = marqueeProperties.map((property) => ({
    id: property.id,
    slug: property.slug,
    name: property.name,
    price: getDisplayPrice(property),
    city: property.location.city,
    image: {
      src: property.media.heroImage.src,
      alt: property.media.heroImage.alt || property.name,
    },
  }));
  const stats = await getCatalogStats();
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
              Desde 2014 ayudamos a familias, embajadas, organizaciones diplomáticas, empresas e
              inversionistas a comprar, vender, rentar y administrar propiedades en toda Honduras.
              Atención en español e inglés.
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

      {marqueeItems.length > 0 ? (
        <Section bleed className="overflow-hidden bg-surface/60">
          <Container>
            <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="type-meta-caps text-accent">Explorar</p>
                <h2 className="type-display-section mt-3 text-accent">Más en el catálogo</h2>
                <p className="prose-editorial mt-4 max-w-xl">
                  Un recorrido visual por más propiedades disponibles en Honduras.
                </p>
              </div>
              <Button href="/properties" variant="ghost">
                Ver todas
              </Button>
            </RevealOnScroll>
          </Container>
          <RevealOnScroll delayMs={80}>
            <PropertyMarquee items={marqueeItems} />
          </RevealOnScroll>
        </Section>
      ) : null}

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
