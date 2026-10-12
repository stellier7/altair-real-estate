import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaffProfile } from "@/lib/admin/auth";
import { canDeleteProperties } from "@/lib/admin/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import { Button } from "@/components/ui/Button";
import { rowToProperty, type PropertyRow } from "@/lib/properties/serialize";

type SearchParams = Promise<{ q?: string }>;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }

  const profile = await requireStaffProfile();
  const { q } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("properties")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (q?.trim()) {
    query = query.or(
      `name.ilike.%${q.trim()}%,slug.ilike.%${q.trim()}%,id.eq.${q.trim()}`,
    );
  }

  const { data, error } = await query;
  if (error) {
    return (
      <p className="text-red-800">
        No se pudo cargar el catálogo: {error.message}. ¿Ya ejecutó la migración y el seed?
      </p>
    );
  }

  const rows = (data ?? []) as PropertyRow[];
  const allowDelete = canDeleteProperties(profile.role);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-accent">Inmuebles</h1>
          <p className="mt-2 text-sm text-muted">
            {rows.length} resultados{q ? ` para “${q}”` : ""} (máx. 200 por página de búsqueda)
          </p>
        </div>
        <Button href="/admin/properties/new">Nuevo</Button>
      </div>

      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nombre, slug o id"
          className="min-w-[16rem] flex-1 rounded-[var(--radius-sm)] border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </form>

      <div className="overflow-x-auto border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-background/80 type-meta-caps text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Nombre</th>
              <th className="px-3 py-3 font-medium">Estado</th>
              <th className="px-3 py-3 font-medium">Pub.</th>
              <th className="px-3 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const property = rowToProperty(row);
              return (
                <tr key={row.id} className="border-b border-line/70">
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/properties/${row.id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {property.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{property.slug}</p>
                  </td>
                  <td className="px-3 py-3 text-muted">{property.status}</td>
                  <td className="px-3 py-3 text-muted">
                    {row.published ? "Sí" : "No"}
                    {row.featured ? " · ★" : ""}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/properties/${row.id}`}
                        className="text-accent underline-offset-2 hover:underline"
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/properties/${property.slug}`}
                        className="text-muted underline-offset-2 hover:underline"
                      >
                        Ver
                      </Link>
                      {allowDelete ? (
                        <DeletePropertyButton
                          id={property.id}
                          slug={property.slug}
                          name={property.name}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
