"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const WHEEL_POSITION_SENSITIVITY = 0.0025;
const MOMENTUM_FRICTION = 0.92;
const SNAP_EASE = 0.14;
const IDLE_MS_BEFORE_DRIFT = 2800;
const DRIFT_VELOCITY = 0.00035;
const IN_VIEW_RATIO = 0.35;

type UseGalleryScrollScrubOptions = {
  count: number;
  enabled: boolean;
  viewportRef: RefObject<HTMLElement | null>;
};

function clampPosition(value: number, count: number): number {
  if (count <= 1) return 0;
  return Math.min(Math.max(value, 0), count - 1);
}

function normalizeIndex(index: number, count: number): number {
  if (count === 0) return 0;
  return ((index % count) + count) % count;
}

export function useGalleryScrollScrub({
  count,
  enabled,
  viewportRef,
}: UseGalleryScrollScrubOptions) {
  const [position, setPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastWheelAtRef = useRef(0);
  const pointerInsideRef = useRef(false);
  const inViewRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const syncActiveFromPosition = useCallback(
    (value: number) => {
      const next = normalizeIndex(Math.round(value), count);
      setActiveIndex((prev) => (prev === next ? prev : next));
    },
    [count],
  );

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    rafRef.current = null;
    if (!enabled || count <= 1) return;

    const reduced = reducedMotionRef.current;
    const now = performance.now();
    const idle =
      now - lastWheelAtRef.current > IDLE_MS_BEFORE_DRIFT &&
      Math.abs(velocityRef.current) < 0.00001;

    if (!reduced && idle && inViewRef.current) {
      velocityRef.current += DRIFT_VELOCITY;
    }

    if (!reduced) {
      velocityRef.current *= MOMENTUM_FRICTION;
      targetRef.current = clampPosition(
        targetRef.current + velocityRef.current,
        count,
      );
      if (targetRef.current <= 0 || targetRef.current >= count - 1) {
        velocityRef.current *= 0.55;
      }
    }

    const delta = targetRef.current - positionRef.current;
    if (reduced) {
      positionRef.current = targetRef.current;
    } else if (Math.abs(delta) < 0.0004 && Math.abs(velocityRef.current) < 0.00005) {
      positionRef.current = targetRef.current;
    } else {
      positionRef.current += delta * SNAP_EASE;
    }

    setPosition(positionRef.current);
    syncActiveFromPosition(positionRef.current);

    const stillMoving =
      !reduced &&
      (Math.abs(targetRef.current - positionRef.current) > 0.0005 ||
        Math.abs(velocityRef.current) > 0.00005);

    if (stillMoving || (!reduced && idle && inViewRef.current)) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [count, enabled, syncActiveFromPosition]);

  const ensureLoop = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const applyWheelDelta = useCallback(
    (delta: number) => {
      if (count <= 1 || Math.abs(delta) < 0.5) return;

      lastWheelAtRef.current = performance.now();
      const reduced = reducedMotionRef.current;

      if (reduced) {
        const step = delta > 0 ? 1 : -1;
        const next = clampPosition(targetRef.current + step, count);
        targetRef.current = next;
        positionRef.current = next;
        velocityRef.current = 0;
        setPosition(next);
        setActiveIndex(next);
        return;
      }

      const impulse = delta * WHEEL_POSITION_SENSITIVITY;
      targetRef.current = clampPosition(targetRef.current + impulse, count);
      velocityRef.current += impulse * 0.85;

      if (targetRef.current <= 0 || targetRef.current >= count - 1) {
        velocityRef.current *= 0.35;
      }

      ensureLoop();
    },
    [count, ensureLoop],
  );

  const setIndex = useCallback(
    (index: number) => {
      if (count <= 1) return;
      const next = clampPosition(normalizeIndex(index, count), count);
      targetRef.current = next;
      positionRef.current = reducedMotionRef.current ? next : positionRef.current;
      velocityRef.current = 0;
      lastWheelAtRef.current = performance.now();
      setPosition(reducedMotionRef.current ? next : positionRef.current);
      setActiveIndex(next);
      ensureLoop();
    },
    [count, ensureLoop],
  );

  useEffect(() => {
    positionRef.current = 0;
    targetRef.current = 0;
    velocityRef.current = 0;
    setPosition(0);
    setActiveIndex(0);
  }, [count]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = media.matches;
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || count <= 1) return;

    const node = viewportRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current =
          entry.isIntersecting && entry.intersectionRatio >= IN_VIEW_RATIO;
        if (inViewRef.current) {
          ensureLoop();
        }
      },
      { threshold: [0, IN_VIEW_RATIO, 0.6, 1] },
    );
    observer.observe(node);

    const onPointerEnter = () => {
      pointerInsideRef.current = true;
    };
    const onPointerLeave = () => {
      pointerInsideRef.current = false;
    };

    node.addEventListener("pointerenter", onPointerEnter);
    node.addEventListener("pointerleave", onPointerLeave);

    return () => {
      observer.disconnect();
      node.removeEventListener("pointerenter", onPointerEnter);
      node.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [count, enabled, ensureLoop, viewportRef]);

  useEffect(() => {
    if (!enabled || count <= 1) return;

    const node = viewportRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      const canScrub =
        pointerInsideRef.current ||
        (inViewRef.current && node.contains(document.activeElement));

      if (!canScrub) return;

      event.preventDefault();
      applyWheelDelta(event.deltaY);
    };

    node.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", onWheel);
    };
  }, [applyWheelDelta, count, enabled, viewportRef]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  const trackTranslatePercent =
    count <= 1 ? 0 : (-position / count) * 100;

  return {
    activeIndex,
    trackTranslatePercent,
    setIndex,
  };
}
