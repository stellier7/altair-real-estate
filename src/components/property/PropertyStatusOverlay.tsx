import type { PropertyStatus } from "@/lib/properties/types";
import { formatStatus } from "@/lib/properties/specs";

type PropertyStatusOverlayProps = {
  status: PropertyStatus;
};

function assertNever(value: never): never {
  throw new Error(`Unhandled status: ${String(value)}`);
}

function overlayForStatus(status: PropertyStatus): {
  label: string;
  tone: "sold" | "reserved" | "muted";
} | null {
  switch (status) {
    case "sold":
      return { label: formatStatus(status), tone: "sold" };
    case "reserved":
      return { label: formatStatus(status), tone: "reserved" };
    case "off_market":
      return { label: formatStatus(status), tone: "muted" };
    case "available":
    case "under_development":
    case "coming_soon":
      return null;
    default:
      return assertNever(status);
  }
}

const toneClasses = {
  sold: "bg-[color-mix(in_srgb,var(--foreground)_82%,transparent)] text-background",
  reserved:
    "bg-[color-mix(in_srgb,var(--accent)_88%,var(--foreground))] text-background",
  muted: "bg-[color-mix(in_srgb,var(--muted)_90%,var(--foreground))] text-background",
} as const;

export function PropertyStatusOverlay({ status }: PropertyStatusOverlayProps) {
  const overlay = overlayForStatus(status);
  if (!overlay) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 py-3 text-center ${toneClasses[overlay.tone]}`}
      aria-hidden="true"
    >
      <p className="font-display text-2xl tracking-[0.18em] uppercase sm:text-3xl">
        {overlay.label}
      </p>
    </div>
  );
}

export function isUnavailableListing(status: PropertyStatus): boolean {
  switch (status) {
    case "sold":
    case "reserved":
    case "off_market":
      return true;
    case "available":
    case "under_development":
    case "coming_soon":
      return false;
    default:
      return assertNever(status);
  }
}
