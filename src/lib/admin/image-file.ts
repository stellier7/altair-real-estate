export const MAX_PROPERTY_IMAGE_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validatePropertyImageFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Solo se permiten imágenes JPG, PNG, WebP o GIF.";
  }
  if (file.size > MAX_PROPERTY_IMAGE_BYTES) {
    return "La imagen supera el límite de 10 MB.";
  }
  return null;
}
