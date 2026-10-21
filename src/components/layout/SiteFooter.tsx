import Link from "next/link";
import { siteConfig } from "@/content/site/config";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { Container } from "./Container";

const phoneHref = (display: string) => `tel:${display.replace(/\s/g, "")}`;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl();
  const office = siteConfig.offices[0];

  return (
    <footer className="border-t border-line bg-surface" aria-label="Pie de página">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between md:gap-16">
        <div className="max-w-md space-y-3 text-sm text-muted">
          <p>
            <a
              className="focus-ring inline-flex min-h-11 items-center py-1 font-medium text-accent transition-colors hover:text-accent-hover"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp · {siteConfig.whatsapp.display}
            </a>
          </p>
          <p>
            <a
              className="focus-ring inline-flex min-h-11 items-center py-1 text-accent transition-colors hover:text-accent-hover"
              href={phoneHref(siteConfig.phone)}
            >
              Tel. {siteConfig.phone}
            </a>
          </p>
          {office ? (
            <p className="leading-relaxed">
              <span className="font-medium text-foreground">{office.city}</span>
              {" — "}
              {office.address}
            </p>
          ) : null}
        </div>
        <nav aria-label="Navegación del pie" className="md:text-right">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:justify-end">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring inline-flex min-h-11 items-center py-1 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-line py-6">
        <div className="grid gap-3 text-center sm:grid-cols-3 sm:items-center sm:gap-4">
          <p className="type-meta sm:text-left">
            © {year} {siteConfig.name}.
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
          <p className="type-meta sm:text-right">Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}
