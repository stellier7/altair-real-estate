export const site = {
  name: "Bienes Raíces Altair",
  shortName: "Altair",
  description:
    "Ventas y alquileres de propiedades comerciales, residenciales e industriales en Tegucigalpa y Honduras.",
  tagline: "Experiencia, profesionalismo y ética en bienes raíces.",
  logo: "https://images.wasi.co/empresas/b20190828112855.png",
  phone: "+50422620218",
  mobile: "+50498002237",
  email: "ventas@bienesraicesaltair.com",
  whatsapp: "50498002237",
  address: {
    line1: "Condominios Metropolis, Torre 2, Local 21802",
    city: "Tegucigalpa",
    region: "Francisco Morazán",
    country: "Honduras",
  },
  sourceUrl: "https://bienesraicesaltair.com",
} as const;

export function whatsappHref(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}
