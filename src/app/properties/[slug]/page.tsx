import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyPageComposer } from "@/components/property/PropertyPageComposer";
import { propertyRepository } from "@/lib/properties/repository";
import {
  buildPropertyJsonLd,
  buildPropertyMetadata,
} from "@/lib/seo/metadata";

type PropertyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return propertyRepository.getAll().map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = propertyRepository.getBySlug(slug);
  if (!property) {
    return {};
  }
  return buildPropertyMetadata(property);
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = propertyRepository.getBySlug(slug);

  if (!property) {
    notFound();
  }

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
