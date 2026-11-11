"use client";

import { AdminProblem } from "@/components/admin/AdminProblem";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  const hidden =
    /omitted in production|server components render/i.test(error.message);
  const detail = hidden
    ? "El panel no pudo completar esta acción. Recargue la página o vuelva al listado. Si el navegador mostró una página en blanco, copie el código de abajo."
    : error.message || "El panel no pudo completar esta acción.";

  return (
    <AdminProblem
      title="No se pudo completar la acción"
      detail={detail}
      code={error.digest}
      onRetry={reset}
    />
  );
}
