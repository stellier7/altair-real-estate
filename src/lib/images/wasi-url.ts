const WASI_IMAGE_HOST = "image.wasi.co";

function parseWasiPayload(encoded: string): Record<string, unknown> | null {
  try {
    let jsonText = Buffer.from(encoded, "base64").toString("utf8");
    while (jsonText.length > 0) {
      try {
        return JSON.parse(jsonText) as Record<string, unknown>;
      } catch {
        jsonText = jsonText.slice(0, -1);
      }
    }
    return null;
  } catch {
    return null;
  }
}

function encodeWasiPayload(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

type WasiResize = {
  fit?: string;
  background?: unknown;
  width?: number;
  height?: number;
};

/**
 * Wasi CDN URLs often use fit "contain" with a white background, which letterboxes
 * portrait photos inside listing thumbnails. Prefer cover so images fill the frame.
 */
export function normalizeWasiImageUrl(src: string): string {
  if (!src.includes(WASI_IMAGE_HOST)) {
    return src;
  }

  const encoded = src.split("/").pop();
  if (!encoded) {
    return src;
  }

  const payload = parseWasiPayload(encoded);
  if (!payload) {
    return src;
  }

  const edits = payload.edits as { resize?: WasiResize } | undefined;
  const resize = edits?.resize;
  if (!resize || resize.fit !== "contain") {
    return src;
  }

  resize.fit = "cover";
  delete resize.background;

  return `https://${WASI_IMAGE_HOST}/${encodeWasiPayload(payload)}`;
}
