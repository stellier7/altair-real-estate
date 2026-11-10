import { getPropertiesDataSource } from "@/lib/supabase/env";
import { findManualListing, listManualListings } from "./catalog";
import { jsonPropertyRepository } from "./json-repository";
import { matchesPropertyFilter } from "./matches-filter";
import { overlayManualProperties } from "./manual-overlay";
import { resolvePropertyRequest } from "./resolve-request";
import {
  computeStatsFromProperties,
  fetchAllProperties,
  fetchPropertyById,
  fetchPropertyBySlug,
  filterSupabaseProperties,
} from "./supabase-repository";
import type { Property, PropertyFilter } from "./types";

function manualProperties(): Property[] {
  return listManualListings().map((entry) => entry.property);
}

function withManualProperties(properties: Property[]): Property[] {
  return overlayManualProperties(properties, manualProperties());
}

export async function listProperties(
  filters: PropertyFilter = {},
): Promise<Property[]> {
  if (getPropertiesDataSource() === "supabase") {
    const remote = await filterSupabaseProperties(filters);
    return withManualProperties(remote).filter((property) =>
      matchesPropertyFilter(property, filters),
    );
  }
  return withManualProperties(jsonPropertyRepository.filter(filters)).filter(
    (property) => matchesPropertyFilter(property, filters),
  );
}

export async function getAllProperties(): Promise<Property[]> {
  if (getPropertiesDataSource() === "supabase") {
    return withManualProperties(await fetchAllProperties());
  }
  return withManualProperties(jsonPropertyRepository.getAll());
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | undefined> {
  const manual = findManualListing(slug);
  if (manual) {
    return manual.property;
  }
  if (getPropertiesDataSource() === "supabase") {
    return fetchPropertyBySlug(slug);
  }
  return jsonPropertyRepository.getBySlug(slug);
}

export async function getPropertyById(
  id: string,
): Promise<Property | undefined> {
  const manual = manualProperties().find((property) => property.id === id);
  if (manual) {
    return manual;
  }
  if (getPropertiesDataSource() === "supabase") {
    return fetchPropertyById(id);
  }
  return jsonPropertyRepository.getById(id);
}

export async function resolveRequestedProperty(requested: string) {
  const bySlug = await getPropertyBySlug(requested);
  const byId = bySlug ? undefined : await getPropertyById(requested);
  return resolvePropertyRequest(requested, bySlug, byId);
}

export async function getCatalogStats() {
  if (getPropertiesDataSource() === "supabase") {
    return computeStatsFromProperties(await getAllProperties());
  }
  return computeStatsFromProperties(withManualProperties(jsonPropertyRepository.getAll()));
}

export function getCatalogAgency() {
  return jsonPropertyRepository.agency();
}
