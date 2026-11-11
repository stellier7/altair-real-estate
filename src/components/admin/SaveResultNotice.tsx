import type { PropertyFormState } from "@/lib/admin/property-actions";

type SaveResultNoticeProps = {
  state: PropertyFormState;
};

export function SaveResultNotice({ state }: SaveResultNoticeProps) {
  if (state.error) {
    return (
      <div
        role="alert"
        className="rounded-[var(--radius-sm)] border border-red-300/60 bg-red-50 px-3 py-3 text-sm text-red-800"
      >
        <p className="font-medium">No se pudo guardar el inmueble</p>
        <p className="mt-1">{state.error}</p>
        {/sesión/i.test(state.error) ? (
          <a href="/admin/login" className="mt-2 inline-block underline">
            Entrar de nuevo
          </a>
        ) : null}
      </div>
    );
  }

  if (state.savedTo && state.publicPath) {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-sm)] border border-accent/30 bg-accent-soft px-3 py-3 text-sm"
      >
        <p className="font-medium">Se guardó {state.savedName?.trim() || "el inmueble"}.</p>
        <p className="mt-1 text-muted">
          Si el navegador muestra una página en blanco, vuelva a esta pantalla. Abra la
          ficha con estos enlaces.
        </p>
        <p className="mt-2 flex flex-wrap gap-4">
          <a href={state.savedTo} className="text-accent underline">
            Abrir en el panel
          </a>
          <a href={state.publicPath} className="text-accent underline">
            Ver en el sitio
          </a>
        </p>
      </div>
    );
  }

  return null;
}
