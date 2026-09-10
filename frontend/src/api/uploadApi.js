import axios from "axios";

/**
 * Uploads an image file to Cloudinary and returns the secure URL.
 */
export const uploadToCloudinary = async (
  file,
  preset = "Mercato",
  cloudName = "dp5zhfxsl"
) => {
  if (!file || (file instanceof File && file.size === 0)) return null;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("cloud_name", cloudName);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );
  return response.data?.secure_url || null;
};
