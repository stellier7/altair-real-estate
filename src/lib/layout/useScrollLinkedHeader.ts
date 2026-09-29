"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type ScrollLinkedHeader = {
  headerRef: RefObject<HTMLElement | null>;
  translateY: number;
  isFullyHidden: boolean;
};

export function useScrollLinkedHeader(): ScrollLinkedHeader {
  const headerRef = useRef<HTMLElement | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const [isFullyHidden, setIsFullyHidden] = useState(false);
  const offsetRef = useRef(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      return;
    }

    lastScrollY.current = window.scrollY;

    const applyOffset = (nextOffset: number) => {
      const height = headerRef.current?.offsetHeight ?? 0;
      const clamped =
        height > 0
          ? Math.min(0, Math.max(-height, nextOffset))
          : Math.min(0, nextOffset);

      offsetRef.current = clamped;
      setTranslateY(clamped);
      setIsFullyHidden(height > 0 && clamped <= -height + 1);
    };

    const onScroll = () => {
      if (ticking.current) {
        return;
      }
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY <= 0) {
          applyOffset(0);
        } else {
          applyOffset(offsetRef.current - delta);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    const onResize = () => {
      applyOffset(offsetRef.current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    applyOffset(offsetRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { headerRef, translateY, isFullyHidden };
}
