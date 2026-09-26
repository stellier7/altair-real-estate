import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-foreground/10 bg-foreground text-background shadow-[0_14px_36px_-14px_rgba(18,17,14,0.55)] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-16px_rgba(18,17,14,0.6)] active:translate-y-0 active:shadow-[0_10px_24px_-12px_rgba(18,17,14,0.45)]",
  secondary:
    "border border-accent/20 bg-accent text-background shadow-[0_14px_34px_-14px_rgba(154,115,79,0.65)] hover:-translate-y-0.5 hover:bg-[#8f6847] hover:shadow-[0_20px_42px_-16px_rgba(154,115,79,0.7)] active:translate-y-0",
  outline:
    "border border-foreground/15 bg-surface/60 text-foreground shadow-[0_10px_28px_-18px_rgba(18,17,14,0.35)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent hover:shadow-[0_16px_36px_-18px_rgba(18,17,14,0.4)] active:translate-y-0",
  ghost:
    "border border-transparent bg-foreground/[0.04] text-foreground shadow-[0_8px_24px_-20px_rgba(18,17,14,0.35)] hover:-translate-y-0.5 hover:bg-foreground/[0.07] hover:shadow-[0_14px_32px_-18px_rgba(18,17,14,0.38)] active:translate-y-0",
};

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition-[transform,box-shadow,background-color,color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none";

type ButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "className">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ComponentProps<"button">;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
