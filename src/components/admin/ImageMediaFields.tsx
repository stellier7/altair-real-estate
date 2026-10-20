"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  moveItem,
  parseGalleryLines,
  serializeGalleryLines,
} from "@/lib/admin/gallery-order";
import { isHttpImageUrl } from "@/lib/admin/image-url";
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

type GalleryEntry = {
  id: string;
  src: string;
};

const fieldClassName =
  "mt-2 w-full rounded-[var(--radius-sm)] border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent";

const helpClassName = "mt-1.5 text-xs leading-relaxed text-muted";

const iconButtonClassName =
  "focus-ring inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-background text-sm text-accent transition-colors hover:border-accent/50 hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40";

function createGalleryEntry(src: string): GalleryEntry {
  return {
    id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    src,
  };
}

function DragHandleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx="5" cy="3.5" r="1.25" />
      <circle cx="11" cy="3.5" r="1.25" />
      <circle cx="5" cy="8" r="1.25" />
      <circle cx="11" cy="8" r="1.25" />
      <circle cx="5" cy="12.5" r="1.25" />
      <circle cx="11" cy="12.5" r="1.25" />
    </svg>
  );
}

export function ImageMediaFields({
  propertyId,
  initialHeroSrc = "",
  initialHeroAlt = "",
  initialGalleryUrls = "",
  fallbackAlt = "",
}: ImageMediaFieldsProps) {
  const heroFileId = useId();
  const galleryFileId = useId();
  const galleryListId = useId();
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const dragIdRef = useRef<string | null>(null);

  const [heroSrc, setHeroSrc] = useState(initialHeroSrc);
  const [galleryItems, setGalleryItems] = useState<GalleryEntry[]>(() =>
    parseGalleryLines(initialGalleryUrls).map(createGalleryEntry),
  );
  const [galleryUrlDraft, setGalleryUrlDraft] = useState("");
  const [heroStatus, setHeroStatus] = useState<UploadStatus>({ pending: false });
  const [galleryStatus, setGalleryStatus] = useState<UploadStatus>({
    pending: false,
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const uploadFolder = propertyId?.trim() || "draft";
  const galleryUrlsValue = serializeGalleryLines(
    galleryItems.map((item) => item.src),
  );

  const isDirty =
    heroSrc.trim() !== initialHeroSrc.trim() ||
    galleryUrlsValue !== serializeGalleryLines(parseGalleryLines(initialGalleryUrls));

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

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
      setGalleryItems((prev) => {
        const existing = new Set(prev.map((item) => item.src));
        const additions = uploaded
          .filter((src) => !existing.has(src))
          .map(createGalleryEntry);
        return [...prev, ...additions];
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

  function addGalleryUrlFromDraft() {
    const url = galleryUrlDraft.trim();
    if (!url) return;
    if (galleryItems.some((item) => item.src === url)) {
      setGalleryStatus({
        pending: false,
        error: "Esa URL ya está en la galería.",
      });
      return;
    }
    setGalleryItems((prev) => [...prev, createGalleryEntry(url)]);
    setGalleryUrlDraft("");
    setGalleryStatus({
      pending: false,
      success: "URL añadida a la galería.",
    });
  }

  function removeGalleryItem(id: string) {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  }

  function reorderById(id: string, toIndex: number) {
    setGalleryItems((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === id);
      if (fromIndex < 0) return prev;
      return moveItem(prev, fromIndex, toIndex);
    });
  }

  function promoteToHero(id: string) {
    const selected = galleryItems.find((item) => item.id === id);
    if (!selected) return;

    const previousHero = heroSrc.trim();
    setHeroSrc(selected.src);
    setGalleryItems((prev) => {
      let next = prev.filter((item) => item.id !== id);
      if (
        previousHero &&
        isHttpImageUrl(previousHero) &&
        previousHero !== selected.src &&
        !next.some((item) => item.src === previousHero)
      ) {
        next = [createGalleryEntry(previousHero), ...next];
      }
      return next;
    });
    setGalleryStatus({
      pending: false,
      success:
        "Foto establecida como imagen principal. Guarde el inmueble para conservar el cambio.",
    });
  }

  function handleDragStart(event: DragEvent<HTMLLIElement>, id: string) {
    dragIdRef.current = id;
    setDraggingId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }

  function handleDragOver(event: DragEvent<HTMLLIElement>, id: string) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dropTargetId !== id) {
      setDropTargetId(id);
    }
  }

  function handleDrop(event: DragEvent<HTMLLIElement>, targetId: string) {
    event.preventDefault();
    const sourceId =
      event.dataTransfer.getData("text/plain") || dragIdRef.current;
    if (!sourceId) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }
    setGalleryItems((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === sourceId);
      const toIndex = prev.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      return moveItem(prev, fromIndex, toIndex);
    });
    dragIdRef.current = null;
    setDraggingId(null);
    setDropTargetId(null);
  }

  function handleDragEnd() {
    dragIdRef.current = null;
    setDraggingId(null);
    setDropTargetId(null);
  }

  return (
    <section className="grid gap-5">
      <div>
        <label htmlFor="heroImageSrc" className="type-meta-caps text-muted">
          Imagen principal / portada
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
          Esta es la portada del inmueble y la primera foto del carrusel
          público. Pegue un enlace de Wasi u otra URL pública, o suba un
          archivo. No pegue rutas como{" "}
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
        {heroSrc.trim() && isHttpImageUrl(heroSrc) ? (
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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label htmlFor={galleryListId} className="type-meta-caps text-muted">
            Galería (después de la portada)
          </label>
          <p className="text-xs text-muted">
            {galleryItems.length === 0
              ? "Sin fotos aún"
              : `${galleryItems.length} foto${galleryItems.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <p className={helpClassName}>
          Arrastre las fotos por el asa de puntos, o use Subir / Bajar / Inicio /
          Final.
          El nº 1 de esta lista es la <span className="font-medium text-foreground">segunda</span>{" "}
          imagen del carrusel (la portada va primero). Ejemplo: deje baños,
          piletas y patio al final.{" "}
          <span className="font-medium text-foreground">
            Guarde el inmueble para conservar el orden
          </span>
          {isDirty ? " — hay cambios sin guardar." : "."}
        </p>

        <input type="hidden" name="galleryUrls" value={galleryUrlsValue} />

        {galleryItems.length > 0 ? (
          <ul
            id={galleryListId}
            className="mt-3 grid gap-3"
            aria-label="Fotos de la galería"
          >
            {galleryItems.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === galleryItems.length - 1;
              const previewable = isHttpImageUrl(item.src);
              const isDragging = draggingId === item.id;
              const isDropTarget =
                dropTargetId === item.id && draggingId !== item.id;
              return (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(event) => handleDragStart(event, item.id)}
                  onDragOver={(event) => handleDragOver(event, item.id)}
                  onDrop={(event) => handleDrop(event, item.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col gap-3 rounded-[var(--radius-sm)] border bg-surface/50 p-3 transition-[border-color,opacity] sm:flex-row sm:items-center ${
                    isDropTarget
                      ? "border-accent"
                      : "border-line"
                  } ${isDragging ? "opacity-50" : ""}`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                      className="inline-flex size-9 shrink-0 cursor-grab items-center justify-center rounded-[var(--radius-sm)] border border-line bg-background text-muted active:cursor-grabbing"
                      title="Arrastrar para reordenar"
                      aria-hidden
                    >
                      <DragHandleIcon />
                    </span>
                    <span className="type-meta-caps w-8 shrink-0 text-muted">
                      {index + 1}
                    </span>
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-background">
                      {previewable ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.src}
                          alt=""
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center px-1 text-center text-[10px] text-red-800">
                          URL inválida
                        </span>
                      )}
                    </div>
                    <p className="min-w-0 flex-1 break-all text-xs text-muted">
                      {item.src}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                    <button
                      type="button"
                      className={`${iconButtonClassName} min-w-[4.5rem] px-2 text-[10px] uppercase tracking-[0.12em]`}
                      aria-label={`Usar foto ${index + 1} como imagen principal`}
                      onClick={() => promoteToHero(item.id)}
                      title="Usar como portada"
                    >
                      Portada
                    </button>
                    <button
                      type="button"
                      className={iconButtonClassName}
                      aria-label={`Subir foto ${index + 1}`}
                      disabled={isFirst}
                      onClick={() => reorderById(item.id, index - 1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={iconButtonClassName}
                      aria-label={`Bajar foto ${index + 1}`}
                      disabled={isLast}
                      onClick={() => reorderById(item.id, index + 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={iconButtonClassName}
                      aria-label={`Mover foto ${index + 1} al inicio`}
                      disabled={isFirst}
                      onClick={() => reorderById(item.id, 0)}
                      title="Al inicio"
                    >
                      ⇈
                    </button>
                    <button
                      type="button"
                      className={iconButtonClassName}
                      aria-label={`Mover foto ${index + 1} al final`}
                      disabled={isLast}
                      onClick={() =>
                        reorderById(item.id, galleryItems.length - 1)
                      }
                      title="Al final"
                    >
                      ⇊
                    </button>
                    <button
                      type="button"
                      className={`${iconButtonClassName} text-red-800 hover:border-red-300/70 hover:bg-red-50`}
                      aria-label={`Quitar foto ${index + 1}`}
                      onClick={() => removeGalleryItem(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 rounded-[var(--radius-sm)] border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
            Aún no hay fotos en la galería. Suba archivos o pegue una URL.
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label
              htmlFor="galleryUrlDraft"
              className="type-meta-caps text-muted"
            >
              Añadir URL a la galería
            </label>
            <input
              id="galleryUrlDraft"
              type="url"
              value={galleryUrlDraft}
              onChange={(e) => setGalleryUrlDraft(e.target.value)}
              placeholder="https://…"
              className={fieldClassName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addGalleryUrlFromDraft();
                }
              }}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            className="px-5 py-2.5"
            disabled={!galleryUrlDraft.trim()}
            onClick={addGalleryUrlFromDraft}
          >
            Añadir URL
          </Button>
        </div>

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
            {galleryStatus.pending ? "Subiendo…" : "Subir desde el equipo"}
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
