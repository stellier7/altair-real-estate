"use client";

import { useState } from "react";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";
import type { ImageAsset } from "@/lib/properties/types";

type PropertyGalleryProps = {
  images: ImageAsset[];
};

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) {
    return null;
  }

  return (
    <div className="grid gap-5">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Imagen {active + 1} de {images.length}: {current.alt}
      </p>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)] bg-foreground/5 shadow-[var(--shadow-card)]">
        <PropertyListingImage
          src={current.src}
          alt={current.alt}
          sizes="100vw"
          className="transition-opacity duration-500 ease-out"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-2" role="tablist" aria-label="Galería de fotos">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              role="tab"
              className={`focus-ring relative h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-md)] border shadow-[var(--shadow-soft)] transition-[transform,opacity,box-shadow] duration-300 ease-out hover:-translate-y-0.5 ${
                index === active
                  ? "border-foreground/25 opacity-100 ring-2 ring-foreground/15"
                  : "border-transparent opacity-75"
              }`}
              onClick={() => setActive(index)}
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
              aria-selected={index === active}
            >
              <PropertyListingImage src={image.src} alt="" sizes="112px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
