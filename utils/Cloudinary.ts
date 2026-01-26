import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath: string,
  folder = "portfolio",
) => {
  try {
    console.log("prev");
    if (!localFilePath) return null;
    console.log("next");
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder ? `portfolio${folder}` : "portfolio",
    });

    if (!response || !response.secure_url) {
      throw new Error("Upload failed with no secure URL returned.");
    }

    return response;
  } catch (error) {
    console.error("Upload failed:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFile = async (publicId: string) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export { deleteFile, uploadOnCloudinary };

// const thumbnailFile = (req.files as any).thumbnail[0];
// const thumbnailResponse = await uploadOnCloudinary(
//   thumbnailFile.path,
//   "thumbnails",
// );

// if (thumbnailResponse) {
//   updateData.thumbnail = {
//     image_id: thumbnailResponse.public_id,
//     image_url: thumbnailResponse.secure_url,
//   };
// }

// if (product.thumbnail && product.thumbnail.image_id) {
//   await deleteFile(product.thumbnail.image_id);
// }
