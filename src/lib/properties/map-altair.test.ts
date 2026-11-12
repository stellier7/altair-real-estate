import assert from "node:assert/strict";
import test from "node:test";
import manual from "@/data/manual-properties.json";
import { mapAltairProperty, type AltairRawProperty } from "./map-altair";

test("the Torre Atlas apartment is sale and rent, with the visit order", () => {
  const raw = (manual as { properties: AltairRawProperty[] }).properties.find(
    (property) => property.id === "190000002",
  );
  assert.ok(raw);
  const property = mapAltairProperty(raw, false);

  assert.equal(property.slug, "apartamento-amueblado-torre-atlas");
  assert.equal(property.propertyType, "apartment");
  assert.deepEqual(property.tags?.slice(0, 2), ["venta", "alquiler"]);
  assert.equal(property.pricing?.display, "L.5,200,000 venta · $1,400 renta");
  assert.equal(property.pricing?.amount, 5200000);
  assert.equal(property.pricing?.currency, "HNL");
  assert.equal(property.residential?.totalArea, 57.2);
  assert.equal(property.residential?.bedrooms, 2);
  assert.equal(property.residential?.bathrooms, 2);
  assert.match(property.media.heroImage.src, /01-entrada\.jpg$/);
  assert.deepEqual(
    property.media.gallery?.map((image) => image.src.split("/").pop()),
    [
      "02-recibidor.jpg",
      "03-sala.jpg",
      "04-sala-sofa.jpg",
      "05-cocina-comedor.jpg",
      "06-comedor.jpg",
      "07-comedor-puerta.jpg",
      "08-habitacion-principal.jpg",
      "09-habitacion-principal-ventana.jpg",
      "10-habitacion-principal-estantes.jpg",
      "11-habitacion-principal-clima.jpg",
      "12-habitacion.jpg",
      "13-habitacion-puerta.jpg",
      "14-bano.jpg",
    ],
  );
});
