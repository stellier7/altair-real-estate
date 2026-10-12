"use client";

import { deletePropertyAction } from "@/lib/admin/property-actions";

type DeletePropertyButtonProps = {
  id: string;
  slug: string;
  name: string;
};

export function DeletePropertyButton({ id, slug, name }: DeletePropertyButtonProps) {
  return (
    <form
      action={deletePropertyAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `¿Eliminar permanentemente “${name}”? Esta acción no se puede deshacer desde el panel.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="rounded-full border border-red-300/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-red-800 transition-colors hover:bg-red-50"
      >
        Eliminar
      </button>
    </form>
  );
}
