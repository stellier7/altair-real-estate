import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-accent/25 bg-accent text-background shadow-[0_14px_36px_-14px_rgba(101,80,160,0.45)] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_20px_44px_-16px_rgba(101,80,160,0.55)] active:translate-y-0 active:shadow-[0_10px_24px_-12px_rgba(101,80,160,0.4)]",
  secondary:
    "border border-accent/30 bg-surface/85 text-accent shadow-[0_10px_28px_-18px_rgba(34,24,48,0.32)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent-soft hover:shadow-[0_16px_36px_-18px_rgba(101,80,160,0.28)] active:translate-y-0",
  outline:
    "border border-accent/45 bg-surface/75 text-accent shadow-[0_10px_28px_-18px_rgba(34,24,48,0.3)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-accent/70 hover:bg-accent-soft hover:shadow-[0_16px_36px_-18px_rgba(101,80,160,0.3)] active:translate-y-0",
  ghost:
    "border border-transparent bg-accent/[0.08] text-accent shadow-[0_8px_24px_-20px_rgba(34,24,48,0.28)] hover:-translate-y-0.5 hover:bg-accent/[0.14] hover:shadow-[0_14px_32px_-18px_rgba(101,80,160,0.28)] active:translate-y-0",
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
