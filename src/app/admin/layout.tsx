import Link from "next/link";
import { getOptionalStaffProfile } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configured = isSupabaseConfigured();
  const profile = configured ? await getOptionalStaffProfile() : null;

  return (
    <div className="min-h-screen bg-[color-mix(in_srgb,var(--surface)_70%,white)] text-foreground">
      <header className="border-b border-line bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="type-meta-caps text-accent">Altair</p>
            <Link href="/admin" className="font-display text-2xl text-foreground">
              Panel de administración
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            {profile ? (
              <>
                <Link
                  href="/admin/properties"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Inmuebles
                </Link>
                <Link
                  href="/admin/featured"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Destacados
                </Link>
                <Link
                  href="/admin/backup"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Respaldo
                </Link>
                <Link
                  href="/"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Ver sitio
                </Link>
                <span className="hidden text-muted sm:inline">
                  {profile.email} · {profile.role === "owner" ? "Propietario" : "Asistente"}
                </span>
                <AdminSignOutButton />
              </>
            ) : (
              <Link href="/" className="text-muted transition-colors hover:text-accent">
                Volver al sitio
              </Link>
            )}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
    </div>
  );
}
