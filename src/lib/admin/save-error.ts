/** Turn database and permission failures into a message the assistant can act on. */
export function explainPropertySaveError(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("properties_slug") ||
    (normalized.includes("duplicate key") && normalized.includes("slug"))
  ) {
    return "Ya existe un inmueble con esa URL (slug). Cámbielo e intente de nuevo.";
  }

  if (
    normalized.includes("row-level security") ||
    normalized.includes("permission denied") ||
    normalized.includes("42501") ||
    normalized.includes("not authorized")
  ) {
    return "No tiene permiso para guardar este inmueble. Confirme que su usuario está en profiles como asistente o propietario.";
  }

  if (normalized.includes("payload too large") || normalized.includes("413")) {
    return "La ficha es demasiado grande. Acorte la descripción o quite algunas fotos.";
  }

  if (normalized.includes("jwt") || normalized.includes("not authenticated")) {
    return "La sesión expiró. Vuelva a entrar en el panel e intente de nuevo.";
  }

  return message.trim() || "No se pudo guardar el inmueble.";
}
