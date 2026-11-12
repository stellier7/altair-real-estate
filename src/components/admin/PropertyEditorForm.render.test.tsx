import assert from "node:assert/strict";
import React from "react";
import { mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

mock.module("next/navigation", {
  namedExports: {
    useRouter: () => ({
      push() {},
      refresh() {},
    }),
    redirect() {
      throw new Error("redirect");
    },
  },
});

mock.module("next/cache", {
  namedExports: {
    revalidatePath() {},
  },
});

mock.module("next/link", {
  defaultExport: function Link(props: {
    href: string;
    children?: React.ReactNode;
    className?: string;
  }) {
    return React.createElement(
      "a",
      { href: props.href, className: props.className },
      props.children,
    );
  },
});

const casa = {
  id: "p-1794256301039",
  slug: "renta-casa-lomas-del-guijarro",
  name: "Se Renta Casa en Lomas del Guijarro",
  propertyType: "house" as const,
  status: "available" as const,
  tags: ["alquiler", "lomas del guijarro", "tegucigalpa"],
  shortDescription:
    "Renta de casa en Lomas del Guijarro, 4 habitaciones, 4 baños, 4 estacionamientos",
  description:
    "Se Renta Casa en Lomas del Guijarro\r\nPrecio $3,000\r\n\r\nConsta de:\r\n- 4 dormitorios\r\n- 4 baños",
  location: {
    label: "Colonia Tepeyac, Tegucigalpa",
    city: "Tegucigalpa",
    region: "Francisco Morazán",
    country: "Honduras",
  },
  pricing: { amount: 550000, currency: "USD", priceOnRequest: false },
  media: {
    heroImage: {
      src: "https://example.com/fachada.jpg",
      alt: "Se Renta Casa en Lomas del Guijarro",
    },
    gallery: [
      { src: "https://example.com/sala.jpg", alt: "Sala" },
      { src: "https://example.com/cocina.jpg", alt: "Cocina" },
    ],
  },
  seo: {
    title: "Se renta Edificio en Colonia Tepeyac",
    description:
      "Renta de casa en Lomas del Guijarro, 4 habitaciones, 4 baños, 4 estacionamientos",
  },
};

function valueOf(html: string, name: string): string {
  const input = new RegExp(
    `name="${name}"[^>]*value="([^"]*)"|value="([^"]*)"[^>]*name="${name}"`,
  );
  const textarea = new RegExp(`name="${name}"[^>]*>([^<]*)<\\/textarea>`);
  const inputMatch = html.match(input);
  if (inputMatch) return inputMatch[1] ?? inputMatch[2] ?? "";
  return html.match(textarea)?.[1] ?? "";
}

function fieldIsReadOnly(html: string, name: string): boolean {
  const tag = html.match(
    new RegExp(`<(input|textarea)[^>]*name="${name}"[^>]*>`),
  );
  return Boolean(
    tag?.[0].includes("readonly") || tag?.[0].includes("readOnly"),
  );
}

test("a new house form does not arrive filled with another listing", async () => {
  const { PropertyEditorForm } = await import("./PropertyEditorForm");
  const html = renderToStaticMarkup(React.createElement(PropertyEditorForm, {}));

  assert.equal(valueOf(html, "name"), "");
  assert.equal(valueOf(html, "seoTitle"), "");
  assert.equal(valueOf(html, "locationLabel"), "");
  assert.equal(valueOf(html, "saleAmount"), "");
  assert.equal(valueOf(html, "rentAmount"), "");
  assert.equal(valueOf(html, "galleryUrls"), "");
  assert.equal(fieldIsReadOnly(html, "seoTitle"), true);
  assert.equal(fieldIsReadOnly(html, "locationLabel"), true);
  assert.equal(fieldIsReadOnly(html, "saleAmount"), true);
  assert.equal(fieldIsReadOnly(html, "rentAmount"), true);
  assert.equal(html.includes("Crear inmueble"), true);
  assert.match(html, /autocomplete="off"/i);
});

test("the Lomas house editor keeps its photos and locks the fields Edge was refilling", async () => {
  const { PropertyEditorForm } = await import("./PropertyEditorForm");
  const html = renderToStaticMarkup(
    React.createElement(PropertyEditorForm, { property: casa, published: true }),
  );

  assert.equal(valueOf(html, "name"), "Se Renta Casa en Lomas del Guijarro");
  assert.equal(valueOf(html, "city"), "Tegucigalpa");
  assert.match(valueOf(html, "description"), /4 dormitorios/);
  assert.equal(valueOf(html, "galleryUrls"), "https://example.com/sala.jpg\nhttps://example.com/cocina.jpg");
  assert.equal(valueOf(html, "galleryTouched"), "0");
  assert.equal(valueOf(html, "heroImageSrc"), "https://example.com/fachada.jpg");
  assert.equal(fieldIsReadOnly(html, "seoTitle"), true);
  assert.equal(fieldIsReadOnly(html, "locationLabel"), true);
  assert.equal(valueOf(html, "saleAmount"), "");
  assert.equal(valueOf(html, "rentAmount"), "550000");
  assert.equal(fieldIsReadOnly(html, "rentAmount"), true);
  assert.equal(html.includes("Guardar cambios"), true);
});

test("a failed save stays on the form and explains the blank page", async () => {
  const { SaveResultNotice } = await import("./SaveResultNotice");
  const html = renderToStaticMarkup(
    React.createElement(SaveResultNotice, {
      state: {
        error:
          "El navegador no recibió respuesta del servidor. Por eso puede mostrar una página en blanco. Recargue el panel e intente de nuevo.",
      },
    }),
  );

  assert.match(html, /No se pudo guardar el inmueble/);
  assert.match(html, /página en blanco/);
  assert.match(html, /role="alert"/);
});

test("a failed admin page shows the cause and a way back", async () => {
  const { AdminProblem } = await import("./AdminProblem");
  const html = renderToStaticMarkup(
    React.createElement(AdminProblem, {
      title: "No se pudo completar la acción",
      detail: "La sesión expiró. Vuelva a entrar en el panel y guarde otra vez.",
      code: "digest-123",
    }),
  );

  assert.match(html, /No se pudo completar la acción/);
  assert.match(html, /sesión expiró/);
  assert.match(html, /digest-123/);
  assert.match(html, /href="\/admin\/properties"/);
  assert.match(html, /href="\/admin\/login"/);
});
