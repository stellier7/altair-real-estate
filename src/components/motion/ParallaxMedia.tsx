"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ParallaxMediaProps = {
  src: string;
  alt: string;
  priority?: boolean;
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
  minHeightClass?: string;
};

export function ParallaxMedia({
  src,
  alt,
  priority,
  children,
  className = "",
  overlayClassName = "bg-gradient-to-t from-background via-background/40 to-background/20",
  minHeightClass = "min-h-[88vh]",
}: ParallaxMediaProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || reduceMotion) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
      setOffset(progress * 48);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${minHeightClass} ${className}`}
    >
      <div
        className="absolute inset-0 will-change-transform motion-reduce:transform-none"
        style={{ transform: reduceMotion ? undefined : `translate3d(0, ${offset}px, 0) scale(1.08)` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className={`absolute inset-0 ${overlayClassName}`} />
      {children}
    </section>
  );
}
