"use client";

import { useEffect, type ReactNode } from "react";

type PropertyScrollResetProps = {
  slug: string;
  children: ReactNode;
};

export function PropertyScrollReset({ slug, children }: PropertyScrollResetProps) {
  useEffect(() => {
    if (window.location.hash) return;

    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    scrollToTop();
    const frame = requestAnimationFrame(scrollToTop);
    return () => cancelAnimationFrame(frame);
  }, [slug]);

  return children;
}
