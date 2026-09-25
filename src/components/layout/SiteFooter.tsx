import Link from "next/link";
import { siteConfig } from "@/content/site/config";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { Container } from "./Container";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div>
          <p className="font-display text-2xl">{siteConfig.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            {siteConfig.description}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="focus-ring hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Contact</p>
            <p className="mt-4 text-sm text-muted">
              <a
                className="focus-ring hover:text-accent"
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {siteConfig.whatsapp.display}
              </a>
            </p>
            {siteConfig.offices.map((office) => (
              <p key={office.city} className="mt-3 text-sm text-muted">
                {office.city}
                <br />
                {office.address}
              </p>
            ))}
          </div>
        </div>
      </Container>
      <Container className="border-t border-line py-6 text-xs text-muted">
        © {year} {siteConfig.name}. Template for demonstration.
      </Container>
    </footer>
  );
}
