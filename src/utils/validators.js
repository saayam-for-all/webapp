export const validateIsDefined = (value) => typeof value !== "undefined";

export const validateString = (stringValue, isEmptyCheck = true) => {
  const result = typeof stringValue === "string";

  if (isEmptyCheck) {
    return result && Boolean(stringValue.length);
  }

  return result;
};

export const validateObject = (objectValue, isEmptyCheck = false) => {
  const result = typeof objectValue === "object" && objectValue !== null;

  if (isEmptyCheck) {
    return result && Boolean(Object.keys(objectValue).length);
  }

  return result;
};

export const validateArray = (arrayValue, isEmptyCheck = true) => {
  const result = validateObject(arrayValue) && Array.isArray(arrayValue);

  if (isEmptyCheck) {
    return result && Boolean(arrayValue.length);
  }

  return result;
};
