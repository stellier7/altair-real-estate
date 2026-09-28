import cropData from "@/data/image-crops.json";

export type ImageCropMeta = {
  hasLetterboxing: boolean;
  scale: number;
  contentWidthRatio?: number;
  padLeftPct?: number;
  padRightPct?: number;
};

type CropFile = {
  crops: Record<string, ImageCropMeta>;
};

const cropsByUrl = (cropData as CropFile).crops;

function lookup(url: string): ImageCropMeta | undefined {
  return cropsByUrl[url];
}

/** Resolve crop metadata for catalog image URLs (use the URL stored in properties.json). */
export function getImageCrop(src: string): ImageCropMeta | undefined {
  return lookup(src);
}

export function getImageZoomScale(src: string): number {
  const crop = getImageCrop(src);
  if (!crop?.hasLetterboxing || crop.scale <= 1.02) {
    return 1;
  }
  return crop.scale;
}
