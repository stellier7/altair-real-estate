"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/content/site/config";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        className="focus-ring inline-flex min-h-10 items-center rounded-full border border-line/70 bg-surface/80 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted shadow-[var(--shadow-soft)]"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Cerrar" : "Menú"}
      </button>
      {open ? (
        <nav
          id="mobile-nav-panel"
          className="absolute right-0 top-[calc(100%+0.35rem)] z-50 w-[min(100vw-1.5rem,20rem)] rounded-[var(--radius-lg)] border border-line/80 bg-background/95 px-5 py-6 shadow-[var(--shadow-card)] backdrop-blur-lg"
          aria-label="Navegación móvil"
        >
          <ul className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring inline-flex min-h-11 w-full items-center py-2 font-display text-xl transition-colors hover:text-accent"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
