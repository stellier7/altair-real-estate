import type { Property } from "./types";

export type ResolvedPropertyRequest = {
  property: Property;
  redirectTo?: string;
};

/** Open a listing by its public slug, or by the id used in the admin URL. */
export function resolvePropertyRequest(
  requested: string,
  bySlug: Property | undefined,
  byId: Property | undefined,
): ResolvedPropertyRequest | undefined {
  if (bySlug) {
    if (bySlug.slug && bySlug.slug !== requested) {
      return {
        property: bySlug,
        redirectTo: `/properties/${bySlug.slug}`,
      };
    }
    return { property: bySlug };
  }
  if (!byId) {
    return undefined;
  }
  if (byId.slug && byId.slug !== requested) {
    return {
      property: byId,
      redirectTo: `/properties/${byId.slug}`,
    };
  }
  return { property: byId };
}
