import Image from "next/image";
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
  const normalizedSrc = normalizeWasiImageUrl(src);

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`listing-image object-cover object-center ${className}`}
    />
  );
}
