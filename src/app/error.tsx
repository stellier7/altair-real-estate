"use client";

import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

type SiteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SiteError({ error, reset }: SiteErrorProps) {
  return (
    <Section>
      <h1 className="font-display text-5xl sm:text-6xl">No se pudo abrir esta página</h1>
      <p className="prose-editorial mt-6 max-w-xl">
        Hubo un fallo al cargar el contenido. Puede reintentar o volver al catálogo.
      </p>
      {error.digest ? (
        <p className="mt-4 text-sm text-muted">Código para reportar: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button type="button" onClick={reset}>
          Reintentar
        </Button>
        <Button href="/properties" variant="outline">
          Propiedades
        </Button>
      </div>
    </Section>
  );
}
