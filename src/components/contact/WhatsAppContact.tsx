import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { siteConfig } from "@/content/site/config";
import { Button } from "@/components/ui/Button";

type WhatsAppContactProps = {
  heading?: string;
  message?: string;
};

export function WhatsAppContact({ heading, message }: WhatsAppContactProps) {
  const url = buildWhatsAppUrl(message);

  return (
    <div className="border-t border-line pt-8">
      {heading ? (
        <h2 className="font-display text-2xl sm:text-3xl">{heading}</h2>
      ) : null}
      <p className="prose-editorial mt-4">
        Escríbanos por WhatsApp para visitas, disponibilidad y asesoría personalizada. Respondemos
        en horario de oficina.
      </p>
      <Button href={url} variant="secondary" className="mt-8" target="_blank" rel="noopener noreferrer">
        WhatsApp · {siteConfig.whatsapp.display}
      </Button>
    </div>
  );
}
