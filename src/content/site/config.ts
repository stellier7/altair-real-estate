import { altairCatalog } from "@/lib/properties/catalog";

const agency = altairCatalog.agency;

export const siteConfig = {
  name: "Bienes Raíces Altair",
  heroImage: "/images/site/hero-home.jpg",
  tagline: "Experiencia, profesionalismo y ética en bienes raíces",
  description: agency.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultOgImage: "/images/site/logo-altair.png",
  logo: "/images/site/logo-altair.png",
  contactEmail: agency.email,
  phone: agency.phone,
  mobile: agency.mobile,
  whatsapp: {
    display: agency.mobile,
    e164: agency.whatsapp.replace(/\D/g, ""),
    defaultMessage:
      "Hola, me gustaría recibir información sobre sus propiedades.",
  },
  offices: [
    {
      city: agency.address.city,
      address: `${agency.address.street}, ${agency.address.region}, ${agency.address.country}`,
      phone: agency.phone,
    },
  ],
  nav: [
    { label: "Propiedades", href: "/properties" },
    { label: "Nosotros", href: "/about" },
    { label: "Servicios", href: "/services" },
    { label: "Contacto", href: "/contact" },
  ],
  /** Homepage “Inmuebles destacados” — explicit order (slug includes id suffix). */
  homeFeaturedPropertySlugs: [
    "casa-venta-tegucigalpa-10297448",
    "casa-alquiler-tegucigalpa-10291033",
    "terreno-venta-tegucigalpa-10440769",
  ],
  sourceWebsite: agency.sourceWebsite,
} as const;
