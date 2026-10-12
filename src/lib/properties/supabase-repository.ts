import {
  canUseSupabaseAdmin,
  createSupabaseAdminClient,
} from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { matchesPropertyFilter } from "./matches-filter";
import type { Property, PropertyFilter } from "./types";
import { rowToProperty, type PropertyRow } from "./serialize";

async function getReadClient() {
  if (canUseSupabaseAdmin()) {
    return createSupabaseAdminClient();
  }
  return createSupabaseServerClient();
}

export async function fetchAllPropertyRows(
  options?: { includeUnpublished?: boolean },
): Promise<PropertyRow[]> {
  const client = await getReadClient();
  let query = client.from("properties").select("*").order("updated_at", {
    ascending: false,
  });

  if (!options?.includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load properties: ${error.message}`);
  }
  return (data ?? []) as PropertyRow[];
}

export async function fetchAllProperties(
  options?: { includeUnpublished?: boolean },
): Promise<Property[]> {
  const rows = await fetchAllPropertyRows(options);
  return rows.map(rowToProperty);
}

export async function fetchPropertyBySlug(
  slug: string,
  options?: { includeUnpublished?: boolean },
): Promise<Property | undefined> {
  const client = await getReadClient();
  let query = client.from("properties").select("*").eq("slug", slug).limit(1);

  if (!options?.includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    throw new Error(`Failed to load property: ${error.message}`);
  }
  if (!data) return undefined;
  return rowToProperty(data as PropertyRow);
}

export async function fetchPropertyById(
  id: string,
  options?: { includeUnpublished?: boolean },
): Promise<Property | undefined> {
  const client = await getReadClient();
  let query = client.from("properties").select("*").eq("id", id).limit(1);

  if (!options?.includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    throw new Error(`Failed to load property: ${error.message}`);
  }
  if (!data) return undefined;
  return rowToProperty(data as PropertyRow);
}

export async function filterSupabaseProperties(
  filters: PropertyFilter,
  options?: { includeUnpublished?: boolean },
): Promise<Property[]> {
  const all = await fetchAllProperties(options);
  return all.filter((p) => matchesPropertyFilter(p, filters));
}

export function computeStatsFromProperties(properties: Property[]) {
  const forSale = properties.filter((p) => p.tags?.includes("venta")).length;
  const forRent = properties.filter((p) => p.tags?.includes("alquiler")).length;
  return {
    total: properties.length,
    forSale,
    forRent,
  };
}
