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
  overlayClassName = "bg-gradient-to-t from-background via-background/45 to-background/15",
  minHeightClass = "min-h-[88vh]",
}: ParallaxMediaProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const targetOffset = useRef(0);
  const currentOffset = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [renderOffset, setRenderOffset] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);

    const tick = () => {
      const delta = targetOffset.current - currentOffset.current;
      if (Math.abs(delta) > 0.15) {
        currentOffset.current += delta * 0.12;
        setRenderOffset(currentOffset.current);
      } else if (currentOffset.current !== targetOffset.current) {
        currentOffset.current = targetOffset.current;
        setRenderOffset(currentOffset.current);
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || reduceMotion) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const scrollProgress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport + rect.height)),
      );
      targetOffset.current = (scrollProgress - 0.5) * 72;
    };

    frameRef.current = requestAnimationFrame(tick);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className={`hero-shell relative overflow-hidden ${minHeightClass} ${className}`}
    >
      <div
        className="absolute inset-[-4%] will-change-transform motion-reduce:transform-none"
        style={{
          transform: reduceMotion
            ? undefined
            : `translate3d(0, ${renderOffset}px, 0) scale(1.06)`,
        }}
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
