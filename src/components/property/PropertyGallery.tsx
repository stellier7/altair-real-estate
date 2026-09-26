"use client";

import Image from "next/image";
import { useState } from "react";
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
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)] bg-foreground/5 shadow-[var(--shadow-card)]"
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="100vw"
          className="object-cover transition-opacity duration-500 ease-out"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              className={`focus-ring relative h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-md)] border shadow-[var(--shadow-soft)] transition-[transform,opacity,box-shadow] duration-300 ease-out hover:-translate-y-0.5 ${
                index === active
                  ? "border-accent/50 opacity-100 ring-2 ring-accent/25"
                  : "border-transparent opacity-75"
              }`}
              onClick={() => setActive(index)}
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={index === active}
            >
              <Image src={image.src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
