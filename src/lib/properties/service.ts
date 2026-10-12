import { getPropertiesDataSource } from "@/lib/supabase/env";
import { jsonPropertyRepository } from "./json-repository";
import {
  computeStatsFromProperties,
  fetchAllProperties,
  fetchPropertyById,
  fetchPropertyBySlug,
  filterSupabaseProperties,
} from "./supabase-repository";
import type { Property, PropertyFilter } from "./types";

export async function listProperties(
  filters: PropertyFilter = {},
): Promise<Property[]> {
  if (getPropertiesDataSource() === "supabase") {
    return filterSupabaseProperties(filters);
  }
  return jsonPropertyRepository.filter(filters);
}

export async function getAllProperties(): Promise<Property[]> {
  if (getPropertiesDataSource() === "supabase") {
    return fetchAllProperties();
  }
  return jsonPropertyRepository.getAll();
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | undefined> {
  if (getPropertiesDataSource() === "supabase") {
    return fetchPropertyBySlug(slug);
  }
  return jsonPropertyRepository.getBySlug(slug);
}

export async function getPropertyById(
  id: string,
): Promise<Property | undefined> {
  if (getPropertiesDataSource() === "supabase") {
    return fetchPropertyById(id);
  }
  return jsonPropertyRepository.getById(id);
}

export async function getCatalogStats() {
  if (getPropertiesDataSource() === "supabase") {
    const properties = await fetchAllProperties();
    return computeStatsFromProperties(properties);
  }
  return jsonPropertyRepository.stats();
}

export function getCatalogAgency() {
  return jsonPropertyRepository.agency();
}
