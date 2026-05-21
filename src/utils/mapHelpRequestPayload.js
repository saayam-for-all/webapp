export const mapHelpRequestPayload = ({
  formData,
  selectedCategoryId,
  requesterId,
  enumMaps,
  additionalFields,
  requestId,
}) => {
  const payload = {
    requesterId: requesterId,
    requestSubject: formData.subject,
    requestDescription: formData.description,

    isCalamity: Boolean(formData.is_calamity),

    isLeadVolunteer: formData.lead_volunteer === "Yes" ? 1 : 0,

    requestPriority: {
      requestPriorityId:
        enumMaps.requestPriority[
          String(formData.priority).toUpperCase().replace(/\s+/g, "_")
        ],
    },

    requestType: {
      requestTypeId:
        enumMaps.requestType[
          String(formData.request_type).toUpperCase().replace(/\s+/g, "_")
        ],
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
        enumMaps.requestFor[
          String(formData.request_for).toUpperCase().replace(/\s+/g, "_")
        ] ?? enumMaps.requestFor.SELF,
    },
  };

  // Include requestId when updating an existing request
  if (requestId) {
    payload.requestId = requestId;
  }

  // Include location if provided
  if (formData.location) {
    payload.requestLocation = formData.location;
  }

  // Include audio description if provided
  if (formData.audioRequestDescription) {
    payload.audioRequestDescription = formData.audioRequestDescription;
  }

  // Include document link if provided
  if (formData.requestDocumentLink) {
    payload.requestDocumentLink = formData.requestDocumentLink;
  }

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
