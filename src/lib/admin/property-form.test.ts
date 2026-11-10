import assert from "node:assert/strict";
import test from "node:test";
import { buildPropertyFromForm } from "./build-property-from-form";
import type { Property } from "@/lib/properties/types";
import { explainPropertySaveError } from "./save-error";
import { validatePropertyImageFile } from "./image-file";
import { propertySearchOrFilter } from "./property-search";

function form(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    data.set(key, value);
  }
  return data;
}

test("a new property keeps a gallery URL typed but not yet added to the list", () => {
  const property = buildPropertyFromForm(
    form({
      name: "Casa de prueba",
      heroImageSrc: "https://image.wasi.co/hero.jpg",
      galleryUrls: "https://image.wasi.co/uno.jpg",
      galleryUrlDraft: "https://image.wasi.co/dos.jpg",
      listing: "sale",
      propertyType: "house",
      status: "available",
    }),
  );

  assert.deepEqual(
    property.media.gallery?.map((image) => image.src),
    ["https://image.wasi.co/uno.jpg", "https://image.wasi.co/dos.jpg"],
  );
});

function casaWithPhotos(): Property {
  return {
    id: "p-1794256301039",
    slug: "renta-casa-lomas-del-guijarro",
    name: "Se Renta Casa en Lomas del Guijarro",
    propertyType: "house",
    status: "available",
    location: { label: "Lomas del Guijarro, Tegucigalpa" },
    media: {
      heroImage: {
        src: "https://example.com/fachada.jpg",
        alt: "Fachada",
      },
      gallery: [
        { src: "https://example.com/sala.jpg", alt: "Sala" },
        { src: "https://example.com/cocina.jpg", alt: "Cocina" },
      ],
    },
    seo: { title: "Se Renta Casa en Lomas del Guijarro" },
  };
}

test("saving other fields does not delete gallery photos", () => {
  const property = buildPropertyFromForm(
    form({
      id: "p-1794256301039",
      name: "Se Renta Casa en Lomas del Guijarro",
      heroImageSrc: "https://example.com/fachada.jpg",
      galleryUrls: "",
      listing: "rent",
      propertyType: "house",
      status: "available",
    }),
    casaWithPhotos(),
  );

  assert.deepEqual(
    property.media.gallery?.map((image) => image.src),
    ["https://example.com/sala.jpg", "https://example.com/cocina.jpg"],
  );
});

test("clearing the gallery on purpose removes the stored photos", () => {
  const property = buildPropertyFromForm(
    form({
      id: "p-1794256301039",
      name: "Se Renta Casa en Lomas del Guijarro",
      heroImageSrc: "https://example.com/fachada.jpg",
      galleryUrls: "",
      galleryTouched: "1",
      listing: "rent",
      propertyType: "house",
      status: "available",
    }),
    casaWithPhotos(),
  );

  assert.deepEqual(property.media.gallery, []);
});

test("saving a property rejoins description lines that were split mid-sentence", () => {
  const property = buildPropertyFromForm(
    form({
      name: "Casa de prueba",
      heroImageSrc: "https://image.wasi.co/hero.jpg",
      description: "Cuarto y\n\nbaño completo, portón\n\neléctrico.",
      listing: "rent",
      propertyType: "house",
      status: "available",
    }),
  );

  assert.equal(property.description, "Cuarto y baño completo, portón eléctrico.");
});

test("duplicate slug errors are explained in Spanish", () => {
  const message = explainPropertySaveError(
    'duplicate key value violates unique constraint "properties_slug_key"',
  );
  assert.match(message, /slug/i);
  assert.match(message, /Ya existe/);
});

test("iPhone HEIC uploads explain how to continue", () => {
  const message = validatePropertyImageFile({
    type: "image/heic",
    size: 1024,
    name: "IMG_2044.HEIC",
  });
  assert.match(message ?? "", /HEIC|JPG/i);
});

test("admin search keeps commas inside the filter value", () => {
  const filter = propertySearchOrFilter('Lomas, "Guijarro"');
  assert.match(filter, /name\.ilike\."%Lomas, ""Guijarro""%"/);
  assert.match(filter, /id\.eq\."Lomas, ""Guijarro"""/);
});

test("a jpg with an empty browser mime type is accepted", () => {
  assert.equal(
    validatePropertyImageFile({
      type: "",
      size: 1024,
      name: "fachada.jpg",
    }),
    null,
  );
});
