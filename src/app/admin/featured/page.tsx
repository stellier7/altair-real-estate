import { redirect } from "next/navigation";
import { requireStaffProfile } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteConfig } from "@/content/site/config";
import { saveFeaturedSlugsAction } from "@/lib/admin/property-actions";
import { Button } from "@/components/ui/Button";

export default async function AdminFeaturedPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }
  await requireStaffProfile();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "homeFeaturedPropertySlugs")
    .maybeSingle();

  const slugsFromDb = Array.isArray(data?.value)
    ? (data?.value as string[])
    : null;
  const defaultSlugs =
    slugsFromDb ?? [...siteConfig.homeFeaturedPropertySlugs];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-accent">Destacados del inicio</h1>
        <p className="prose-editorial mt-3">
          Un slug por línea, en el orden en que deben aparecer en la página de inicio. Use los
          slugs completos (incluyen el id), por ejemplo{" "}
          <code className="text-sm">casa-venta-tegucigalpa-10297448</code>.
        </p>
      </div>

      <form action={saveFeaturedSlugsAction} className="space-y-4">
        <textarea
          name="featuredSlugs"
          rows={8}
          defaultValue={defaultSlugs.join("\n")}
          className="w-full rounded-[var(--radius-sm)] border border-line bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
        />
        <Button type="submit">Guardar destacados</Button>
      </form>
    </div>
  );
}
