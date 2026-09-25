import Image from "next/image";
import { PropertyCard } from "@/components/directory/PropertyCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextLink } from "@/components/ui/TextLink";
import { siteConfig } from "@/content/site/config";
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
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src={heroImage}
          alt={siteConfig.name}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <Container className="relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            Tegucigalpa · Francisco Morazán · Honduras
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="prose-editorial mt-6 max-w-2xl">{siteConfig.description}</p>
          <p className="mt-4 text-sm text-muted">{siteConfig.tagline}</p>
          <div className="mt-10 flex flex-wrap gap-6">
            <TextLink href="/properties?listing=sale">Ver ventas</TextLink>
            <TextLink href="/properties?listing=rent">Ver alquileres</TextLink>
            <TextLink href="/contact">Contacto</TextLink>
          </div>
          {stats.total > 0 ? (
            <dl className="mt-10 flex flex-wrap gap-10 text-sm">
              <div>
                <dt className="text-muted">Inmuebles</dt>
                <dd className="font-display text-3xl">{stats.total}</dd>
              </div>
              <div>
                <dt className="text-muted">En venta</dt>
                <dd className="font-display text-3xl">{stats.forSale}</dd>
              </div>
              <div>
                <dt className="text-muted">En alquiler</dt>
                <dd className="font-display text-3xl">{stats.forRent}</dd>
              </div>
            </dl>
          ) : null}
        </Container>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <h2 className="font-display text-4xl sm:text-5xl">Quiénes somos</h2>
          <p className="prose-editorial">
            Somos una empresa de bienes raíces en Tegucigalpa especializada en ventas y rentas de
            propiedades comerciales, residenciales e industriales. Ofrecemos experiencia,
            profesionalismo y ética a nuestros clientes.
          </p>
        </div>
      </Section>

      <Section id="featured">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl sm:text-5xl">Inmuebles destacados</h2>
          <TextLink href="/properties">Ver catálogo</TextLink>
        </div>
        <div className="grid gap-20">
          {featured.map((property, index) => (
            <PropertyCard key={property.id} property={property} priority={index === 0} />
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">Servicios</h2>
            <p className="prose-editorial mt-6">
              Asesoría en compra y venta de casas, apartamentos, terrenos, locales, bodegas y
              oficinas en Tegucigalpa y otras ciudades de Honduras.
            </p>
            <TextLink href="/services" className="mt-8">Conocer servicios</TextLink>
          </div>
          <ul className="grid gap-4 text-muted sm:grid-cols-2">
            {[
              "Venta residencial",
              "Alquileres",
              "Propiedad comercial",
              "Terrenos y fincas",
              "Oficinas y locales",
              "Asesoría personalizada",
            ].map((item) => (
              <li key={item} className="border-t border-line pt-4 text-sm uppercase tracking-[0.14em]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
