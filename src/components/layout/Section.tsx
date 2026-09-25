import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  bleed?: boolean;
};

export function Section({ children, className = "", id, bleed }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-[var(--section-y)] ${bleed ? "" : ""} ${className}`}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
