"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { propertyCopy } from "@/lib/i18n/property-copy";

type PropertyShareButtonProps = {
  url: string;
  title: string;
  text?: string;
};

export function PropertyShareButton({
  url,
  title,
  text,
}: PropertyShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  function scheduleReset() {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }
    resetTimer.current = setTimeout(() => {
      setStatus("idle");
      resetTimer.current = null;
    }, 2200);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      scheduleReset();
    } catch {
      setStatus("failed");
      scheduleReset();
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        // Fall through to clipboard when share is unavailable or fails.
      }
    }

    await copyLink();
  }

  const label =
    status === "copied"
      ? propertyCopy.shareCopied
      : status === "failed"
        ? propertyCopy.shareFailed
        : propertyCopy.share;

  return (
    <Button type="button" variant="outline" onClick={handleShare}>
      {label}
    </Button>
  );
}
