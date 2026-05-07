import { cloudinary } from "../lib/cloudinary";

const UPLOAD_MARKER = "/upload/";

/**
 * Cloudinary `destroy` expects `public_id`, not a full `secure_url`.
 * Handles optional transformation segments and `v123` version prefix.
 */
export function publicIdFromCloudinaryUrl(url: string): string {
  const i = url.indexOf(UPLOAD_MARKER);
  if (i === -1) {
    throw new Error("Invalid Cloudinary URL: missing /upload/");
  }

  let path = url.slice(i + UPLOAD_MARKER.length).split("?")[0];
  if (!path) {
    throw new Error("Invalid Cloudinary URL: empty path after /upload/");
  }

  const segments = path.split("/").filter(Boolean);

  let head = segments[0];
  while (head !== undefined && head.includes(",")) {
    segments.shift();
    head = segments[0];
  }

  head = segments[0];
  if (head !== undefined && /^v\d+$/i.test(head)) {
    segments.shift();
  }

  if (!segments.length) {
    throw new Error("Invalid Cloudinary URL: could not resolve public_id");
  }

  const withPossibleExt = segments.join("/");
  return withPossibleExt.replace(/\.[^/.]+$/, "");
}

function toDestroyPublicId(urlOrPublicId: string): string {
  const trimmed = urlOrPublicId.trim();
  if (!trimmed.startsWith("http")) {
    return trimmed.replace(/\.[^/.]+$/, "");
  }
  return publicIdFromCloudinaryUrl(trimmed);
}

export async function removeFile(urlOrPublicId: string) {
  const publicId = toDestroyPublicId(urlOrPublicId);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}
