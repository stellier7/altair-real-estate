import { redirect } from "next/navigation";
import { requireStaffProfile } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PropertyEditorForm } from "@/components/admin/PropertyEditorForm";

export default async function AdminNewPropertyPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }
  await requireStaffProfile();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-accent">Nuevo inmueble</h1>
        <p className="mt-2 text-sm text-muted">
          Complete los datos. Puede dejar el slug vacío para generarlo automáticamente.
        </p>
      </div>
      <PropertyEditorForm />
    </div>
  );
}
