"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";
import type { ImageAsset } from "@/lib/properties/types";

const SWIPE_COMMIT_PX = 48;
const EDGE_RESISTANCE = 0.35;

type PropertyGalleryProps = {
  images: ImageAsset[];
};

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
      />
    </svg>
  );
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; id: number; horizontal: boolean | null } | null>(
    null,
  );
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = images.length;
  const hasMultiple = count > 1;
  const current = images[active] ?? images[0];

  const goTo = useCallback(
    (index: number) => setActive(Math.min(Math.max(index, 0), count - 1)),
    [count],
  );

  useEffect(() => {
    thumbRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  if (!current) {
    return null;
  }

  const endDrag = (commit: boolean) => {
    const offset = dragPx;
    drag.current = null;
    setDragging(false);
    setDragPx(0);
    if (!commit || Math.abs(offset) < SWIPE_COMMIT_PX) return;
    goTo(offset < 0 ? active + 1 : active - 1);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, id: event.pointerId, horizontal: null };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (start.horizontal === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      start.horizontal = Math.abs(dx) > Math.abs(dy);
      if (!start.horizontal) {
        drag.current = null;
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }

    const atEdge = (active === 0 && dx > 0) || (active === count - 1 && dx < 0);
    setDragPx(atEdge ? dx * EDGE_RESISTANCE : dx);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    endDrag(true);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    endDrag(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  };

  const controlClass =
    "focus-ring absolute top-1/2 z-10 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line/60 bg-background/90 text-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm transition-[background-color,opacity] duration-300 hover:bg-background disabled:pointer-events-none disabled:opacity-0 md:inline-flex motion-reduce:transition-none";

  return (
    <div className="grid gap-5">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Imagen {active + 1} de {count}: {current.alt}
      </p>
      <div
        className="relative aspect-[16/10] touch-pan-y select-none overflow-hidden rounded-[var(--radius-xl)] bg-foreground/5 shadow-[var(--shadow-card)]"
        role="group"
        aria-roledescription="carrusel"
        aria-label="Galería de fotos de la propiedad"
        tabIndex={hasMultiple ? 0 : undefined}
        onKeyDown={hasMultiple ? handleKeyDown : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={`flex h-full ${
            dragging
              ? ""
              : "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          }`}
          style={{ transform: `translate3d(calc(${-active * 100}% + ${dragPx}px), 0, 0)` }}
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="relative h-full w-full shrink-0"
              aria-hidden={index !== active}
            >
              {Math.abs(index - active) <= 1 ? (
                <PropertyListingImage
                  src={image.src}
                  alt={image.alt}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="pointer-events-none"
                  priority={index === 0}
                />
              ) : null}
            </div>
          ))}
        </div>
        {hasMultiple ? (
          <>
            <span
              className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium tabular-nums text-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm md:bottom-5 md:right-5"
              aria-hidden
            >
              {active + 1} / {count}
            </span>
            <button
              type="button"
              className={`${controlClass} left-3`}
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Imagen anterior"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className={`${controlClass} right-3`}
              onClick={() => goTo(active + 1)}
              disabled={active === count - 1}
              aria-label="Imagen siguiente"
            >
              <Chevron direction="right" />
            </button>
          </>
        ) : null}
      </div>
      {hasMultiple ? (
        <div className="flex gap-3 overflow-x-auto pb-2" role="tablist" aria-label="Galería de fotos">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              className={`focus-ring relative h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-md)] border shadow-[var(--shadow-soft)] transition-[transform,opacity,box-shadow] duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none ${
                index === active
                  ? "border-foreground/25 opacity-100 ring-2 ring-foreground/15"
                  : "border-transparent opacity-75"
              }`}
              onClick={() => goTo(index)}
              aria-label={`Ver imagen ${index + 1} de ${count}`}
              aria-selected={index === active}
            >
              <PropertyListingImage src={image.src} alt="" sizes="112px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
