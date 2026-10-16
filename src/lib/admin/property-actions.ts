"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaffProfile } from "@/lib/admin/auth";
import { buildPropertyFromForm } from "@/lib/admin/build-property-from-form";
import { validatePropertyImageUrls } from "@/lib/admin/image-url";
import { canDeleteProperties } from "@/lib/admin/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/properties/types";
import { propertyToRow } from "@/lib/properties/serialize";

export type PropertyFormState = {
  error?: string;
  success?: string;
};

async function writeAudit(
  action: string,
  entityId: string,
  detail?: Record<string, unknown>,
) {
  const profile = await requireStaffProfile();
  const supabase = await createSupabaseServerClient();
  await supabase.from("audit_log").insert({
    actor_id: profile.id,
    action,
    entity_type: "property",
    entity_id: entityId,
    detail: detail ?? null,
  });
}

function revalidatePropertyPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath(`/properties/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
}

export async function savePropertyAction(
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const profile = await requireStaffProfile();
  const existingId = (formData.get("id") as string)?.trim();
  const supabase = await createSupabaseServerClient();

  let existing: Property | undefined;
  if (existingId) {
    const { data } = await supabase
      .from("properties")
      .select("data")
      .eq("id", existingId)
      .maybeSingle();
    existing = data?.data as Property | undefined;
  }

  const heroRaw = ((formData.get("heroImageSrc") as string) || "").trim();
  const galleryRaw = ((formData.get("galleryUrls") as string) || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const imageError = validatePropertyImageUrls(heroRaw, galleryRaw);
  if (imageError) {
    return { error: imageError };
  }

  const property = buildPropertyFromForm(formData, existing);
  const published = formData.get("published") === "on";
  const row = {
    ...propertyToRow(property, { published }),
    updated_by: profile.id,
  };

  const { error } = await supabase.from("properties").upsert(row, {
    onConflict: "id",
  });

  if (error) {
    return { error: error.message };
  }

  await writeAudit(existingId ? "update" : "create", property.id, {
    slug: property.slug,
  });
  revalidatePropertyPaths(property.slug);
  redirect(`/admin/properties/${property.id}`);
}

export async function deletePropertyAction(formData: FormData): Promise<void> {
  const profile = await requireStaffProfile();
  if (!canDeleteProperties(profile.role)) {
    throw new Error("Solo el propietario puede eliminar inmuebles.");
  }

  const id = (formData.get("id") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || "";
  if (!id) {
    throw new Error("Falta el id del inmueble.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  await writeAudit("delete", id, { slug });
  revalidatePropertyPaths(slug);
  redirect("/admin/properties");
}

export async function saveFeaturedSlugsAction(formData: FormData): Promise<void> {
  const profile = await requireStaffProfile();
  const raw = (formData.get("featuredSlugs") as string) || "";
  const slugs = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("site_settings").upsert({
    key: "homeFeaturedPropertySlugs",
    value: slugs,
    updated_by: profile.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  const all = await supabase.from("properties").select("id, slug, featured");
  if (all.data) {
    for (const row of all.data) {
      const shouldFeature = slugs.includes(row.slug as string);
      if (Boolean(row.featured) !== shouldFeature) {
        await supabase
          .from("properties")
          .update({ featured: shouldFeature })
          .eq("id", row.id);
      }
    }
  }

  await writeAudit("update_featured", "site_settings", { slugs });
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=featured");
}
