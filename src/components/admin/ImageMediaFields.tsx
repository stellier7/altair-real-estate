"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
import { uploadPropertyImage } from "@/lib/admin/upload-property-image";
import { Button } from "@/components/ui/Button";

type ImageMediaFieldsProps = {
  propertyId?: string;
  initialHeroSrc?: string;
  initialHeroAlt?: string;
  initialGalleryUrls?: string;
  fallbackAlt?: string;
};

type UploadStatus = {
  pending: boolean;
  error?: string;
  success?: string;
};

const fieldClassName =
  "mt-2 w-full rounded-[var(--radius-sm)] border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent";

const helpClassName = "mt-1.5 text-xs leading-relaxed text-muted";

export function ImageMediaFields({
  propertyId,
  initialHeroSrc = "",
  initialHeroAlt = "",
  initialGalleryUrls = "",
  fallbackAlt = "",
}: ImageMediaFieldsProps) {
  const heroFileId = useId();
  const galleryFileId = useId();
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [heroSrc, setHeroSrc] = useState(initialHeroSrc);
  const [galleryUrls, setGalleryUrls] = useState(initialGalleryUrls);
  const [heroStatus, setHeroStatus] = useState<UploadStatus>({ pending: false });
  const [galleryStatus, setGalleryStatus] = useState<UploadStatus>({
    pending: false,
  });

  const uploadFolder = propertyId?.trim() || "draft";

  async function handleHeroFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setHeroStatus({ pending: true });
    try {
      const url = await uploadPropertyImage(file, uploadFolder);
      setHeroSrc(url);
      setHeroStatus({ pending: false, success: "Imagen principal subida." });
    } catch (err) {
      setHeroStatus({
        pending: false,
        error: err instanceof Error ? err.message : "Error al subir la imagen.",
      });
    }
  }

  async function handleGalleryFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setGalleryStatus({ pending: true });
    const uploaded: string[] = [];
    const failures: string[] = [];

    for (const file of files) {
      try {
        uploaded.push(await uploadPropertyImage(file, uploadFolder));
      } catch (err) {
        failures.push(
          err instanceof Error ? err.message : `Error al subir ${file.name}.`,
        );
      }
    }

    if (uploaded.length > 0) {
      setGalleryUrls((prev) => {
        const existing = prev.trim();
        const block = uploaded.join("\n");
        return existing ? `${existing}\n${block}` : block;
      });
    }

    if (failures.length > 0 && uploaded.length === 0) {
      setGalleryStatus({ pending: false, error: failures[0] });
      return;
    }

    if (failures.length > 0) {
      setGalleryStatus({
        pending: false,
        success: `${uploaded.length} imagen(es) añadidas.`,
        error: `Algunas fallaron: ${failures[0]}`,
      });
      return;
    }

    setGalleryStatus({
      pending: false,
      success:
        uploaded.length === 1
          ? "1 imagen añadida a la galería."
          : `${uploaded.length} imágenes añadidas a la galería.`,
    });
  }

  return (
    <section className="grid gap-5">
      <div>
        <label htmlFor="heroImageSrc" className="type-meta-caps text-muted">
          Imagen principal (URL)
        </label>
        <input
          id="heroImageSrc"
          name="heroImageSrc"
          type="url"
          required
          value={heroSrc}
          onChange={(e) => setHeroSrc(e.target.value)}
          placeholder="https://…"
          className={fieldClassName}
        />
        <p className={helpClassName}>
          Pegue un enlace de Wasi u otra URL pública, o use el botón para subir
          desde su computadora. No pegue rutas como{" "}
          <span className="font-medium text-foreground">C:\Users\…</span>.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={heroInputRef}
            id={heroFileId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleHeroFileChange}
          />
          <Button
            type="button"
            variant="outline"
            className="px-5 py-2.5"
            disabled={heroStatus.pending}
            onClick={() => heroInputRef.current?.click()}
          >
            {heroStatus.pending ? "Subiendo…" : "Subir desde el equipo"}
          </Button>
          {heroStatus.error ? (
            <p className="text-sm text-red-800" role="alert">
              {heroStatus.error}
            </p>
          ) : null}
          {heroStatus.success && !heroStatus.error ? (
            <p className="text-sm text-accent" role="status">
              {heroStatus.success}
            </p>
          ) : null}
        </div>
        {heroSrc.trim() && /^https?:\/\//i.test(heroSrc.trim()) ? (
          <div className="mt-4 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface/60">
            {/* Admin preview: remote hosts vary (Wasi + Supabase); next/image domains are incomplete here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroSrc.trim()}
              alt=""
              className="mx-auto max-h-48 w-full object-contain"
            />
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="heroImageAlt" className="type-meta-caps text-muted">
          Alt de imagen
        </label>
        <input
          id="heroImageAlt"
          name="heroImageAlt"
          type="text"
          defaultValue={initialHeroAlt || fallbackAlt}
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="galleryUrls" className="type-meta-caps text-muted">
          Galería (una URL por línea)
        </label>
        <textarea
          id="galleryUrls"
          name="galleryUrls"
          rows={5}
          value={galleryUrls}
          onChange={(e) => setGalleryUrls(e.target.value)}
          placeholder={"https://…\nhttps://…"}
          className={fieldClassName}
        />
        <p className={helpClassName}>
          Una URL por línea, o suba varias fotos desde su computadora. Las
          subidas se añaden al final de la lista.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={galleryInputRef}
            id={galleryFileId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="sr-only"
            onChange={handleGalleryFilesChange}
          />
          <Button
            type="button"
            variant="outline"
            className="px-5 py-2.5"
            disabled={galleryStatus.pending}
            onClick={() => galleryInputRef.current?.click()}
          >
            {galleryStatus.pending
              ? "Subiendo…"
              : "Subir desde el equipo"}
          </Button>
          {galleryStatus.error ? (
            <p className="text-sm text-red-800" role="alert">
              {galleryStatus.error}
            </p>
          ) : null}
          {galleryStatus.success && !galleryStatus.error ? (
            <p className="text-sm text-accent" role="status">
              {galleryStatus.success}
            </p>
          ) : null}
          {galleryStatus.success && galleryStatus.error ? (
            <p className="text-sm text-muted" role="status">
              {galleryStatus.success} {galleryStatus.error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
