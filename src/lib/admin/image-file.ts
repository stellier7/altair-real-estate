export const MAX_PROPERTY_IMAGE_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const HEIC_MESSAGE =
  "Las fotos HEIC del iPhone no se pueden publicar tal cual. En el iPhone elija Ajustes, Cámara, Formatos, Más compatible, o exporte la foto como JPG y súbala de nuevo.";

function extensionOf(name: string | undefined): string {
  const base = name?.trim().toLowerCase() ?? "";
  const dot = base.lastIndexOf(".");
  return dot >= 0 ? base.slice(dot) : "";
}

function isHeic(file: { type: string; name?: string }): boolean {
  const type = file.type.trim().toLowerCase();
  const extension = extensionOf(file.name);
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    extension === ".heic" ||
    extension === ".heif"
  );
}

/** Mime type to store, inferred from the filename when the browser omits it. */
export function resolvePropertyImageContentType(file: {
  type: string;
  name?: string;
}): string | null {
  if (isHeic(file)) {
    return null;
  }
  const type = file.type.trim().toLowerCase();
  if (type === "image/jpg") {
    return "image/jpeg";
  }
  if (ALLOWED_IMAGE_TYPES.has(type)) {
    return type;
  }
  switch (extensionOf(file.name)) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return null;
  }
}

export function validatePropertyImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): string | null {
  if (isHeic(file)) {
    return HEIC_MESSAGE;
  }
  if (!resolvePropertyImageContentType(file)) {
    return "Solo se permiten imágenes JPG, PNG, WebP o GIF.";
  }
  if (file.size > MAX_PROPERTY_IMAGE_BYTES) {
    return "La imagen supera el límite de 10 MB.";
  }
  return null;
}
