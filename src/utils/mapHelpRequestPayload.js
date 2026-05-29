export const mapHelpRequestPayload = ({
  formData,
  selectedCategoryId,
  requesterId,
  enumMaps,
  additionalFields,
}) => {
  console.log("requesterId value:", requesterId);
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
      catId:
        selectedCategoryId === "GENERAL_CATEGORY" ||
        selectedCategoryId === "General"
          ? "0.0.0.0.0"
          : selectedCategoryId,
    },

    requestFor: {
      requestForId:
        enumMaps.requestFor[formData.request_for] ?? enumMaps.requestFor.SELF,
    },
  };

  // Include guest details when request is for someone else (OTHER)
  const requestForId = payload.requestFor.requestForId;
  if (requestForId === enumMaps.requestFor.OTHER) {
    payload.guestDetails = {
      reqFname: formData.requester_first_name,
      reqLname: formData.requester_last_name,
      reqEmail: formData.email,
      reqPhone: formData.phone,
      reqAge: formData.age ? Number(formData.age) : null,
      reqGender: formData.gender !== "Select" ? formData.gender : null,
      reqPrefLang: formData.preferred_language || null,
    };
  }

  // Include dynamic additional fields if any were filled
  if (additionalFields && Object.keys(additionalFields).length > 0) {
    payload.additionalFields = additionalFields;
  }

  return payload;
};
