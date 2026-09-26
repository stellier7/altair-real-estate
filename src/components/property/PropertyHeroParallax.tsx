"use client";

import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import type { Property } from "@/lib/properties/types";
import {
  formatPropertyType,
  formatStatus,
  getDisplayPrice,
} from "@/lib/properties/specs";

type PropertyHeroParallaxProps = {
  property: Property;
};

export function PropertyHeroParallax({ property }: PropertyHeroParallaxProps) {
  const price = getDisplayPrice(property);

  return (
    <ParallaxMedia
      src={property.media.heroImage.src}
      alt={property.media.heroImage.alt}
      priority
      minHeightClass="min-h-[70vh] lg:min-h-[85vh]"
      overlayClassName="bg-gradient-to-t from-background/90 via-background/25 to-transparent"
    >
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[var(--max-width)] px-5 pb-10 sm:px-8 lg:px-12 lg:pb-14">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/80">
              {formatPropertyType(property.propertyType)} · {formatStatus(property.status)}
            </p>
          </RevealOnScroll>
          <RevealOnScroll delayMs={100}>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-foreground/70">
              {property.location.label}
            </p>
            <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl lg:text-6xl">
              {property.name}
            </h1>
            {price ? (
              <p className="mt-4 text-sm uppercase tracking-[0.18em] text-foreground/90">{price}</p>
            ) : null}
          </RevealOnScroll>
        </div>
      </div>
    </ParallaxMedia>
  );
}
