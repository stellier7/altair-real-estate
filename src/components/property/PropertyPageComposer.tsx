import type { Property } from "@/lib/properties/types";
import { propertyRepository } from "@/lib/properties/repository";
import { getRelatedProperties } from "@/lib/properties/related";
import {
  formatPropertyType,
  formatStatus,
  getDisplayPrice,
  supportsCommercialSpecs,
  supportsInvestmentBlock,
  supportsLandSpecs,
  supportsResidentialSpecs,
} from "@/lib/properties/specs";
import { propertyCopy } from "@/lib/i18n/property-copy";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { buildPropertyWhatsAppUrl } from "@/lib/contact/whatsapp";
import { PropertyCard } from "@/components/directory/PropertyCard";
import { PropertyGallery } from "./PropertyGallery";
import { PropertyHero } from "./PropertyHero";

type PropertyPageComposerProps = {
  property: Property;
};

export function PropertyPageComposer({ property }: PropertyPageComposerProps) {
  const price = getDisplayPrice(property);
  const gallery = property.media.gallery ?? [];
  const allImages = [property.media.heroImage, ...gallery];
  const related = getRelatedProperties(
    property,
    propertyRepository.getAll(),
    3,
  );

  const labels = propertyCopy.specLabels;

  const residentialRows =
    property.residential && supportsResidentialSpecs(property.propertyType)
      ? [
          [labels.totalArea, property.residential.totalArea, "m²"],
          [labels.lotSize, property.residential.lotSize, "m²"],
          [labels.bedrooms, property.residential.bedrooms],
          [labels.bathrooms, property.residential.bathrooms],
          [labels.parking, property.residential.parking],
          [labels.yearBuilt, property.residential.yearBuilt],
        ]
      : [];

  const commercialRows =
    property.commercial && supportsCommercialSpecs(property.propertyType)
      ? [
          [labels.useClass, property.commercial.useClass],
          [labels.floors, property.commercial.floors],
          [labels.units, property.commercial.units],
        ]
      : [];

  const landRows =
    property.land && supportsLandSpecs(property.propertyType)
      ? [
          [labels.zoning, property.land.zoning],
          [labels.buildableArea, property.land.buildableArea, "m²"],
        ]
      : [];

  const mapUrl = property.location.coordinates
    ? `https://www.openstreetmap.org/?mlat=${property.location.coordinates.lat}&mlon=${property.location.coordinates.lng}#map=14/${property.location.coordinates.lat}/${property.location.coordinates.lng}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(property.location.label)}`;

  const whatsappUrl = buildPropertyWhatsAppUrl(property.name);
  const ctaLabel = property.contact?.ctaLabel ?? propertyCopy.enquireWhatsApp;

  return (
    <>
      <PropertyHero property={property} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {formatPropertyType(property.propertyType)} · {formatStatus(property.status)}
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {property.title ?? property.name}
            </h2>
            <p className="mt-4 text-lg text-muted">{property.location.label}</p>
            {property.location.address ? (
              <p className="mt-2 text-sm text-muted">{property.location.address}</p>
            ) : null}
          </RevealOnScroll>
          <RevealOnScroll delayMs={100} className="border-t border-line pt-6 lg:border-t-0 lg:pt-0">
            {price ? (
              <p className="text-sm uppercase tracking-[0.18em]">{price}</p>
            ) : null}
            {property.shortDescription ? (
              <p className="prose-editorial mt-6">{property.shortDescription}</p>
            ) : null}
            <Button
              href={whatsappUrl}
              variant="secondary"
              className="mt-8"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ctaLabel}
            </Button>
          </RevealOnScroll>
        </div>
      </Section>

      {gallery.length > 0 ? (
        <Section bleed>
          <Container>
            <RevealOnScroll>
              <PropertyGallery images={allImages} />
            </RevealOnScroll>
          </Container>
        </Section>
      ) : null}

      {property.description ? (
        <Section>
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.theProperty}</h2>
            <p className="prose-editorial mt-6 whitespace-pre-line">{property.description}</p>
          </RevealOnScroll>
        </Section>
      ) : null}

      {residentialRows.length + commercialRows.length + landRows.length > 0 ? (
        <Section className="bg-surface">
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.specifications}</h2>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...residentialRows, ...commercialRows, ...landRows]
                .filter((row) => row[1] !== undefined && row[1] !== null)
                .map(([label, value, unit]) => (
                  <div key={String(label)} className="spec-tile border-t border-line pt-4">
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted">{label}</dt>
                    <dd className="mt-2 font-display text-2xl">
                      {value}
                      {unit ? ` ${unit}` : ""}
                    </dd>
                  </div>
                ))}
            </dl>
          </RevealOnScroll>
        </Section>
      ) : null}

      {property.features && property.features.length > 0 ? (
        <Section>
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.features}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {property.features.map((feature) => (
                <li key={feature} className="text-muted">{feature}</li>
              ))}
            </ul>
          </RevealOnScroll>
        </Section>
      ) : null}

      {property.amenities && property.amenities.length > 0 ? (
        <Section>
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.amenities}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {property.amenities.map((item) => (
                <li key={item} className="text-muted">{item}</li>
              ))}
            </ul>
          </RevealOnScroll>
        </Section>
      ) : null}

      {property.media.video ? (
        <Section>
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.video}</h2>
            <Button
              href={property.media.video.url}
              variant="outline"
              className="mt-4"
              target="_blank"
              rel="noreferrer"
            >
              {propertyCopy.watchFilm}
            </Button>
          </RevealOnScroll>
        </Section>
      ) : null}

      {property.media.virtualTour ? (
        <Section>
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.virtualTour}</h2>
            <Button
              href={property.media.virtualTour.url}
              variant="outline"
              className="mt-4"
              target="_blank"
              rel="noreferrer"
            >
              {property.media.virtualTour.label ?? propertyCopy.openVirtualTour}
            </Button>
          </RevealOnScroll>
        </Section>
      ) : null}

      {supportsInvestmentBlock(property) && property.investment ? (
        <Section className="bg-surface">
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.investment}</h2>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              {property.investment.yield ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">{propertyCopy.yield}</dt>
                  <dd className="mt-2 font-display text-2xl">{property.investment.yield}</dd>
                </div>
              ) : null}
              {property.investment.tenancy ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted">{propertyCopy.tenancy}</dt>
                  <dd className="mt-2 text-muted">{property.investment.tenancy}</dd>
                </div>
              ) : null}
            </dl>
            {property.investment.highlights ? (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {property.investment.highlights.map((item) => (
                  <li key={item} className="text-muted">{item}</li>
                ))}
              </ul>
            ) : null}
          </RevealOnScroll>
        </Section>
      ) : null}

      {(property.floorPlans?.length ?? 0) > 0 || (property.documents?.length ?? 0) > 0 ? (
        <Section>
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.documents}</h2>
            <ul className="mt-6 space-y-3">
              {[...(property.floorPlans ?? []), ...(property.documents ?? [])].map((doc) => (
                <li key={doc.url}>
                  <a href={doc.url} className="focus-ring text-accent">
                    {doc.title}
                  </a>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </Section>
      ) : null}

      {property.location.label ? (
        <Section>
          <RevealOnScroll>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.location}</h2>
            <p className="mt-4 text-muted">{property.location.label}</p>
            <Button href={mapUrl} variant="outline" className="mt-6" target="_blank" rel="noreferrer">
              {propertyCopy.viewOnMap}
            </Button>
          </RevealOnScroll>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section>
          <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.related}</h2>
            <Button href="/properties" variant="ghost">
              {propertyCopy.viewAll}
            </Button>
          </RevealOnScroll>
          <div className="grid gap-16">
            {related.map((item, index) => (
              <RevealOnScroll key={item.id} delayMs={index * 60}>
                <PropertyCard property={item} />
              </RevealOnScroll>
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="border-t border-line">
        <RevealOnScroll className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">{propertyCopy.discuss}</h2>
            <p className="prose-editorial mt-4">{propertyCopy.discussBody}</p>
          </div>
          <Button href={whatsappUrl} variant="primary" target="_blank" rel="noopener noreferrer">
            {propertyCopy.whatsapp}
          </Button>
        </RevealOnScroll>
      </Section>
    </>
  );
}
