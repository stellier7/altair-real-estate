"use client";

import { useActionState } from "react";
import {
  savePropertyAction,
  type PropertyFormState,
} from "@/lib/admin/property-actions";
import type { Property } from "@/lib/properties/types";
import { getListingMode } from "@/lib/properties/specs";
import { Button } from "@/components/ui/Button";
import { ImageMediaFields } from "@/components/admin/ImageMediaFields";

const PROPERTY_TYPES = [
  "residential",
  "apartment",
  "villa",
  "house",
  "condominium",
  "commercial",
  "office",
  "retail",
  "hotel",
  "development",
  "land",
  "lot",
  "industrial",
  "investment",
] as const;

const STATUSES = [
  "available",
  "reserved",
  "sold",
  "under_development",
  "coming_soon",
  "off_market",
] as const;

type PropertyEditorFormProps = {
  property?: Property;
  published?: boolean;
};

const initialState: PropertyFormState = {};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  as = "input",
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const className =
    "mt-2 w-full rounded-[var(--radius-sm)] border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent";
  return (
    <div>
      <label htmlFor={name} className="type-meta-caps text-muted">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows ?? 4}
          defaultValue={defaultValue ?? ""}
          required={required}
          className={className}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          required={required}
          className={className}
        />
      )}
    </div>
  );
}

export function PropertyEditorForm({
  property,
  published = true,
}: PropertyEditorFormProps) {
  const [state, action, pending] = useActionState(savePropertyAction, initialState);
  const listing = getListingMode(property?.tags);
  const galleryUrls = (property?.media.gallery ?? [])
    .map((img) => img.src)
    .join("\n");
  const extraTags = (property?.tags ?? [])
    .filter((t) => t !== "venta" && t !== "alquiler")
    .join(", ");

  return (
    <form action={action} className="space-y-8">
      {property ? <input type="hidden" name="id" value={property.id} /> : null}

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre / título" name="name" defaultValue={property?.name} required />
        <Field label="Slug (URL)" name="slug" defaultValue={property?.slug} />
        <div>
          <label htmlFor="propertyType" className="type-meta-caps text-muted">
            Tipo
          </label>
          <select
            id="propertyType"
            name="propertyType"
            defaultValue={property?.propertyType ?? "house"}
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="type-meta-caps text-muted">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={property?.status ?? "available"}
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="listing" className="type-meta-caps text-muted">
            Operación
          </label>
          <select
            id="listing"
            name="listing"
            defaultValue={listing}
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option value="sale">Venta</option>
            <option value="rent">Alquiler</option>
            <option value="both">Venta y alquiler</option>
          </select>
        </div>
        <Field label="Etiquetas extra (coma)" name="tags" defaultValue={extraTags} />
      </section>

      <section className="grid gap-5">
        <Field
          label="Descripción corta"
          name="shortDescription"
          defaultValue={property?.shortDescription}
          as="textarea"
          rows={2}
        />
        <Field
          label="Descripción"
          name="description"
          defaultValue={property?.description}
          as="textarea"
          rows={8}
        />
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Ciudad" name="city" defaultValue={property?.location.city} />
        <Field label="Departamento / región" name="region" defaultValue={property?.location.region} />
        <Field label="País" name="country" defaultValue={property?.location.country ?? "Honduras"} />
        <Field label="Dirección" name="address" defaultValue={property?.location.address} />
        <Field
          label="Etiqueta de ubicación"
          name="locationLabel"
          defaultValue={property?.location.label}
        />
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Precio (texto)"
          name="priceDisplay"
          defaultValue={property?.pricing?.display}
        />
        <Field
          label="Monto numérico"
          name="priceAmount"
          type="number"
          defaultValue={property?.pricing?.amount}
        />
        <Field
          label="Moneda"
          name="currency"
          defaultValue={property?.pricing?.currency ?? "USD"}
        />
        <label className="flex items-end gap-2 pb-3 text-sm">
          <input
            type="checkbox"
            name="priceOnRequest"
            defaultChecked={property?.pricing?.priceOnRequest}
            className="size-4 accent-[var(--accent)]"
          />
          Precio a consultar
        </label>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <Field label="Habitaciones" name="bedrooms" type="number" defaultValue={property?.residential?.bedrooms} />
        <Field label="Baños" name="bathrooms" type="number" defaultValue={property?.residential?.bathrooms} />
        <Field label="Parqueos" name="parking" type="number" defaultValue={property?.residential?.parking} />
        <Field label="Área total m²" name="totalArea" type="number" defaultValue={property?.residential?.totalArea} />
        <Field label="Lote m²" name="lotSize" type="number" defaultValue={property?.residential?.lotSize} />
        <Field label="Año" name="yearBuilt" type="number" defaultValue={property?.residential?.yearBuilt} />
      </section>

      <ImageMediaFields
        propertyId={property?.id}
        initialHeroSrc={property?.media.heroImage.src}
        initialHeroAlt={property?.media.heroImage.alt ?? property?.name}
        initialGalleryUrls={galleryUrls}
        fallbackAlt={property?.name}
      />

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="SEO título" name="seoTitle" defaultValue={property?.seo.title} />
        <Field
          label="SEO descripción"
          name="seoDescription"
          defaultValue={property?.seo.description}
          as="textarea"
          rows={2}
        />
      </section>

      <section className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={property?.featured}
            className="size-4 accent-[var(--accent)]"
          />
          Destacado
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            value="on"
            defaultChecked={published}
            className="size-4 accent-[var(--accent)]"
          />
          Publicado en el sitio
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="noIndex"
            defaultChecked={property?.seo.noIndex}
            className="size-4 accent-[var(--accent)]"
          />
          No indexar (SEO)
        </label>
      </section>

      {state.error ? (
        <p className="rounded-[var(--radius-sm)] border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : property ? "Guardar cambios" : "Crear inmueble"}
      </Button>
    </form>
  );
}
