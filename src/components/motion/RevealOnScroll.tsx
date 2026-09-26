"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "section" | "article";
};

export function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
  as = "div",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}
