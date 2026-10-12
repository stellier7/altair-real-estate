import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaffProfile } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getPropertiesDataSource } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";

export default async function AdminHomePage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }

  const profile = await requireStaffProfile();
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  const { count: draftCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("published", false);

  const dataSource = getPropertiesDataSource();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl text-accent">Hola{profile.fullName ? `, ${profile.fullName}` : ""}</h1>
        <p className="prose-editorial mt-3 max-w-2xl">
          Gestione el catálogo de Bienes Raíces Altair: alta, edición, estado, destacados y
          respaldos. El sitio público sigue leyendo JSON hasta que active{" "}
          <code className="text-sm">PROPERTIES_DATA_SOURCE=supabase</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-line bg-background/70 p-5">
          <p className="type-meta-caps text-muted">Inmuebles en base</p>
          <p className="mt-2 font-display text-4xl text-accent">{count ?? 0}</p>
        </div>
        <div className="border border-line bg-background/70 p-5">
          <p className="type-meta-caps text-muted">Borradores</p>
          <p className="mt-2 font-display text-4xl text-accent">{draftCount ?? 0}</p>
        </div>
        <div className="border border-line bg-background/70 p-5">
          <p className="type-meta-caps text-muted">Fuente del sitio</p>
          <p className="mt-2 font-display text-3xl text-accent">
            {dataSource === "supabase" ? "Base de datos" : "JSON local"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button href="/admin/properties">Ver inmuebles</Button>
        <Button href="/admin/properties/new" variant="secondary">
          Nuevo inmueble
        </Button>
        <Button href="/admin/featured" variant="outline">
          Destacados home
        </Button>
        <Button href="/admin/backup" variant="ghost">
          Descargar respaldo
        </Button>
      </div>

      <p className="text-sm text-muted">
        Rol: {profile.role === "owner" ? "Propietario (puede eliminar)" : "Asistente (editar sin eliminar)"}.{" "}
        <Link href="/admin/setup" className="text-accent underline-offset-2 hover:underline">
          Guía de configuración
        </Link>
      </p>
    </div>
  );
}
