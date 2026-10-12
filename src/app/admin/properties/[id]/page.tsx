import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireStaffProfile } from "@/lib/admin/auth";
import { canDeleteProperties } from "@/lib/admin/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PropertyEditorForm } from "@/components/admin/PropertyEditorForm";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import { rowToProperty, type PropertyRow } from "@/lib/properties/serialize";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditPropertyPage({ params }: PageProps) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }

  const profile = await requireStaffProfile();
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const row = data as PropertyRow;
  const property = rowToProperty(row);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="type-meta-caps text-muted">Editar</p>
          <h1 className="font-display text-4xl text-accent">{property.name}</h1>
          <p className="mt-2 text-sm text-muted">
            <Link
              href={`/properties/${property.slug}`}
              className="text-accent underline-offset-2 hover:underline"
            >
              Ver en el sitio
            </Link>
            {" · "}
            id {property.id}
          </p>
        </div>
        {canDeleteProperties(profile.role) ? (
          <DeletePropertyButton
            id={property.id}
            slug={property.slug}
            name={property.name}
          />
        ) : null}
      </div>
      <PropertyEditorForm property={property} published={row.published} />
    </div>
  );
}
