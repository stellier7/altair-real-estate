import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getOptionalStaffProfile } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function AdminLoginPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }

  const profile = await getOptionalStaffProfile();
  if (profile) {
    redirect("/admin");
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display text-4xl text-accent">Iniciar sesión</h1>
        <p className="prose-editorial mx-auto mt-3 max-w-md">
          Acceso para el propietario y su asistente. Las cuentas se crean en Supabase Auth.
        </p>
      </div>
      <AdminLoginForm />
    </div>
  );
}
