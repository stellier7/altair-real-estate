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
        Message us on WhatsApp for viewings, availability, and off-market introductions.
        We typically respond during business hours.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-accent"
      >
        Chat on WhatsApp
        <span className="text-muted normal-case tracking-normal">
          {siteConfig.whatsapp.display}
        </span>
      </a>
    </div>
  );
}
