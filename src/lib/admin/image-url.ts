/** True when value is an absolute http(s) URL suitable for public image src. */
export function isHttpImageUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates hero + gallery image strings from the property form.
 * Returns a Spanish error message, or null when all values are ok.
 */
export function validatePropertyImageUrls(
  heroSrc: string,
  galleryLines: string[],
): string | null {
  const hero = heroSrc.trim();
  if (hero && !isHttpImageUrl(hero)) {
    return "La imagen principal debe ser una URL http(s). Use «Subir desde el equipo» o pegue un enlace de Wasi; no pegue rutas de su computadora (C:\\...).";
  }

  for (const line of galleryLines) {
    const src = line.trim();
    if (!src) continue;
    if (!isHttpImageUrl(src)) {
      return "Cada URL de la galería debe ser http(s). Use «Subir desde el equipo» o pegue enlaces de Wasi; no pegue rutas de su computadora (C:\\...).";
    }
  }

  return null;
}
