import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site/config";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";

const phoneHref = (display: string) => `tel:${display.replace(/\s/g, "")}`;

export function HomeContactCta() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <Section id="contacto-home" className="bg-surface">
      <RevealOnScroll className="max-w-3xl">
        <p className="type-meta-caps text-accent">Contacto</p>
        <h2 className="type-display-section mt-3 text-accent">
          ¿Listo para ver una propiedad?
        </h2>
        <p className="prose-editorial mt-5">
          Escríbanos por WhatsApp o llámenos. Atención directa desde Tegucigalpa, con cobertura en
          ciudades clave de Honduras.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={whatsappUrl} variant="primary" target="_blank" rel="noopener noreferrer">
            Contactar ahora
          </Button>
          <Button href={phoneHref(siteConfig.phone)} variant="outline">
            Tel. {siteConfig.phone}
          </Button>
        </div>
      </RevealOnScroll>
    </Section>
  );
}
