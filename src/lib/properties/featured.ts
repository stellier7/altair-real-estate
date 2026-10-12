import { siteConfig } from "@/content/site/config";
import { getPropertiesDataSource } from "@/lib/supabase/env";
import { canUseSupabaseAdmin, createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getHomeFeaturedSlugs(): Promise<string[]> {
  if (getPropertiesDataSource() !== "supabase") {
    return [...siteConfig.homeFeaturedPropertySlugs];
  }

  try {
    const client = canUseSupabaseAdmin()
      ? createSupabaseAdminClient()
      : await createSupabaseServerClient();

    const { data, error } = await client
      .from("site_settings")
      .select("value")
      .eq("key", "homeFeaturedPropertySlugs")
      .maybeSingle();

    if (error || !data || !Array.isArray(data.value)) {
      return [...siteConfig.homeFeaturedPropertySlugs];
    }

    return (data.value as unknown[]).filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    );
  } catch {
    return [...siteConfig.homeFeaturedPropertySlugs];
  }
}
