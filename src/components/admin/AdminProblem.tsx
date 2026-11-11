import Link from "next/link";

type AdminProblemProps = {
  title: string;
  detail: string;
  code?: string;
  onRetry?: () => void;
};

export function AdminProblem({ title, detail, code, onRetry }: AdminProblemProps) {
  return (
    <div className="max-w-xl space-y-4" role="alert">
      <h1 className="font-display text-4xl text-accent">{title}</h1>
      <p className="text-sm leading-relaxed">{detail}</p>
      {code ? (
        <p className="text-sm text-muted">
          Código para reportar:{" "}
          <span className="font-medium text-foreground">{code}</span>
        </p>
      ) : null}
      <div className="flex flex-wrap gap-4 text-sm">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="text-accent underline underline-offset-2"
          >
            Reintentar
          </button>
        ) : null}
        <Link href="/admin/properties" className="text-accent underline underline-offset-2">
          Volver a inmuebles
        </Link>
        <Link href="/admin/login" className="text-accent underline underline-offset-2">
          Entrar de nuevo
        </Link>
      </div>
    </div>
  );
}
