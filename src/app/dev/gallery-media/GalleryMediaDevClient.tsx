"use client";

import { ImageMediaFields } from "@/components/admin/ImageMediaFields";
import { Button } from "@/components/ui/Button";

type GalleryMediaDevClientProps = {
  propertyId: string;
  initialHeroSrc: string;
  initialHeroAlt: string;
  initialGalleryUrls: string;
  fallbackAlt: string;
};

/**
 * Wraps ImageMediaFields in a no-op form so the admin media controls match
 * the property editor chrome without calling savePropertyAction.
 */
export function GalleryMediaDevClient(props: GalleryMediaDevClientProps) {
  return (
    <form
      className="space-y-8 rounded-[var(--radius-sm)] border border-line bg-background/80 p-5 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const hero = String(data.get("heroImageSrc") ?? "");
        const gallery = String(data.get("galleryUrls") ?? "")
          .split("\n")
          .filter(Boolean);
        window.alert(
          `Orden listo para guardar (demo):\n\nPortada:\n${hero}\n\nGalería (${gallery.length}):\n${gallery.map((url, i) => `${i + 1}. ${url.slice(0, 64)}…`).join("\n")}`,
        );
      }}
    >
      <ImageMediaFields {...props} />
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <Button type="submit">Guardar inmueble (demo)</Button>
        <p className="text-xs text-muted">
          En el panel real este botón escribe en Supabase. Aquí solo muestra el
          orden resultante.
        </p>
      </div>
    </form>
  );
}
