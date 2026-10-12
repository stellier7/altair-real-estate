"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent/40 hover:text-accent"
    >
      Salir
    </button>
  );
}
