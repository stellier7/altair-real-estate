"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/content/site/config";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="focus-ring text-sm uppercase tracking-[0.18em] text-muted"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Cerrar" : "Menú"}
      </button>
      {open ? (
        <nav
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full border-b border-line bg-background px-5 py-6"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4 text-lg">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring font-display"
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
