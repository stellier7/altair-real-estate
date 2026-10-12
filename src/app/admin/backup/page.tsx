import { redirect } from "next/navigation";
import { requireStaffProfile } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Button } from "@/components/ui/Button";

export default async function AdminBackupPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }
  await requireStaffProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-accent">Respaldo</h1>
        <p className="prose-editorial mt-3">
          Descargue un JSON con todos los inmuebles de la base de datos. Guárdelo en un lugar
          seguro (correo, Drive, o otra carpeta en el repo). El catálogo original también está
          congelado en <code className="text-sm">backups/catalog-2026-10-12/</code>.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button href="/api/admin/export-properties">Descargar catálogo (JSON)</Button>
        <Button href="/api/admin/export-properties?source=json-backup" variant="secondary">
          Descargar respaldo congelado
        </Button>
      </div>

      <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
        <li>El sitio público no borra el JSON local al activar Supabase.</li>
        <li>Puede volver a importar un export con el script de seed (modo upsert).</li>
        <li>Solo personal autenticado puede descargar estos archivos.</li>
      </ul>
    </div>
  );
}
