/**
 * @returns {import('sharp')}
 */
export function requireSharp(): typeof import("sharp");
/**
 * Crop the image by given rectangle (use base64 string as input and output)
 *
 * @param {string} base64Image The string with base64 encoded image.
 * Supports all image formats natively supported by Sharp library.
 * @param {import('sharp').Region} rect The selected region of image
 * @return {Promise<string>} base64 encoded string of cropped image
 */
export function cropBase64Image(base64Image: string, rect: import("sharp").Region): Promise<string>;
//# sourceMappingURL=image-util.d.ts.map