"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PropertyListingImage } from "@/components/media/PropertyListingImage";

export type PropertyMarqueeItem = {
  id: string;
  slug: string;
  name: string;
  price: string | null;
  city?: string;
  image: { src: string; alt: string };
};

type PropertyMarqueeProps = {
  items: PropertyMarqueeItem[];
};

type DragState = {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  horizontal: boolean | null;
  moved: boolean;
};

function wrapOffset(offset: number, loopWidth: number): number {
  if (loopWidth <= 0) {
    return 0;
  }

  let next = offset % loopWidth;
  if (next > 0) {
    next -= loopWidth;
  }
  return next;
}

export function PropertyMarquee({ items }: PropertyMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const hoverPausedRef = useRef(false);
  const inViewRef = useRef(true);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const durationSecRef = useRef(36);
  const reduceMotionRef = useRef(false);

  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node || reduceMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { rootMargin: "80px 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || items.length === 0) {
      return;
    }

    const track = trackRef.current;
    if (!track) {
      return;
    }

    durationSecRef.current = Math.max(36, items.length * 4.5);

    const applyTransform = () => {
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    const measure = () => {
      loopWidthRef.current = track.scrollWidth / 2;
      offsetRef.current = wrapOffset(offsetRef.current, loopWidthRef.current);
      applyTransform();
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    const tick = (timestamp: number) => {
      const last = lastTsRef.current;
      lastTsRef.current = timestamp;
      const loopWidth = loopWidthRef.current;
      const canAutoScroll =
        inViewRef.current && !draggingRef.current && !hoverPausedRef.current && loopWidth > 0;

      if (canAutoScroll && last != null) {
        const deltaSeconds = Math.min(0.064, (timestamp - last) / 1000);
        const pixelsPerSecond = loopWidth / durationSecRef.current;
        offsetRef.current = wrapOffset(
          offsetRef.current - pixelsPerSecond * deltaSeconds,
          loopWidth,
        );
        applyTransform();
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      lastTsRef.current = null;
      resizeObserver.disconnect();
    };
  }, [items.length, reduceMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || reduceMotion) {
      return;
    }

    const detachWindowDragListeners = () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };

    const endDrag = (pointerId: number) => {
      const drag = dragRef.current;
      if (!drag || drag.id !== pointerId) {
        return;
      }

      if (drag.moved) {
        // Suppress only the click synthesized from this gesture, not later taps.
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }

      detachWindowDragListeners();
      dragRef.current = null;
      draggingRef.current = false;
      viewport.classList.remove("property-marquee-viewport--dragging");
      lastTsRef.current = null;
    };

    const onWindowPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.id !== event.pointerId) {
        return;
      }

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (drag.horizontal === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
          return;
        }

        drag.horizontal = Math.abs(dx) > Math.abs(dy);
        if (!drag.horizontal) {
          detachWindowDragListeners();
          dragRef.current = null;
          return;
        }

        draggingRef.current = true;
        viewport.classList.add("property-marquee-viewport--dragging");
        lastTsRef.current = null;
      }

      // Keep vertical page scroll free; touch-action: pan-y handles most cases.
      // Avoid preventDefault on mouse — it can cancel the rest of the gesture.
      if (event.cancelable && event.pointerType === "touch") {
        event.preventDefault();
      }

      const deltaX = event.clientX - drag.lastX;
      drag.lastX = event.clientX;
      if (Math.abs(dx) > 8) {
        drag.moved = true;
      }

      offsetRef.current = wrapOffset(offsetRef.current + deltaX, loopWidthRef.current);
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
    };

    const onWindowPointerUp = (event: PointerEvent) => {
      endDrag(event.pointerId);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduceMotionRef.current) {
        return;
      }
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      dragRef.current = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        horizontal: null,
        moved: false,
      };

      window.addEventListener("pointermove", onWindowPointerMove, { passive: false });
      window.addEventListener("pointerup", onWindowPointerUp);
      window.addEventListener("pointercancel", onWindowPointerUp);
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClickRef.current) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    };

    const onMouseEnter = () => {
      if (window.matchMedia("(hover: hover)").matches) {
        hoverPausedRef.current = true;
      }
    };

    const onMouseLeave = () => {
      hoverPausedRef.current = false;
    };

    const onFocusIn = () => {
      hoverPausedRef.current = true;
    };

    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && viewport.contains(next)) {
        return;
      }
      hoverPausedRef.current = false;
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("mouseenter", onMouseEnter);
    viewport.addEventListener("mouseleave", onMouseLeave);
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("focusout", onFocusOut);

    return () => {
      detachWindowDragListeners();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("mouseenter", onMouseEnter);
      viewport.removeEventListener("mouseleave", onMouseLeave);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("focusout", onFocusOut);
    };
  }, [reduceMotion]);

  if (items.length === 0) {
    return null;
  }

  const sequence = reduceMotion ? items : [...items, ...items];

  return (
    <div
      ref={viewportRef}
      className={`property-marquee-viewport ${reduceMotion ? "property-marquee-viewport--static" : ""}`}
      role="region"
      aria-label="Más propiedades del catálogo"
      aria-roledescription={reduceMotion ? undefined : "carrusel"}
    >
      <ul ref={trackRef} className="property-marquee-track">
        {sequence.map((item, index) => {
          const isDuplicate = !reduceMotion && index >= items.length;
          return (
            <li
              key={isDuplicate ? `${item.id}-dup` : item.id}
              className="property-marquee-item"
              aria-hidden={isDuplicate ? true : undefined}
            >
              <Link
                href={`/properties/${item.slug}`}
                className="property-marquee-link focus-ring group"
                tabIndex={isDuplicate ? -1 : undefined}
                draggable={false}
              >
                <span className="property-marquee-frame">
                  <PropertyListingImage
                    src={item.image.src}
                    alt={isDuplicate ? "" : item.image.alt}
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 280px"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </span>
                <span className="property-marquee-caption">
                  <span className="font-display text-[1.35rem] leading-tight text-white sm:text-[1.5rem]">
                    {item.name}
                  </span>
                  {item.city ? (
                    <span className="type-meta-caps mt-1 text-white/75">{item.city}</span>
                  ) : null}
                  {item.price ? (
                    <span className="type-meta-caps mt-2 text-white/90">{item.price}</span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
