import type { Metadata } from "next";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import { Section } from "@/components/layout/Section";
import { siteConfig } from "@/content/site/config";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { buildSiteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildSiteMetadata({
  title: "Contacto",
  description: "Teléfono, email y WhatsApp de Bienes Raíces Altair en Tegucigalpa.",
  path: "/contact",
});

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl">Contacto</h1>
          <p className="prose-editorial mt-6 max-w-xl">
            Escríbanos por WhatsApp, llámenos o visite nuestra oficina en Condominios Metropolis.
          </p>
          <div className="mt-10 space-y-6 text-sm text-muted">
            <p>
              <span className="block text-xs uppercase tracking-[0.2em]">WhatsApp / móvil</span>
              <a
                className="focus-ring text-lg text-foreground"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.whatsapp.display}
              </a>
            </p>
            <p>
              <span className="block text-xs uppercase tracking-[0.2em]">Teléfono fijo</span>
              <a className="focus-ring text-lg text-foreground" href={`tel:${siteConfig.phone}`}>
                {siteConfig.phone}
              </a>
            </p>
            <p>
              <span className="block text-xs uppercase tracking-[0.2em]">Email</span>
              <a
                className="focus-ring text-lg text-foreground"
                href={`mailto:${siteConfig.contactEmail}`}
              >
                {siteConfig.contactEmail}
              </a>
            </p>
            {siteConfig.offices.map((office) => (
              <p key={office.city}>
                <span className="block text-xs uppercase tracking-[0.2em]">Ubicación</span>
                {office.address}
              </p>
            ))}
          </div>
        </div>
        <WhatsAppContact heading="Iniciar conversación" />
      </div>
    </Section>
  );
}
