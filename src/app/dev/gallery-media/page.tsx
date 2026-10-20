import { notFound } from "next/navigation";
import catalog from "@/data/properties.json";
import { GalleryMediaDevClient } from "./GalleryMediaDevClient";

/**
 * Development-only playground for the admin gallery reorder UI.
 * Uses real catalog images so editors can try drag, buttons, and “Portada”
 * without Supabase auth. Hidden in production builds.
 */
export default function GalleryMediaDevPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const sample =
    catalog.properties.find((property) => (property.images?.length ?? 0) >= 5) ??
    catalog.properties[0];

  if (!sample?.images?.length) {
    notFound();
  }

  const heroSrc = sample.coverImage || sample.images[0];
  const galleryUrls = sample.images
    .filter((src) => src !== heroSrc)
    .slice(0, 5)
    .join("\n");

  return (
    <div className="min-h-screen bg-[color-mix(in_srgb,var(--surface)_70%,white)] text-foreground">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <p className="type-meta-caps text-accent">Solo desarrollo</p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            Reordenar fotos de la galería
          </h1>
          <p className="prose-editorial max-w-2xl text-sm">
            Vista previa del editor de medios con fotos reales del catálogo
            ({sample.title}). En producción esto vive en el panel al editar un
            inmueble; aquí puede practicar sin iniciar sesión.
          </p>
        </header>
        <GalleryMediaDevClient
          propertyId={sample.id}
          initialHeroSrc={heroSrc}
          initialHeroAlt={sample.title}
          initialGalleryUrls={galleryUrls}
          fallbackAlt={sample.title}
        />
      </div>
    </div>
  );
}
