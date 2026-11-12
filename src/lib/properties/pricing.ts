import type { ListedPrice, Property, PropertyPricing } from "./types";

export function formatListedPrice(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat("es-HN", {
    maximumFractionDigits: 0,
  }).format(amount);
  const code = currency.trim().toUpperCase();
  if (code === "HNL") return `L.${formatted}`;
  if (code === "USD") return `$${formatted}`;
  return `${code} ${formatted}`;
}

export function composePriceDisplay(
  sale?: ListedPrice,
  rent?: ListedPrice,
): string | undefined {
  const parts: string[] = [];
  if (typeof sale?.amount === "number" && sale.currency?.trim()) {
    parts.push(`Venta ${formatListedPrice(sale.amount, sale.currency)}`);
  }
  if (typeof rent?.amount === "number" && rent.currency?.trim()) {
    parts.push(`Renta ${formatListedPrice(rent.amount, rent.currency)}`);
  }
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export type EditorPriceFields = {
  saleAmount?: number;
  saleCurrency: string;
  rentAmount?: number;
  rentCurrency: string;
};

function finiteAmount(amount: number | undefined): number | undefined {
  return typeof amount === "number" && Number.isFinite(amount) ? amount : undefined;
}

/** Fill the sale and rent boxes from a saved listing that may only have one price. */
export function editorPriceFields(property?: Property): EditorPriceFields {
  const pricing = property?.pricing;
  const saleAmount = finiteAmount(pricing?.sale?.amount);
  const rentAmount = finiteAmount(pricing?.rent?.amount);
  const fields: EditorPriceFields = {
    saleAmount,
    saleCurrency: pricing?.sale?.currency?.trim() || "USD",
    rentAmount,
    rentCurrency: pricing?.rent?.currency?.trim() || "USD",
  };
  if (fields.saleAmount !== undefined || fields.rentAmount !== undefined) {
    return fields;
  }

  const legacy = finiteAmount(pricing?.amount);
  if (legacy === undefined) {
    return fields;
  }
  const currency = pricing?.currency?.trim() || "USD";
  const tags = property?.tags ?? [];
  const isRentOnly = tags.includes("alquiler") && !tags.includes("venta");
  if (isRentOnly) {
    return { ...fields, rentAmount: legacy, rentCurrency: currency };
  }
  return { ...fields, saleAmount: legacy, saleCurrency: currency };
}

export function pricingFromParts(input: {
  sale?: ListedPrice;
  rent?: ListedPrice;
  legacyAmount?: number;
  legacyCurrency?: string;
  priceDisplay?: string;
  priceOnRequest: boolean;
}): PropertyPricing {
  const sale =
    typeof input.sale?.amount === "number"
      ? { amount: input.sale.amount, currency: input.sale.currency?.trim() || "USD" }
      : undefined;
  const rent =
    typeof input.rent?.amount === "number"
      ? { amount: input.rent.amount, currency: input.rent.currency?.trim() || "USD" }
      : undefined;
  if (input.priceOnRequest) {
    return { priceOnRequest: true, display: "Consultar precio" };
  }

  const composed = composePriceDisplay(sale, rent);
  const display = composed || input.priceDisplay?.trim() || undefined;
  const amount = sale?.amount ?? rent?.amount ?? input.legacyAmount;
  const currency =
    sale?.currency ?? rent?.currency ?? input.legacyCurrency?.trim() ?? "USD";

  return {
    amount,
    currency,
    display,
    priceOnRequest: false,
    sale,
    rent,
  };
}
