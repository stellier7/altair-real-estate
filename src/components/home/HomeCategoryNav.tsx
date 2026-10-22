import Link from "next/link";
import { CategoryIcon } from "@/components/home/CategoryIcons";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { homeCategories } from "@/content/site/categories";

export function HomeCategoryNav() {
  return (
    <Section id="categorias" className="!pt-0 sm:!pt-2">
      <RevealOnScroll className="mb-8 max-w-2xl">
        <p className="type-meta-caps text-accent">Explorar</p>
        <h2 className="type-display-section mt-3 text-accent">Navega por categorías</h2>
      </RevealOnScroll>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {homeCategories.map((category, index) => (
          <li key={category.href + category.label}>
            <RevealOnScroll delayMs={index * 50}>
              <Link
                href={category.href}
                className="category-tile focus-ring group flex min-h-[7.5rem] flex-col items-center justify-center gap-3 px-3 py-5 text-center text-accent transition-[transform,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent-soft hover:text-accent-hover motion-reduce:transform-none"
              >
                <CategoryIcon
                  name={category.icon}
                  className="h-7 w-7 transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none"
                />
                <span className="type-meta-caps leading-snug">{category.label}</span>
              </Link>
            </RevealOnScroll>
          </li>
        ))}
      </ul>
    </Section>
  );
}
