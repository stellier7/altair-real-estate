import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PropertyPageComposer } from "@/components/property/PropertyPageComposer";
import {
  getAllProperties,
  resolveRequestedProperty,
} from "@/lib/properties/service";
import {
  buildPropertyJsonLd,
  buildPropertyMetadata,
} from "@/lib/seo/metadata";

type PropertyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const properties = await getAllProperties();
  return properties.map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveRequestedProperty(slug);
  if (!resolved) {
    return {};
  }
  return buildPropertyMetadata(resolved.property);
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const resolved = await resolveRequestedProperty(slug);

  if (!resolved) {
    notFound();
  }

  if (resolved.redirectTo) {
    permanentRedirect(resolved.redirectTo);
  }

  const property = resolved.property;

  const jsonLd = buildPropertyJsonLd(property);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyPageComposer property={property} />
    </>
  );
}
