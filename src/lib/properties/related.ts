import type { Property } from "./types";

function scoreRelated(candidate: Property, source: Property): number {
  if (candidate.id === source.id) {
    return -1;
  }

  let score = 0;

  if (source.relatedPropertyIds?.includes(candidate.id)) {
    score += 100;
  }

  if (candidate.propertyType === source.propertyType) {
    score += 30;
  }

  if (candidate.location.city && candidate.location.city === source.location.city) {
    score += 25;
  }

  if (candidate.location.region && candidate.location.region === source.location.region) {
    score += 15;
  }

  if (candidate.status === "available" && source.status === "available") {
    score += 5;
  }

  return score;
}

export function getRelatedProperties(
  source: Property,
  all: Property[],
  limit = 3,
): Property[] {
  const manual = source.relatedPropertyIds
    ?.map((id) => all.find((p) => p.id === id))
    .filter((p): p is Property => p !== undefined && p.id !== source.id);

  if (manual && manual.length >= limit) {
    return manual.slice(0, limit);
  }

  const ranked = all
    .map((candidate) => ({
      candidate,
      score: scoreRelated(candidate, source),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const merged: Property[] = [...(manual ?? [])];
  for (const { candidate } of ranked) {
    if (merged.some((p) => p.id === candidate.id)) {
      continue;
    }
    merged.push(candidate);
    if (merged.length >= limit) {
      break;
    }
  }

  return merged.slice(0, limit);
}
