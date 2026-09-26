import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section>
      <h1 className="font-display text-5xl sm:text-6xl">Página no encontrada</h1>
      <p className="prose-editorial mt-6 max-w-xl">
        La página que busca no existe. Explore el catálogo de propiedades o regrese al inicio.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/">Inicio</Button>
        <Button href="/properties" variant="outline">Propiedades</Button>
      </div>
    </Section>
  );
}
