import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  MAX_PROPERTY_IMAGE_BYTES,
  validatePropertyImageFile,
} from "@/lib/admin/image-file";

export { MAX_PROPERTY_IMAGE_BYTES, validatePropertyImageFile };
export const PROPERTY_IMAGES_BUCKET = "property-images";

function sanitizeFileName(name: string): string {
  const base = name.replace(/^.*[\\/]/, "");
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return cleaned || "image.jpg";
}

/**
 * Uploads an image to the public `property-images` bucket and returns its public URL.
 */
export async function uploadPropertyImage(
  file: File,
  folder: string,
): Promise<string> {
  const validationError = validatePropertyImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const safeFolder =
    folder
      .trim()
      .replace(/[^\w.\-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "draft";
  const objectPath = `${safeFolder}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message || "No se pudo subir la imagen.");
  }

  const { data } = supabase.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .getPublicUrl(objectPath);

  if (!data?.publicUrl) {
    throw new Error("No se pudo obtener la URL pública de la imagen.");
  }

  return data.publicUrl;
}
