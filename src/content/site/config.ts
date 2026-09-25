import { altairCatalog } from "@/lib/properties/catalog";

const agency = altairCatalog.agency;

export const siteConfig = {
  name: "Bienes Raíces Altair",
  tagline: "Experiencia, profesionalismo y ética en bienes raíces",
  description: agency.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultOgImage: agency.logo,
  logo: agency.logo,
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
  sourceWebsite: agency.sourceWebsite,
} as const;
