export const validateIsDefined = (value) => typeof value !== "undefined";

export const validateString = (stringValue, isEmptyCheck = true) => {
  const result = typeof stringValue === "string";

  if (isEmptyCheck) {
    return result && Boolean(stringValue.length);
  }

  return result;
};
