export type HomeCategoryIcon =
  | "house"
  | "apartment"
  | "commercial"
  | "land"
  | "office"
  | "building";

export type HomeCategory = {
  label: string;
  icon: HomeCategoryIcon;
  href: string;
};

export const homeCategories: HomeCategory[] = [
  {
    label: "Casa",
    icon: "house",
    href: "/properties?type=house",
  },
  {
    label: "Apartamento",
    icon: "apartment",
    href: "/properties?type=apartment",
  },
  {
    label: "Comercial",
    icon: "commercial",
    href: "/properties?type=commercial",
  },
  {
    label: "Terreno",
    icon: "land",
    href: "/properties?type=land",
  },
  {
    label: "Oficina",
    icon: "office",
    href: "/properties?type=office",
  },
  {
    label: "Edificio",
    icon: "building",
    // Catalog maps “Edificio” into commercial; search keeps the intent clear.
    href: "/properties?q=edificio",
  },
];
