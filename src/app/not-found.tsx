import Link from "next/link";
import { Section } from "@/components/layout/Section";

export default function NotFound() {
  return (
    <Section>
      <h1 className="font-display text-5xl sm:text-6xl">Page not found</h1>
      <p className="prose-editorial mt-6 max-w-xl">
        The page you requested is not available. Explore the property directory or return home.
      </p>
      <div className="mt-8 flex flex-wrap gap-6 text-sm uppercase tracking-[0.18em]">
        <Link href="/" className="focus-ring">Home</Link>
        <Link href="/properties" className="focus-ring">Properties</Link>
      </div>
    </Section>
  );
}
