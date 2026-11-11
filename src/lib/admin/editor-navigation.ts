export function propertyEditorPath(id: string): string {
  return `/admin/properties/${encodeURIComponent(id)}`;
}
