import Image from "next/image";
import type { Property } from "@/lib/properties/types";

type PropertyHeroProps = {
  property: Property;
};

export function PropertyHero({ property }: PropertyHeroProps) {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-foreground/10 lg:min-h-[85vh]">
      <Image
        src={property.media.heroImage.src}
        alt={property.media.heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[var(--max-width)] px-5 pb-10 sm:px-8 lg:px-12 lg:pb-14">
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/80">
            {property.location.label}
          </p>
          <p className="mt-3 font-display text-4xl text-foreground sm:text-5xl lg:text-6xl">
            {property.name}
          </p>
        </div>
      </div>
    </section>
  );
}
