import axios from "axios";

export function extractExtensionFrom(filename) {
  if (!filename) {
    return null;
  }
  const regex = /(?:\.([^.]+))?$/;
  return regex.exec(filename)[1];
}

export const uploadToServer = async (uri, params) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    console.log(`${key}: ${value}`);
    formData.append(key, value);
  }

  return await axios.put(uri, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAvararServer = async (uri) => {
  await axios.delete(uri);
};
