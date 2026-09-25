import Link from "next/link";
import type { ComponentProps } from "react";

type TextLinkProps = ComponentProps<typeof Link>;

export function TextLink({ className = "", ...props }: TextLinkProps) {
  return (
    <Link
      className={`focus-ring inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent ${className}`}
      {...props}
    />
  );
}
