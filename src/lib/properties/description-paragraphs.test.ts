import assert from "node:assert/strict";
import test from "node:test";
import {
  isListLikeDescription,
  splitDescriptionParagraphs,
} from "./description-paragraphs";

test("wrapped sentences are joined instead of left as interleaved fragments", () => {
  const blocks = splitDescriptionParagraphs(
    [
      "Se Vende Casa en Lomas del Mayab",
      "$475,000",
      "Consta de tres dormitorios, dos baños y medio, walking closet, cuarto y",
      "baño empleada, bodega, lavandería, portón",
      "eléctrico, muro perimetral, cisterna y bomba.",
      "Construcción - 350 mts2",
      "Terreno - 850 vrs2",
    ].join("\n\n"),
  );

  assert.equal(blocks[0], "Se Vende Casa en Lomas del Mayab");
  assert.equal(blocks[1], "$475,000");
  assert.equal(
    blocks[2],
    "Consta de tres dormitorios, dos baños y medio, walking closet, cuarto y baño empleada, bodega, lavandería, portón eléctrico, muro perimetral, cisterna y bomba.",
  );
  assert.equal(blocks[3], "Construcción - 350 mts2");
  assert.equal(blocks[4], "Terreno - 850 vrs2");
});

test("a dangling article stays with the next word, including Jacuzzi", () => {
  const blocks = splitDescriptionParagraphs(
    [
      "En el rooftop",
      "- 1 cuarto con baño de empleada y área de lavado más el",
      "Jacuzzi",
      "- 3 estacionamientos",
    ].join("\n\n"),
  );

  assert.deepEqual(blocks, [
    "En el rooftop",
    "- 1 cuarto con baño de empleada y área de lavado más el Jacuzzi",
    "- 3 estacionamientos",
  ]);
});

test("floor headings stay on their own line and are not merged into the previous bullet", () => {
  const blocks = splitDescriptionParagraphs(
    [
      "Se renta casa en Residencial Vista Hermosa, La Leona",
      "Precio $650",
      "Primer nivel:",
      "- Garaje para 2 vehículos",
      "- Lavandería y patio.",
      "Segundo nivel:",
      "- 3 habitaciones la principal con balcón",
      "- Area para estudio.",
    ].join("\n\n"),
  );

  assert.deepEqual(blocks, [
    "Se renta casa en Residencial Vista Hermosa, La Leona",
    "Precio $650",
    "Primer nivel:",
    "- Garaje para 2 vehículos",
    "- Lavandería y patio.",
    "Segundo nivel:",
    "- 3 habitaciones la principal con balcón",
    "- Area para estudio.",
  ]);
  assert.equal(isListLikeDescription(blocks), true);
});
