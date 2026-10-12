import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { StaffProfile, StaffRole } from "./types";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: StaffRole;
};

function mapProfile(row: ProfileRow): StaffProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
  };
}

export async function getOptionalStaffProfile(): Promise<StaffProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProfile(data as ProfileRow);
}

export async function requireStaffProfile(): Promise<StaffProfile> {
  const profile = await getOptionalStaffProfile();
  if (!profile) {
    redirect("/admin/login");
  }
  return profile;
}
