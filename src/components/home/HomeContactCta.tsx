import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";

export function HomeContactCta() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <Section id="contacto-home" className="bg-surface !pb-8 sm:!pb-10">
      <RevealOnScroll className="max-w-3xl">
        <p className="type-meta-caps text-accent">Contacto</p>
        <h2 className="type-display-section mt-3 text-accent">
          ¿Listo para ver una propiedad?
        </h2>
        <p className="prose-editorial mt-5">
          Escríbanos por WhatsApp. Atención directa desde Tegucigalpa, con cobertura en ciudades
          clave de Honduras.
        </p>
        <div className="mt-8">
          <Button href={whatsappUrl} variant="primary" target="_blank" rel="noopener noreferrer">
            Contactar ahora
          </Button>
        </div>
      </RevealOnScroll>
    </Section>
  );
}
