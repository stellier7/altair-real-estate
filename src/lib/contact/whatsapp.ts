import { siteConfig } from "@/content/site/config";

export function buildWhatsAppUrl(message?: string): string {
  const text = message ?? siteConfig.whatsapp.defaultMessage;
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${siteConfig.whatsapp.e164}?text=${encoded}`;
}

export function buildPropertyWhatsAppUrl(propertyName: string): string {
  return buildWhatsAppUrl(
    `Hello, I would like more information about ${propertyName}.`,
  );
}
