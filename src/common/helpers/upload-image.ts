import { cloudinary } from "../../lib/cloudinary";

export type UploadImageResult = {
  secureUrl: string;
  publicId: string;
};

export async function uploadImage(buffer: Buffer): Promise<UploadImageResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(buffer);
  });
}
