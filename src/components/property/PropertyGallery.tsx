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
    <div className="grid gap-4">
      <div className="relative aspect-[16/10] overflow-hidden bg-foreground/5">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              className={`focus-ring relative h-20 w-28 shrink-0 overflow-hidden border ${
                index === active ? "border-foreground" : "border-transparent opacity-70"
              }`}
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
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
