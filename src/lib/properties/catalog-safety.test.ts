import assert from "node:assert/strict";
import test from "node:test";
import { isUnavailableListing } from "../../components/property/PropertyStatusOverlay";
import { getDisplayPrice } from "./specs";
import type { Property } from "./types";

function propertyWith(overrides: Partial<Property>): Property {
  return {
    id: "p-test",
    slug: "p-test",
    name: "Prueba",
    propertyType: "house",
    status: "available",
    location: { label: "Tegucigalpa" },
    media: {
      heroImage: {
        src: "https://image.wasi.co/example",
        alt: "Prueba",
      },
    },
    seo: {},
    ...overrides,
  };
}

test("an unrecognized listing status does not crash the catalog card", () => {
  assert.equal(isUnavailableListing("vendido" as Property["status"]), false);
  assert.equal(isUnavailableListing(undefined as unknown as Property["status"]), false);
  assert.equal(isUnavailableListing("available"), false);
  assert.equal(isUnavailableListing("sold"), true);
});

test("a non-ISO currency does not crash price formatting", () => {
  const price = getDisplayPrice(
    propertyWith({
      pricing: { amount: 1500, currency: "Lempiras" },
    }),
  );

  assert.equal(typeof price, "string");
  assert.match(price ?? "", /1[,.]?500|1500/);

  const usd = getDisplayPrice(
    propertyWith({
      pricing: { amount: 250000, currency: "USD" },
    }),
  );
  assert.match(usd ?? "", /250[,.]?000|250000/);
});
