import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background shadow-[0_12px_40px_-12px_rgba(20,19,16,0.45)] hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-14px_rgba(20,19,16,0.5)] active:translate-y-0",
  secondary:
    "bg-accent text-background shadow-[0_10px_32px_-12px_rgba(138,106,75,0.55)] hover:-translate-y-0.5 hover:bg-[#7a5d42] active:translate-y-0",
  outline:
    "border border-foreground/20 bg-transparent text-foreground hover:border-accent hover:text-accent",
  ghost:
    "bg-transparent text-foreground hover:bg-foreground/5",
};

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-[transform,box-shadow,background-color,color,border-color] duration-300 motion-reduce:transform-none motion-reduce:transition-none";

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
