import { AdminProblem } from "@/components/admin/AdminProblem";

export default function AdminNotFound() {
  return (
    <AdminProblem
      title="No se encontró el inmueble"
      detail="Ese enlace no abre una ficha guardada. Vuelva al listado y ábralo desde ahí. El número interno que empieza por p- no es la dirección pública."
    />
  );
}
