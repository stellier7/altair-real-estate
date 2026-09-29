import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site/config";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-background/88 shadow-[var(--shadow-header)] backdrop-blur-lg transition-shadow duration-500">
      <a
        href="#contenido-principal"
        className="focus-ring sr-only left-4 top-4 z-[60] rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:absolute"
      >
        Saltar al contenido
      </a>
      <Container className="flex h-16 items-center gap-3 sm:h-20 sm:gap-4">
        <Link href="/" className="focus-ring group flex shrink-0 items-center">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line/70 bg-surface shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-200 group-hover:border-line group-hover:shadow-[var(--shadow-card)] sm:h-12 sm:w-12">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={96}
              height={96}
              className="h-[88%] w-[88%] object-contain"
              priority
            />
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <nav
            className="hidden items-center gap-1 text-sm lg:flex xl:gap-2"
            aria-label="Principal"
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring type-meta-caps inline-flex min-h-11 items-center rounded-full px-3 transition-colors hover:bg-surface hover:text-foreground xl:px-3.5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
