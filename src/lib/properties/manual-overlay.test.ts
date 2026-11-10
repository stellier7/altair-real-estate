import assert from "node:assert/strict";
import test from "node:test";
import { overlayManualProperties } from "./manual-overlay";
import type { Property } from "./types";

function property(overrides: Partial<Property> & Pick<Property, "id" | "slug" | "name">): Property {
  return {
    propertyType: "house",
    status: "available",
    location: { label: "Tegucigalpa" },
    media: { heroImage: { src: "/hero.jpg", alt: overrides.name } },
    seo: {},
    ...overrides,
  };
}

test("a manual listing replaces the database row that shares its slug", () => {
  const remote = property({
    id: "db-1",
    slug: "renta-casa-lomas-del-guijarro",
    name: "Se Renta Casa en Lomas del Guijarro",
    status: "sold",
    featured: true,
    pricing: { amount: 550000, currency: "USD", display: "USD 550,000" },
  });
  const manual = property({
    id: "190000001",
    slug: "renta-casa-lomas-del-guijarro",
    name: "Se renta casa en Lomas del Guijarro",
    status: "available",
    pricing: { amount: 3000, currency: "USD", display: "US$3,000 USD" },
  });

  const [result] = overlayManualProperties([remote], [manual]);

  assert.equal(result?.id, "190000001");
  assert.equal(result?.status, "available");
  assert.equal(result?.pricing?.amount, 3000);
  assert.equal(result?.featured, true);
  assert.equal(overlayManualProperties([remote], [manual]).length, 1);
});

test("a manual listing is added when the database has no matching row", () => {
  const remote = property({ id: "other", slug: "otra-casa", name: "Otra" });
  const manual = property({
    id: "190000001",
    slug: "renta-casa-lomas-del-guijarro",
    name: "Se renta casa en Lomas del Guijarro",
  });

  const result = overlayManualProperties([remote], [manual]);

  assert.deepEqual(
    result.map((item) => item.slug),
    ["renta-casa-lomas-del-guijarro", "otra-casa"],
  );
});
