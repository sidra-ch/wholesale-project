const CLOUD_NAME = "dfixnhqn0";

type TransformOptions = {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  crop?: string;
  gravity?: string;
};

/**
 * Build a Cloudinary optimized URL with auto format/quality + optional transforms.
 */
export function cloudinaryUrl(
  url: string,
  options: TransformOptions = {}
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop,
    gravity,
  } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);

  const transformStr = transforms.join(",");

  // Insert transforms after /upload/
  return url.replace(/\/upload\//, `/upload/${transformStr}/`);
}

/**
 * Build a Cloudinary video URL with streaming optimization.
 */
export function cloudinaryVideoUrl(
  url: string,
  options: { width?: number; quality?: string } = {}
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const { width, quality = "auto" } = options;
  const transforms: string[] = [`f_auto`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);

  const transformStr = transforms.join(",");
  return url.replace(/\/upload\//, `/upload/${transformStr}/`);
}

/**
 * Build a Cloudinary blur placeholder URL for lazy loading.
 */
export function cloudinaryBlurUrl(url: string): string {
  return cloudinaryUrl(url, {
    width: 40,
    quality: "30",
    format: "auto",
  });
}

/**
 * Get the Cloudinary cloud name.
 */
export function getCloudName(): string {
  return CLOUD_NAME;
}

/**
 * Generate a Cloudinary thumbnail URL for a video.
 */
export function cloudinaryVideoThumbnail(
  videoUrl: string,
  options: { width?: number; height?: number } = {}
): string {
  if (!videoUrl || !videoUrl.includes("res.cloudinary.com")) return videoUrl;

  const { width = 800, height } = options;
  const transforms = [`f_jpg`, `q_auto`, `w_${width}`];
  if (height) transforms.push(`h_${height}`);
  transforms.push("so_0"); // first frame

  // Change video extension to jpg
  const thumbUrl = videoUrl.replace(/\.(mp4|webm|mov|ogg)$/i, ".jpg");
  const transformStr = transforms.join(",");

  return thumbUrl.replace(/\/upload\//, `/upload/${transformStr}/`);
}
