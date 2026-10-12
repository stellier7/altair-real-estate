/**
 * Sync JSON facade kept for compatibility.
 * Prefer async helpers in `./service` for new code — they honor PROPERTIES_DATA_SOURCE.
 */
import { jsonPropertyRepository } from "./json-repository";
import type { Property, PropertyFilter } from "./types";

export interface PropertyRepository {
  getAll(): Property[];
  getBySlug(slug: string): Property | undefined;
  getById(id: string): Property | undefined;
  filter(filters: PropertyFilter): Property[];
}

export const propertyRepository: PropertyRepository = jsonPropertyRepository;

export function catalogStats() {
  return jsonPropertyRepository.stats();
}

export function catalogAgency() {
  return jsonPropertyRepository.agency();
}
