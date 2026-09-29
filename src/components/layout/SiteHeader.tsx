"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site/config";
import { useScrollLinkedHeader } from "@/lib/layout/useScrollLinkedHeader";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  const { headerRef, translateY, isFullyHidden } = useScrollLinkedHeader();

  return (
    <header
      ref={headerRef}
      style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
      className={`sticky top-0 z-50 border-b border-line/80 bg-background/88 shadow-[var(--shadow-header)] backdrop-blur-lg will-change-transform motion-reduce:transform-none ${
        isFullyHidden ? "pointer-events-none" : ""
      }`}
      {...(isFullyHidden ? { inert: true } : {})}
    >
      <a
        href="#contenido-principal"
        className="focus-ring sr-only left-4 top-4 z-[60] rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:absolute"
      >
        Saltar al contenido
      </a>
      <Container className="flex h-[var(--site-header-height)] items-center gap-2.5 sm:gap-3 md:h-[var(--site-header-height-md)]">
        <Link href="/" className="focus-ring group flex shrink-0 items-center">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line/70 bg-surface shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-200 group-hover:border-line group-hover:shadow-[var(--shadow-card)] sm:h-10 sm:w-10">
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
                className="focus-ring type-meta-caps inline-flex min-h-10 items-center rounded-full px-2.5 transition-colors hover:bg-surface hover:text-foreground xl:px-3"
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
