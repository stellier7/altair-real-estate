"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const SNAP_EASE = 0.16;
const WHEEL_STEP_THRESHOLD = 72;
const WHEEL_GESTURE_RESET_MS = 140;

type UseGallerySnapCarouselOptions = {
  count: number;
  enabled: boolean;
  viewportRef: RefObject<HTMLElement | null>;
};

function clampIndex(value: number, count: number): number {
  if (count <= 1) return 0;
  return Math.min(Math.max(value, 0), count - 1);
}

function normalizeIndex(index: number, count: number): number {
  if (count === 0) return 0;
  return ((index % count) + count) % count;
}

export function useGallerySnapCarousel({
  count,
  enabled,
  viewportRef,
}: UseGallerySnapCarouselOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visualIndex, setVisualIndex] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);

  const targetIndexRef = useRef(0);
  const visualIndexRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const pointerInsideRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const syncVisual = useCallback((value: number) => {
    visualIndexRef.current = value;
    setVisualIndex(value);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    rafRef.current = null;
    if (!enabled || count <= 1) return;

    const target = targetIndexRef.current;
    const current = visualIndexRef.current;
    const delta = target - current;

    if (reducedMotionRef.current || Math.abs(delta) < 0.0008) {
      syncVisual(target);
    } else {
      syncVisual(current + delta * SNAP_EASE);
    }

    const stillAnimating =
      !reducedMotionRef.current && Math.abs(target - visualIndexRef.current) > 0.0008;

    if (stillAnimating) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [count, enabled, syncVisual]);

  const ensureLoop = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const commitTargetIndex = useCallback(
    (index: number) => {
      if (count <= 1) return;
      const next = clampIndex(normalizeIndex(index, count), count);
      targetIndexRef.current = next;
      setActiveIndex(next);
      if (reducedMotionRef.current) {
        syncVisual(next);
      } else {
        ensureLoop();
      }
    },
    [count, ensureLoop, syncVisual],
  );

  const setIndex = useCallback(
    (index: number) => {
      dragOffsetRef.current = 0;
      setDragOffsetPx(0);
      commitTargetIndex(index);
    },
    [commitTargetIndex],
  );

  const setDragOffset = useCallback((offsetPx: number) => {
    dragOffsetRef.current = offsetPx;
    setDragOffsetPx(offsetPx);
  }, []);

  const commitDrag = useCallback(
    (viewportWidth: number) => {
      if (count <= 1 || viewportWidth <= 0) {
        dragOffsetRef.current = 0;
        setDragOffsetPx(0);
        return;
      }

      const slideDelta = -dragOffsetRef.current / viewportWidth;
      const projected = clampIndex(
        Math.round(visualIndexRef.current + slideDelta),
        count,
      );

      dragOffsetRef.current = 0;
      setDragOffsetPx(0);
      commitTargetIndex(projected);
    },
    [commitTargetIndex, count],
  );

  const applyWheelDelta = useCallback(
    (delta: number) => {
      if (count <= 1 || Math.abs(delta) < 0.5) return;

      const now = performance.now();
      if (now - lastWheelAtRef.current > WHEEL_GESTURE_RESET_MS) {
        wheelAccumulatorRef.current = 0;
      }
      lastWheelAtRef.current = now;

      if (reducedMotionRef.current) {
        const step = delta > 0 ? 1 : -1;
        commitTargetIndex(targetIndexRef.current + step);
        return;
      }

      wheelAccumulatorRef.current += delta;
      while (Math.abs(wheelAccumulatorRef.current) >= WHEEL_STEP_THRESHOLD) {
        const step = wheelAccumulatorRef.current > 0 ? 1 : -1;
        wheelAccumulatorRef.current -= step * WHEEL_STEP_THRESHOLD;
        commitTargetIndex(targetIndexRef.current + step);
      }
    },
    [commitTargetIndex, count],
  );

  useEffect(() => {
    targetIndexRef.current = 0;
    visualIndexRef.current = 0;
    dragOffsetRef.current = 0;
    wheelAccumulatorRef.current = 0;
    setActiveIndex(0);
    setVisualIndex(0);
    setDragOffsetPx(0);
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

    const onPointerEnter = () => {
      pointerInsideRef.current = true;
    };
    const onPointerLeave = () => {
      pointerInsideRef.current = false;
    };

    node.addEventListener("pointerenter", onPointerEnter);
    node.addEventListener("pointerleave", onPointerLeave);

    return () => {
      node.removeEventListener("pointerenter", onPointerEnter);
      node.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [count, enabled, viewportRef]);

  useEffect(() => {
    if (!enabled || count <= 1) return;

    const node = viewportRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      const canScroll =
        pointerInsideRef.current ||
        (node.contains(document.activeElement) && document.activeElement !== document.body);

      if (!canScroll) return;

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
    count <= 1 ? 0 : (-visualIndex / count) * 100;

  return {
    activeIndex,
    trackTranslatePercent,
    dragOffsetPx,
    setIndex,
    setDragOffset,
    commitDrag,
  };
}
