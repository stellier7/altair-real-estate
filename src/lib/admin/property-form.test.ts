import assert from "node:assert/strict";
import test from "node:test";
import { buildPropertyFromForm } from "./build-property-from-form";
import type { Property } from "@/lib/properties/types";
import { explainPropertySaveError, explainUnknownSaveFailure } from "./save-error";
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

test("correcting the Lomas house keeps its photos and drops the edificio fields", () => {
  const property = buildPropertyFromForm(
    form({
      id: "p-1794256301039",
      name: "Se Renta Casa en Lomas del Guijarro",
      slug: "renta-casa-lomas-del-guijarro",
      description:
        "Se Renta Casa en Lomas del Guijarro\r\nPrecio $3,000\r\n\r\nConsta de:\r\n- 4 dormitorios\r\n- 4 baños",
      city: "Tegucigalpa",
      region: "Francisco Morazán",
      country: "Honduras",
      locationLabel: "Lomas del Guijarro, Tegucigalpa",
      priceAmount: "3000",
      currency: "USD",
      seoTitle: "Se Renta Casa en Lomas del Guijarro",
      heroImageSrc: "https://example.com/fachada.jpg",
      galleryUrls: "",
      listing: "rent",
      propertyType: "house",
      status: "available",
    }),
    casaWithPhotos(),
  );

  assert.equal(property.location.label, "Lomas del Guijarro, Tegucigalpa");
  assert.equal(property.pricing?.amount, 3000);
  assert.equal(property.seo.title, "Se Renta Casa en Lomas del Guijarro");
  assert.deepEqual(property.media.gallery?.map((image) => image.src), [
    "https://example.com/sala.jpg",
    "https://example.com/cocina.jpg",
  ]);
  assert.ok(property.description?.includes("- 4 dormitorios"));
  assert.ok(property.description?.includes("\n\n- 4 baños"));
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

test("a lost server response explains the blank browser page", () => {
  const message = explainUnknownSaveFailure(
    Object.assign(new Error("Failed to fetch"), { digest: "abc123" }),
  );
  assert.match(message, /página en blanco/);
  assert.match(message, /abc123/);
});

test("an outdated panel explains that the page must be reloaded", () => {
  const message = explainPropertySaveError(
    'Failed to find Server Action "abc". This request might be from an older or newer deployment.',
  );
  assert.match(message, /desactualizada/);
});

test("a redirect during save tells her to sign in again", () => {
  const message = explainUnknownSaveFailure({
    message: "NEXT_REDIRECT",
    digest: "NEXT_REDIRECT;replace;/admin/login",
  });
  assert.match(message, /sesión expiró/i);
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

test("the Torre Atlas form keeps both prices and the requested photo order", () => {
  const photos = [
    "01-entrada.jpg",
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
  ].map((name) => `/images/properties/apartamento-torre-atlas/${name}`);

  const property = buildPropertyFromForm(
    form({
      name: "Se vende o se renta apartamento amueblado en Torre Atlas",
      slug: "apartamento-amueblado-torre-atlas",
      propertyType: "apartment",
      status: "available",
      listing: "both",
      city: "Tegucigalpa",
      region: "Francisco Morazán",
      country: "Honduras",
      locationLabel: "Torre Atlas, Tegucigalpa",
      saleAmount: "5200000",
      saleCurrency: "HNL",
      rentAmount: "1400",
      rentCurrency: "USD",
      totalArea: "57.2",
      bedrooms: "2",
      bathrooms: "2",
      seoTitle: "Se vende o se renta apartamento amueblado en Torre Atlas",
      heroImageSrc: photos[0],
      galleryUrls: photos.slice(1).join("\n"),
      galleryTouched: "1",
      description: [
        "Precio de venta: L.5,200,000",
        "Precio de renta: $1,400",
        "Mide 57.2 m²",
        "2 habitaciones amplias con closet",
        "2 baños",
        "Sala",
        "Comedor",
        "Cocina",
        "Más información: 9593-0263",
        "cilbia@bienesraicesaltair.com",
      ].join("\n"),
    }),
  );

  assert.equal(property.propertyType, "apartment");
  assert.deepEqual(
    property.tags?.filter((tag) => tag === "venta" || tag === "alquiler"),
    ["venta", "alquiler"],
  );
  assert.equal(property.pricing?.sale?.amount, 5200000);
  assert.equal(property.pricing?.sale?.currency, "HNL");
  assert.equal(property.pricing?.rent?.amount, 1400);
  assert.equal(property.pricing?.rent?.currency, "USD");
  assert.equal(property.pricing?.amount, 5200000);
  assert.equal(property.pricing?.display, "Venta L.5,200,000 · Renta $1,400");
  assert.equal(property.residential?.totalArea, 57.2);
  assert.equal(property.residential?.bedrooms, 2);
  assert.equal(property.residential?.bathrooms, 2);
  assert.equal(property.media.heroImage.src, photos[0]);
  assert.deepEqual(
    property.media.gallery?.map((image) => image.src),
    photos.slice(1),
  );
  assert.match(property.description ?? "", /L\.5,200,000/);
  assert.match(property.description ?? "", /\$1,400/);
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
