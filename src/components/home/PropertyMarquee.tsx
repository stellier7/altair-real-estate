"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";

export type PropertyMarqueeItem = {
  id: string;
  slug: string;
  name: string;
  price: string | null;
  city?: string;
  image: { src: string; alt: string };
};

type PropertyMarqueeProps = {
  items: PropertyMarqueeItem[];
};

export function PropertyMarquee({ items }: PropertyMarqueeProps) {
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

  const sequence = reduceMotion ? items : [...items, ...items];
  const shouldAnimate = !reduceMotion && inView;

  return (
    <div
      ref={viewportRef}
      className={`property-marquee-viewport ${reduceMotion ? "property-marquee-viewport--static" : ""}`}
      role="region"
      aria-label="Más propiedades del catálogo"
      aria-roledescription={reduceMotion ? undefined : "carrusel"}
    >
      <ul
        className={`property-marquee-track ${shouldAnimate ? "property-marquee-track--animate" : ""}`}
        style={
          shouldAnimate
            ? { animationDuration: `${Math.max(36, items.length * 4.5)}s` }
            : undefined
        }
      >
        {sequence.map((item, index) => {
          const isDuplicate = !reduceMotion && index >= items.length;
          return (
            <li
              key={isDuplicate ? `${item.id}-dup` : item.id}
              className="property-marquee-item"
              aria-hidden={isDuplicate ? true : undefined}
            >
              <Link
                href={`/properties/${item.slug}`}
                className="property-marquee-link focus-ring group"
                tabIndex={isDuplicate ? -1 : undefined}
              >
                <span className="property-marquee-frame">
                  <PropertyListingImage
                    src={item.image.src}
                    alt={isDuplicate ? "" : item.image.alt}
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 280px"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </span>
                <span className="property-marquee-caption">
                  <span className="font-display text-[1.35rem] leading-tight text-white sm:text-[1.5rem]">
                    {item.name}
                  </span>
                  {item.city ? (
                    <span className="type-meta-caps mt-1 text-white/75">{item.city}</span>
                  ) : null}
                  {item.price ? (
                    <span className="type-meta-caps mt-2 text-white/90">{item.price}</span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
