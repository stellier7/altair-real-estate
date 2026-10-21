"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";

export type CityMarqueeItem = {
  id: string;
  label: string;
  href: string;
  image: { src: string; alt: string } | null;
};

type CityMarqueeProps = {
  items: CityMarqueeItem[];
};

export function CityMarquee({ items }: CityMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node || reduceMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  if (items.length === 0) {
    return null;
  }

  // Repeat so short lists still fill the rail; animation still shifts by 50%.
  const loopSource =
    items.length >= 4 ? items : [...items, ...items, ...items, ...items];
  const sequence = reduceMotion ? items : [...loopSource, ...loopSource];
  const shouldAnimate = !reduceMotion && inView;

  return (
    <div
      ref={viewportRef}
      className={`city-marquee-viewport ${reduceMotion ? "city-marquee-viewport--static" : ""}`}
      role="region"
      aria-label="Otras zonas de cobertura"
      aria-roledescription={reduceMotion ? undefined : "carrusel"}
    >
      <ul
        className={`city-marquee-track ${shouldAnimate ? "city-marquee-track--animate" : ""}`}
        style={
          shouldAnimate
            ? { animationDuration: `${Math.max(32, loopSource.length * 6)}s` }
            : undefined
        }
      >
        {sequence.map((item, index) => {
          const isDuplicate = !reduceMotion && index >= loopSource.length;
          return (
            <li
              key={`${item.id}-${index}`}
              className="city-marquee-item"
              aria-hidden={isDuplicate ? true : undefined}
            >
              <Link
                href={item.href}
                className="city-marquee-link focus-ring group"
                tabIndex={isDuplicate ? -1 : undefined}
              >
                {item.image ? (
                  <span className="city-marquee-frame">
                    <PropertyListingImage
                      src={item.image.src}
                      alt={isDuplicate ? "" : item.image.alt}
                      sizes="160px"
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                  </span>
                ) : (
                  <span className="city-marquee-fallback" aria-hidden />
                )}
                <span className="city-marquee-label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
