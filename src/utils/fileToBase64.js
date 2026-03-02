/**
 * Accepted MIME types for profile photo (jpeg/jpg and png only).
 */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

/**
 * Converts a File to a Base64 data URL string using FileReader (readAsDataURL).
 * Returned string includes the prefix "data:<mime>;base64,..." as required by the API.
 *
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Resolves with the full data URL (e.g. "data:image/jpeg;base64,/9j/4AAQ...")
 * @throws {Error} - If file type is not image/jpeg or image/png
 */
export function fileToBase64(file) {
  if (!file || !(file instanceof File)) {
    return Promise.reject(new Error("Invalid file"));
  }

  const type = (file.type || "").toLowerCase();
  if (!ACCEPTED_IMAGE_TYPES.includes(type)) {
    return Promise.reject(new Error("Only JPG and PNG formats are accepted."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
