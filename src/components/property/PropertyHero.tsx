import { PropertyHeroParallax } from "./PropertyHeroParallax";
import type { Property } from "@/lib/properties/types";

type PropertyHeroProps = {
  property: Property;
};

export function PropertyHero({ property }: PropertyHeroProps) {
  return <PropertyHeroParallax property={property} />;
}
