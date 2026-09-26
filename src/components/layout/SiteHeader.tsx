import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site/config";
import { Button } from "@/components/ui/Button";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-background/88 shadow-[var(--shadow-header)] backdrop-blur-lg transition-shadow duration-500">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" className="focus-ring flex items-center gap-3">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={160}
            height={48}
            className="h-10 w-auto max-w-[160px] object-contain"
            priority
          />
          <span className="hidden font-display text-xl tracking-tight sm:inline sm:text-2xl">
            {siteConfig.name}
          </span>
        </Link>
        <nav
          className="hidden items-center gap-6 text-sm uppercase tracking-[0.16em] text-muted lg:flex"
          aria-label="Principal"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring nav-link transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button href="/contact" variant="primary" className="!px-6 !py-2.5">
            Contacto
          </Button>
        </nav>
        <MobileNav />
      </Container>
    </header>
  );
}
