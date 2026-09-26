import { HomeHero } from "@/components/home/HomeHero";
import { PropertyCard } from "@/components/directory/PropertyCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { catalogStats, propertyRepository } from "@/lib/properties/repository";

export default function HomePage() {
  const featured = propertyRepository
    .getAll()
    .filter((property) => property.featured)
    .slice(0, 3);
  const stats = catalogStats();
  const heroImage =
    featured[0]?.media.heroImage.src ??
    "https://images.wasi.co/empresas/b20190828112855.png";

  return (
    <>
      <HomeHero heroImage={heroImage} stats={stats} />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <RevealOnScroll>
            <h2 className="font-display text-4xl sm:text-5xl">Quiénes somos</h2>
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

      <Section id="featured">
        <RevealOnScroll className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl sm:text-5xl">Inmuebles destacados</h2>
          <Button href="/properties" variant="outline">
            Ver catálogo
          </Button>
        </RevealOnScroll>
        <div className="grid gap-20">
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
            <h2 className="font-display text-4xl sm:text-5xl">Servicios</h2>
            <p className="prose-editorial mt-6">
              Asesoría en compra y venta de casas, apartamentos, terrenos, locales, bodegas y
              oficinas en Tegucigalpa y otras ciudades de Honduras.
            </p>
            <Button href="/services" variant="secondary" className="mt-8">
              Conocer servicios
            </Button>
          </RevealOnScroll>
          <RevealOnScroll delayMs={120}>
            <ul className="grid gap-4 text-muted sm:grid-cols-2">
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
                  className="service-line border-t border-line pt-4 text-sm uppercase tracking-[0.14em]"
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
