import Link from "next/link";
import { siteConfig } from "@/content/site/config";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { Container } from "./Container";

const phoneHref = (display: string) => `tel:${display.replace(/\s/g, "")}`;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <footer className="border-t border-line bg-surface" aria-label="Pie de página">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div>
          <p className="font-display text-2xl tracking-tight text-accent">{siteConfig.name}</p>
          <p className="type-caption mt-4">{siteConfig.tagline}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <nav aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className="type-meta-caps text-accent">
              Navegación
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-ring inline-block min-h-11 py-1 leading-snug transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading" className="type-meta-caps text-accent">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a
                  className="focus-ring inline-flex min-h-11 items-center py-1 font-medium text-accent transition-colors hover:text-accent-hover"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp · {siteConfig.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  className="focus-ring inline-flex min-h-11 items-center py-1 text-accent transition-colors hover:text-accent-hover"
                  href={phoneHref(siteConfig.phone)}
                >
                  Tel. {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  className="focus-ring inline-flex min-h-11 items-center py-1 break-all text-accent transition-colors hover:text-accent-hover"
                  href={`mailto:${siteConfig.contactEmail}`}
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
              {siteConfig.offices.map((office) => (
                <li key={office.city} className="pt-1 leading-relaxed">
                  <span className="font-medium text-foreground">{office.city}</span>
                  <br />
                  {office.address}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      <Container className="border-t border-line py-6">
        <div className="grid gap-3 text-center sm:grid-cols-3 sm:items-center sm:gap-4">
          <p className="type-meta sm:text-left">
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p className="type-meta sm:text-center">
            Diseñado por{" "}
            <a
              href="https://www.iagodigital.com/"
              className="focus-ring font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              iAGO Digital
            </a>
          </p>
          <p className="type-meta sm:text-right">
            <a
              href={whatsappUrl}
              className="focus-ring font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp · {siteConfig.whatsapp.display}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
