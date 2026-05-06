import { cloudinary } from "../../lib/cloudinary";

export async function uploadImage(buffer: Buffer) {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
}
