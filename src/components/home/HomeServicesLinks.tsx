import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { homeServiceLinks } from "@/content/site/coverage";

export function HomeServicesLinks() {
  return (
    <Section id="servicios-home" className="bg-background">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
        <RevealOnScroll>
          <p className="type-meta-caps text-accent">Oferta</p>
          <h2 className="type-display-section mt-3 text-accent">Servicios</h2>
          <p className="prose-editorial mt-5">
            Filtre el catálogo por tipo de operación o consulte asesoría directa.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={100}>
          <ul className="grid gap-0 sm:grid-cols-2">
            {homeServiceLinks.map((item, index) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="service-filter-link focus-ring type-meta-caps group flex min-h-14 items-center border-t border-accent/30 text-accent transition-colors hover:text-accent-hover"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transform-none">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </Section>
  );
}
