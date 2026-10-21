import Link from "next/link";
import { siteConfig } from "@/content/site/config";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { Container } from "./Container";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl();
  const office = siteConfig.offices[0];

  return (
    <footer className="border-t border-line bg-surface" aria-label="Pie de página">
      <Container className="flex flex-col gap-5 py-5 md:flex-row md:items-start md:justify-between md:gap-8 md:py-6">
        <div className="max-w-md space-y-1 text-sm leading-snug text-muted">
          <p>
            <a
              className="focus-ring inline-flex items-center py-0.5 font-medium text-accent transition-colors hover:text-accent-hover"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp · {siteConfig.whatsapp.display}
            </a>
          </p>
          {office ? (
            <p className="leading-snug">
              <span className="font-medium text-foreground">{office.city}</span>
              {" — "}
              {office.address}
            </p>
          ) : null}
        </div>
        <nav aria-label="Navegación del pie" className="md:text-right">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm md:justify-end">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring inline-flex items-center py-0.5 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-line py-4">
        <div className="grid gap-2 text-center sm:grid-cols-3 sm:items-center sm:gap-3">
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
