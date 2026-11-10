import assert from "node:assert/strict";
import test from "node:test";
import type { Property } from "./types";
import { rowToProperty, type PropertyRow } from "./serialize";

test("a property row with empty data still opens in the editor", () => {
  const row = {
    id: "p-1794256301039",
    slug: "renta-casa-lomas-del-guijarro",
    name: "Se Renta Casa en Lomas del Guijarro",
    status: "sold",
    property_type: "house",
    featured: false,
    published: true,
    data: null,
  } as unknown as PropertyRow;

  const property = rowToProperty(row);

  assert.equal(property.id, "p-1794256301039");
  assert.equal(property.slug, "renta-casa-lomas-del-guijarro");
  assert.equal(property.name, "Se Renta Casa en Lomas del Guijarro");
  assert.equal(typeof property.location.label, "string");
  assert.equal(typeof property.media.heroImage.src, "string");
  assert.equal(typeof property.seo.title, "string");
});

test("an id in the public URL resolves to the listing slug", async () => {
  const { resolvePropertyRequest } = await import("./resolve-request");
  const property = {
    id: "p-1794256301039",
    slug: "renta-casa-lomas-del-guijarro",
    name: "Se Renta Casa en Lomas del Guijarro",
  } as Property;

  const resolved = resolvePropertyRequest("p-1794256301039", undefined, property);

  assert.equal(resolved?.property.slug, "renta-casa-lomas-del-guijarro");
  assert.equal(
    resolved?.redirectTo,
    "/properties/renta-casa-lomas-del-guijarro",
  );
  assert.equal(
    resolvePropertyRequest("renta-casa-lomas-del-guijarro", property, undefined)
      ?.redirectTo,
    undefined,
  );
});
