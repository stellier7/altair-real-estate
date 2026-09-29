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
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" className="focus-ring flex shrink-0 items-center">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={160}
            height={48}
            className="h-10 w-auto max-w-[160px] object-contain"
            priority
          />
        </Link>
        <nav
          className="hidden items-center gap-5 text-sm lg:flex"
          aria-label="Principal"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring type-meta-caps inline-flex min-h-11 items-center px-1 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </Container>
    </header>
  );
}
