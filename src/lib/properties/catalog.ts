import type { AltairCatalog } from "./map-altair";
import catalogJson from "@/data/properties.json";

export const altairCatalog = catalogJson as unknown as AltairCatalog;
