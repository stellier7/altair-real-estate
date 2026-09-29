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
          <p className="font-display text-2xl tracking-tight">{siteConfig.name}</p>
          <p className="type-caption mt-4">{siteConfig.tagline}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <nav aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className="type-meta-caps">
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
            <h2 id="footer-contact-heading" className="type-meta-caps">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a
                  className="focus-ring inline-flex min-h-11 items-center py-1 font-medium text-foreground transition-colors hover:text-accent"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp · {siteConfig.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  className="focus-ring inline-flex min-h-11 items-center py-1 transition-colors hover:text-accent"
                  href={phoneHref(siteConfig.phone)}
                >
                  Tel. {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  className="focus-ring inline-flex min-h-11 items-center py-1 break-all transition-colors hover:text-accent"
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
        <p className="type-meta text-center sm:text-left">
          © {year} {siteConfig.name}. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
}
