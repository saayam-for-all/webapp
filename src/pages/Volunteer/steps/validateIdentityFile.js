export const MAX_ID_FILE_SIZE = 5 * 1024 * 1024;

const SUPPORTED_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

export const validateIdentityFile = async (file) => {
  if (!file || file.size === 0) {
    return "empty";
  }

  if (file.size > MAX_ID_FILE_SIZE) {
    return "size";
  }

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const expectedType = SUPPORTED_TYPES[extension];

  if (!expectedType || file.type.toLowerCase() !== expectedType) {
    return "type";
  }

  try {
    const bytes = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(new Uint8Array(reader.result));
      };

      reader.onerror = () => {
        reject(new Error("Unable to read file"));
      };

      reader.readAsArrayBuffer(file.slice(0, 8));
    });

    const matches = (...signature) =>
      signature.every((byte, index) => bytes[index] === byte);

    let valid = false;

    if (expectedType === "image/jpeg") {
      valid = matches(0xff, 0xd8, 0xff);
    } else if (expectedType === "image/png") {
      valid = matches(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    } else if (expectedType === "application/pdf") {
      valid = matches(0x25, 0x50, 0x44, 0x46, 0x2d);
    }

    return valid ? null : "content";
  } catch {
    return "content";
  }
};
