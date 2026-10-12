import type { Property } from "./types";

const DEFAULT_LIMIT = 12;

type SelectMarqueePropertiesOptions = {
  excludeSlugs: string[];
  limit?: number;
};

/**
 * Picks a spread sample of available listings for the homepage photo strip,
 * excluding curated featured slugs so the marquee does not repeat destacados.
 */
export function selectMarqueeProperties(
  properties: Property[],
  options: SelectMarqueePropertiesOptions,
): Property[] {
  const exclude = new Set(options.excludeSlugs);
  const limit = options.limit ?? DEFAULT_LIMIT;

  const eligible = properties.filter(
    (property) =>
      !exclude.has(property.slug) &&
      property.status === "available" &&
      Boolean(property.media.heroImage?.src),
  );

  if (eligible.length <= limit) {
    return eligible;
  }

  const step = Math.max(1, Math.floor(eligible.length / limit));
  const picked: Property[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < limit; i += 1) {
    const candidate = eligible[Math.min(i * step, eligible.length - 1)];
    if (!candidate || seen.has(candidate.id)) {
      continue;
    }
    seen.add(candidate.id);
    picked.push(candidate);
  }

  if (picked.length < limit) {
    for (const property of eligible) {
      if (picked.length >= limit) {
        break;
      }
      if (seen.has(property.id)) {
        continue;
      }
      seen.add(property.id);
      picked.push(property);
    }
  }

  return picked;
}
