export function propertyEditorPath(id: string): string {
  return `/admin/properties/${encodeURIComponent(id)}`;
}

/** True when save should move to the new editor URL. Same-page saves stay put. */
export function shouldOpenSavedProperty(
  currentPath: string,
  savedTo: string | undefined,
): savedTo is string {
  if (!savedTo) {
    return false;
  }
  const normalize = (path: string) => path.replace(/\/+$/, "") || "/";
  return normalize(currentPath) !== normalize(savedTo);
}
