export const SESSION_EXPIRED_MESSAGE =
  "La sesión expiró. Vuelva a entrar en el panel y guarde otra vez.";

/** Turn database and permission failures into a message the assistant can act on. */
export function explainPropertySaveError(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("server action") ||
    normalized.includes("was not found on the server")
  ) {
    return "Esta pantalla del panel está desactualizada. Recargue la página y vuelva a guardar.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("networkerror") ||
    normalized.includes("load failed") ||
    normalized.includes("unexpected response") ||
    normalized.includes("econnreset") ||
    normalized.includes("timed out") ||
    normalized.includes("timeout") ||
    normalized.includes("aborted")
  ) {
    return "El navegador no recibió respuesta del servidor. Por eso puede mostrar una página en blanco. Recargue el panel e intente de nuevo. Si la ficha tiene muchas fotos, guárdela primero sin la galería.";
  }

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
    return SESSION_EXPIRED_MESSAGE;
  }

  return message.trim() || "No se pudo guardar el inmueble.";
}

function readFailure(error: unknown): { message: string; digest?: string } {
  if (typeof error === "string") {
    return { message: error };
  }
  if (typeof error !== "object" || error === null) {
    return { message: "" };
  }
  const record = error as { message?: unknown; digest?: unknown };
  return {
    message: typeof record.message === "string" ? record.message : "",
    digest: typeof record.digest === "string" ? record.digest : undefined,
  };
}

/** Explain a thrown save failure, including the code Next.js hides in production. */
export function explainUnknownSaveFailure(error: unknown): string {
  const { message, digest } = readFailure(error);
  if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
    return SESSION_EXPIRED_MESSAGE;
  }
  const explained = explainPropertySaveError(message);
  if (!digest || explained.includes(digest)) {
    return explained;
  }
  return `${explained} Código: ${digest}.`;
}
