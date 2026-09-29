"use client";

import { useEffect, useRef, useState } from "react";

const TOP_REVEAL_PX = 12;
const SCROLL_DELTA_PX = 8;

export function useScrollHeaderVisibility(): boolean {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) {
        return;
      }
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY <= TOP_REVEAL_PX) {
          setVisible(true);
        } else if (delta > SCROLL_DELTA_PX) {
          setVisible(false);
        } else if (delta < -SCROLL_DELTA_PX) {
          setVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
