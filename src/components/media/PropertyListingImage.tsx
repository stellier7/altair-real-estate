import Image from "next/image";
import { getImageZoomScale } from "@/lib/images/image-crop";
import { normalizeWasiImageUrl } from "@/lib/images/wasi-url";

type PropertyListingImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
};

export function PropertyListingImage({
  src,
  alt,
  priority,
  sizes,
  className = "",
}: PropertyListingImageProps) {
  if (typeof src !== "string" || !src.trim()) {
    return <div className="absolute inset-0 bg-foreground/10" aria-hidden="true" />;
  }

  const source = src.trim();
  const normalizedSrc = normalizeWasiImageUrl(source);
  const zoom = getImageZoomScale(source);
  const needsZoom = zoom > 1.02;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={normalizedSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`listing-image object-cover object-center ${className} ${
          needsZoom ? "listing-image--zoomed" : ""
        }`}
        style={
          needsZoom
            ? {
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }
            : undefined
        }
      />
    </div>
  );
}
