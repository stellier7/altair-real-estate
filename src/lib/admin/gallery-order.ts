/** Split gallery form text into non-empty URL lines. */
export function parseGalleryLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Join gallery URLs for the hidden form field (order = line order). */
export function serializeGalleryLines(urls: string[]): string {
  return urls.map((url) => url.trim()).filter(Boolean).join("\n");
}

/**
 * Move one item from `fromIndex` to `toIndex` (inclusive).
 * Returns the same array reference when the move is a no-op or out of bounds.
 */
export function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items;
  }
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

/** Move one gallery URL string from `fromIndex` to `toIndex` (inclusive). */
export function moveGalleryItem(
  items: string[],
  fromIndex: number,
  toIndex: number,
): string[] {
  return moveItem(items, fromIndex, toIndex);
}

/** Keep first occurrence of each URL; drop later duplicates. */
export function dedupePreserveOrder(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const url = raw.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}
