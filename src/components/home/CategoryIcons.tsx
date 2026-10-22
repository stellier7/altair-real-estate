import type { HomeCategoryIcon } from "@/content/site/categories";

type CategoryIconProps = {
  name: HomeCategoryIcon;
  className?: string;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CategoryIcon({ name, className = "h-7 w-7" }: CategoryIconProps) {
  switch (name) {
    case "house":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...stroke} d="M5 14.5 16 5l11 9.5" />
          <path {...stroke} d="M8 13.5V26h16V13.5" />
          <path {...stroke} d="M13 26v-7h6v7" />
        </svg>
      );
    case "apartment":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...stroke} d="M7 27V8h10v19" />
          <path {...stroke} d="M17 14h8v13" />
          <path {...stroke} d="M10 12h4M10 16h4M10 20h4M20 18h2M20 22h2" />
          <path {...stroke} d="M5 27h22" />
        </svg>
      );
    case "commercial":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...stroke} d="M6 27V14l10-6 10 6v13" />
          <path {...stroke} d="M12 27v-6h8v6" />
          <path {...stroke} d="M4 27h24" />
          <path {...stroke} d="M11 14h2M19 14h2M15 17h2" />
        </svg>
      );
    case "land":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...stroke} d="M4 22c3-2 6-3 9-2s6 4 9 3 4-2 6-3" />
          <path {...stroke} d="M4 26h24" />
          <path {...stroke} d="M16 18c0-3 2-6 2-8 0-1.5-1-2.5-2-2.5S14 8.5 14 10c0 2 2 5 2 8Z" />
          <path {...stroke} d="M16 18v4" />
        </svg>
      );
    case "office":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...stroke} d="M8 27V7h16v20" />
          <path {...stroke} d="M5 27h22" />
          <path {...stroke} d="M12 11h2M18 11h2M12 15h2M18 15h2M12 19h2M18 19h2" />
          <path {...stroke} d="M14 27v-4h4v4" />
        </svg>
      );
    case "building":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...stroke} d="M10 27V6h12v21" />
          <path {...stroke} d="M6 27h20" />
          <path {...stroke} d="M13 10h2M17 10h2M13 14h2M17 14h2M13 18h2M17 18h2M13 22h2M17 22h2" />
        </svg>
      );
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}
