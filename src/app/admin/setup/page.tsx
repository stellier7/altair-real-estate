import Link from "next/link";
import { isSupabaseConfigured, getPropertiesDataSource } from "@/lib/supabase/env";

export default function AdminSetupPage() {
  const configured = isSupabaseConfigured();
  const source = getPropertiesDataSource();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-accent">Configuración del panel</h1>
        <p className="prose-editorial mt-4">
          Sus listados actuales están seguros: el catálogo vive en{" "}
          <code className="text-sm">src/data/properties.json</code> y hay una copia congelada en{" "}
          <code className="text-sm">backups/catalog-2026-10-12/</code>. El sitio público no cambia
          hasta que usted active la base de datos.
        </p>
      </div>

      <ol className="list-decimal space-y-4 pl-5 text-sm leading-relaxed text-foreground">
        <li>
          Cree un proyecto gratis en{" "}
          <a
            href="https://supabase.com"
            className="text-accent underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            supabase.com
          </a>
          .
        </li>
        <li>
          En el SQL Editor, ejecute el archivo{" "}
          <code>supabase/migrations/001_admin_cms.sql</code>.
        </li>
        <li>
          En Authentication → Users, cree dos usuarios (propietario y asistente) con correo y
          contraseña.
        </li>
        <li>
          En Table Editor → <code>profiles</code>, inserte una fila por usuario con{" "}
          <code>role = owner</code> o <code>assistant</code> (use el mismo <code>id</code> que Auth).
        </li>
        <li>
          Copie las variables de entorno (ver <code>docs/ADMIN.md</code>) en Vercel /{" "}
          <code>.env.local</code>.
        </li>
        <li>
          Ejecute <code>npm run seed:supabase</code> para importar el catálogo respaldado.
        </li>
        <li>
          Cuando esté listo para que el sitio lea la base:{" "}
          <code>PROPERTIES_DATA_SOURCE=supabase</code>.
        </li>
      </ol>

      <div className="border border-line bg-background/70 p-5 text-sm">
        <p>
          Supabase configurado:{" "}
          <strong>{configured ? "sí" : "aún no (faltan variables)"}</strong>
        </p>
        <p className="mt-2">
          Fuente del sitio público ahora: <strong>{source}</strong>
        </p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {configured ? (
          <Link href="/admin/login" className="text-accent underline-offset-2 hover:underline">
            Ir a iniciar sesión
          </Link>
        ) : null}
        <Link href="/" className="text-muted underline-offset-2 hover:underline">
          Volver al sitio
        </Link>
      </div>
      <p className="text-sm text-muted">
        Documentación completa: <code>docs/ADMIN.md</code> y <code>docs/DATA-SAFETY.md</code> en el
        repositorio.
      </p>
    </div>
  );
}
