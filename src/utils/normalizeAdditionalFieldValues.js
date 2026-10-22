const splitIsoDateTime = (value) => {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  return match ? { date: match[1], time: match[2] } : null;
};

const getMetadataFields = (metadata) =>
  (Array.isArray(metadata) ? metadata : []).flatMap((entry) =>
    Array.isArray(entry?.fields) ? entry.fields : [],
  );

export const extractAdditionalFieldsFromResponse = (response) => {
  const payload = response?.data ?? response ?? {};

  if (
    payload.additionalFields &&
    typeof payload.additionalFields === "object" &&
    !Array.isArray(payload.additionalFields)
  ) {
    return payload.additionalFields;
  }

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    (payload.requestId || payload.reqCatId)
  ) {
    const {
      requestId: _requestId,
      reqCatId: _reqCatId,
      additionalInfo: _additionalInfo,
      additionalFields: _additionalFields,
      ...fieldValues
    } = payload;
    return fieldValues;
  }

  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? payload
    : {};
};

export const normalizeAdditionalFieldValues = (values, metadata) => {
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return {};
  }

  const fieldsById = new Map(
    getMetadataFields(metadata).map((field) => [field.fieldId, field]),
  );

  return Object.fromEntries(
    Object.entries(values).map(([fieldId, value]) => {
      const field = fieldsById.get(fieldId);

      if (field?.fieldType === "date&time") {
        const parts = splitIsoDateTime(value);
        if (parts) {
          return [
            fieldId,
            {
              [`${fieldId}_date`]: parts.date,
              [`${fieldId}_time`]: parts.time,
            },
          ];
        }
      }

      return [fieldId, value];
    }),
  );
};
