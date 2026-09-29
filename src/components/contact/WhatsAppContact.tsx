import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { siteConfig } from "@/content/site/config";

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
      <p className="type-meta mt-6">
        Use el botón flotante de WhatsApp o{" "}
        <a
          href={url}
          className="focus-ring font-medium text-foreground underline decoration-line underline-offset-4 transition-colors hover:decoration-foreground/50"
          target="_blank"
          rel="noopener noreferrer"
        >
          abrir chat · {siteConfig.whatsapp.display}
        </a>
        .
      </p>
    </div>
  );
}
