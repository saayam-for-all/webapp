export const mapHelpRequestPayload = ({
  formData,
  selectedCategoryId,
  requesterId,
  enumMaps,
  additionalFields,
}) => {
  const payload = {
    requesterId: requesterId,
    requestSubject: formData.subject,
    requestDescription: formData.description,

    isCalamity: Boolean(formData.is_calamity),

    isLeadVolunteer: formData.lead_volunteer === "Yes" ? 1 : 0,

    requestPriority: {
      requestPriorityId: enumMaps.requestPriority[formData.priority],
    },

    requestType: {
      requestTypeId: enumMaps.requestType[formData.request_type],
    },

    helpCategory: {
      catId: selectedCategoryId,
    },

    requestFor: {
      requestForId:
        formData.is_self === "yes"
          ? enumMaps.requestFor.SELF
          : enumMaps.requestFor.OTHER,
    },
  };

  // Include dynamic additional fields if any were filled
  if (additionalFields && Object.keys(additionalFields).length > 0) {
    payload.additionalFields = additionalFields;
  }

  return payload;
};
