"use client";

import { useCallback, useEffect, useRef } from "react";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";
import type { ImageAsset } from "@/lib/properties/types";
import { useGalleryScrollScrub } from "./useGalleryScrollScrub";

const SWIPE_THRESHOLD_PX = 40;

type PropertyGalleryProps = {
  images: ImageAsset[];
};

function ChevronLeftIcon() {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; pointerId: number } | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = images.length;
  const hasMultiple = count > 1;

  const { activeIndex, trackTranslatePercent, setIndex } = useGalleryScrollScrub({
    count,
    enabled: hasMultiple,
    viewportRef,
  });

  const active = activeIndex;
  const current = images[active] ?? images[0];

  const goToIndex = useCallback(
    (index: number) => {
      setIndex(index);
    },
    [setIndex],
  );

  const goNext = useCallback(() => {
    goToIndex(active + 1);
  }, [active, goToIndex]);

  const goPrev = useCallback(() => {
    goToIndex(active - 1);
  }, [active, goToIndex]);

  useEffect(() => {
    const thumb = thumbRefs.current[active];
    thumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!hasMultiple) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipeStart.current = { x: event.clientX, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const finishSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    if (!start || start.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    swipeStart.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX > 0) {
      goPrev();
    } else {
      goNext();
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    finishSwipe(event);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current?.pointerId === event.pointerId) {
      swipeStart.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
  };

  if (!current) {
    return null;
  }

  return (
    <div className="grid gap-5">
      <div
        ref={viewportRef}
        className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)] bg-foreground/5 shadow-[var(--shadow-card)] touch-pan-y"
        role="group"
        aria-roledescription="carrusel"
        aria-label="Galería de fotos de la propiedad"
        tabIndex={hasMultiple ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className="flex h-full will-change-transform motion-reduce:transition-none"
          style={{
            transform: `translate3d(${trackTranslatePercent}%, 0, 0)`,
          }}
          aria-hidden={hasMultiple}
        >
          {hasMultiple
            ? images.map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className="relative h-full min-w-full shrink-0 grow-0 basis-full"
                >
                  <PropertyListingImage
                    src={image.src}
                    alt={index === active ? image.alt : ""}
                    sizes="100vw"
                    className="pointer-events-none"
                  />
                </div>
              ))
            : (
                <div className="relative h-full min-w-full shrink-0 basis-full">
                  <PropertyListingImage
                    src={current.src}
                    alt={current.alt}
                    sizes="100vw"
                    className="pointer-events-none"
                  />
                </div>
              )}
        </div>
        {hasMultiple ? (
          <>
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              Imagen {active + 1} de {count}
            </p>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-4 md:p-5"
              aria-hidden
            >
              <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium tabular-nums text-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm">
                {active + 1} / {count}
              </span>
            </div>
            <button
              type="button"
              className="focus-ring absolute left-3 top-1/2 z-10 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line/60 bg-background/90 text-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm transition-[background-color,transform] duration-300 hover:bg-background md:inline-flex motion-reduce:transition-none"
              onClick={goPrev}
              aria-label="Imagen anterior"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className="focus-ring absolute right-3 top-1/2 z-10 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line/60 bg-background/90 text-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm transition-[background-color,transform] duration-300 hover:bg-background md:inline-flex motion-reduce:transition-none"
              onClick={goNext}
              aria-label="Imagen siguiente"
            >
              <ChevronRightIcon />
            </button>
          </>
        ) : null}
      </div>
      {hasMultiple ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              type="button"
              className={`focus-ring relative h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-md)] border shadow-[var(--shadow-soft)] transition-[transform,opacity,box-shadow] duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none ${
                index === active
                  ? "border-accent/50 opacity-100 ring-2 ring-accent/25"
                  : "border-transparent opacity-75"
              }`}
              onClick={() => goToIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={index === active}
            >
              <PropertyListingImage src={image.src} alt="" sizes="112px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
