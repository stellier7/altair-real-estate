import assert from "node:assert/strict";
import test from "node:test";
import { editorPriceFields, pricingFromParts } from "./pricing";
import { getDisplayPrice } from "./specs";
import type { Property } from "./types";

test("sale and rent amounts become one public price line", () => {
  const pricing = pricingFromParts({
    sale: { amount: 5200000, currency: "HNL" },
    rent: { amount: 1400, currency: "USD" },
    priceOnRequest: false,
  });

  assert.equal(pricing.display, "Venta L.5,200,000 · Renta $1,400");
  assert.equal(
    getDisplayPrice({
      id: "p",
      slug: "p",
      name: "Torre Atlas",
      propertyType: "apartment",
      status: "available",
      location: { label: "Tegucigalpa" },
      media: { heroImage: { src: "/foto.jpg", alt: "Entrada" } },
      seo: {},
      pricing,
    } satisfies Property),
    "Venta L.5,200,000 · Renta $1,400",
  );
});

test("a rent-only saved price fills the rent box", () => {
  const fields = editorPriceFields({
    id: "p",
    slug: "p",
    name: "Casa",
    propertyType: "house",
    status: "available",
    tags: ["alquiler"],
    location: { label: "Tegucigalpa" },
    media: { heroImage: { src: "/foto.jpg", alt: "Casa" } },
    seo: {},
    pricing: { amount: 3000, currency: "USD", display: "US$3,000 USD" },
  });

  assert.equal(fields.saleAmount, undefined);
  assert.equal(fields.rentAmount, 3000);
  assert.equal(fields.rentCurrency, "USD");
});

test("asking for a quote replaces both prices", () => {
  const pricing = pricingFromParts({
    sale: { amount: 100, currency: "USD" },
    rent: { amount: 50, currency: "USD" },
    priceOnRequest: true,
  });

  assert.equal(pricing.priceOnRequest, true);
  assert.equal(pricing.display, "Consultar precio");
  assert.equal(pricing.sale, undefined);
});
