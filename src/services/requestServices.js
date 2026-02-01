import api from "./api";
import endpoints from "./endpoints.json";

export const getMyRequests = async () => {
  const response = await api.get(endpoints.GET_MY_REQUESTS);
  return response.data;
};

export const getOthersRequests = async () => {
  const response = await api.get(endpoints.GET_OTHERS_REQUESTS);
  return response.data;
};

export const getManagedRequests = async () => {
  const response = await api.get(endpoints.GET_MANAGED_REQUESTS);
  return response.data;
};

export const getComments = async () => {
  const response = await api.get(endpoints.GET_REQUEST_COMMENTS);
  return response.data;
};

export const checkProfanity = async (content) => {
  const response = await api.post(endpoints.CHECK_PROFANITY, content);
  return response.data;
};

export const createRequest = async (request) => {
  const response = await api.post(endpoints.CREATE_HELP_REQUEST, request);
  return response.data;
};

export const getEmergencyContactInfo = async () => {
  const response = await api.get(endpoints.GET_EMERGENCY_CONTACT);
  return response.data;
};

export const predictCategories = async (request) => {
  const response = await api.post(endpoints.PREDICT_CATEGORIES, request);
  return response.data;
};

export const GET_NOTIFICATIONS = async () => {
  const response = await api.get(endpoints.GET_NOTIFICATIONS);
  return response.data;
};

export const moreInformation = async (request) => {
  const response = await api.post(endpoints.GENERATE_ANSWER, request);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get(endpoints.GET_CATEGORIES);
  return response.data;
};

export const getEnums = async () => {
  const response = await api.get(endpoints.GET_ENUMS);
  return response.data;
};

export const getMetadata = async () => {
  const response = await api.get(endpoints.GET_METADATA);
  return response.data;
};

export const getEnvironment = async () => {
  const response = await api.get(endpoints.GET_ENVIRONMENT);
  return response.data;
};

export const uploadRequestFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    endpoints.UPLOAD_REQUEST_FILE, // <-- add this key to endpoints.json
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/**
 * Upload audio and get transcription
 * @param {string} audioContent - Base64 encoded audio string
 * @param {number} sampleRate - Sample rate in Hz (default: 16000)
 * @param {string} encoding - Audio encoding format (default: "WEBM_OPUS")
 * @returns {Promise<Object>} - Returns { transcriptionText: string, requestId: string }
 */
export const uploadAudio = async (
  audioContent,
  sampleRate = 16000,
  encoding = "WEBM_OPUS",
) => {
  const requestBody = {
    audioContent: audioContent,
    sampleRate: sampleRate,
    encoding: encoding,
  };

  console.log("Uploading audio - Request body format:", {
    audioContent: audioContent.substring(0, 50) + "... (truncated)",
    audioContentLength: audioContent.length,
    sampleRate: sampleRate,
    encoding: encoding,
  });

  const response = await api.post(endpoints.UPLOAD_AUDIO, requestBody);

  console.log("Audio upload response:", response.data);
  console.log("Response structure:", {
    hasTranscriptionText: "transcriptionText" in response.data,
    hasRequestId: "requestId" in response.data,
    transcriptionText: response.data.transcriptionText,
    requestId: response.data.requestId,
  });

  return response.data;
};

/**
 * Speech detection and transcription API (C2)
 * Detects language automatically and transcribes audio
 * @param {string} audioContent - Base64 encoded audio string (WEBM OPUS format)
 * @returns {Promise<Object>} - Returns { transcriptionText: string, requestId: string, detectedLanguage?: string }
 */
export const speechDetectC2 = async (audioContent) => {
  const requestBody = {
    audioContent: audioContent,
  };

  console.log("Calling speechDetectC2 API - Request body format:", {
    audioContent: audioContent.substring(0, 50) + "... (truncated)",
    audioContentLength: audioContent.length,
  });

  const response = await api.post(endpoints.SPEECH_DETECT_C2, requestBody);

  console.log("SpeechDetectC2 API response:", response.data);
  console.log("Response structure:", {
    hasTranscriptionText: "transcriptionText" in response.data,
    hasRequestId: "requestId" in response.data,
    hasDetectedLanguage: "detectedLanguage" in response.data,
    transcriptionText: response.data.transcriptionText,
    requestId: response.data.requestId,
    detectedLanguage: response.data.detectedLanguage,
  });

  return response.data;
};

/**
 * Speech detection and transcription API (V2)
 * Detects language automatically and transcribes audio
 * @param {string} audioContent - Base64 encoded audio string
 * @returns {Promise<Object>} - Returns { transcriptionText: string, requestId: string, detectedLanguage?: string }
 */
export const speechDetectV2 = async (audioContent) => {
  const requestBody = {
    audioContent: audioContent,
  };

  console.log("Calling speechDetectV2 API - Request body format:", {
    audioContent: audioContent.substring(0, 50) + "... (truncated)",
    audioContentLength: audioContent.length,
  });

  const response = await api.post(endpoints.SPEECH_DETECT_V2, requestBody);

  console.log("SpeechDetectV2 API response:", response.data);

  // API returns an array of objects: [{ transcript: "...", confidence: ..., detected_language: "..." }]
  // Or may return a single object with transcriptionText/transcript field
  let transcript = "";
  let detectedLanguage = null;
  let requestId = null;

  // Check if response is an array
  if (Array.isArray(response.data) && response.data.length > 0) {
    // Extract from first element of array
    const firstResult = response.data[0];
    transcript =
      firstResult.transcript ||
      firstResult.transcriptionText ||
      firstResult.transcription_text ||
      "";
    detectedLanguage =
      firstResult.detected_language || firstResult.detectedLanguage || null;
    requestId = firstResult.requestId || firstResult.request_id || null;
  } else if (response.data && typeof response.data === "object") {
    // Handle single object response
    transcript =
      response.data.transcript ||
      response.data.transcriptionText ||
      response.data.transcription_text ||
      "";
    detectedLanguage =
      response.data.detected_language || response.data.detectedLanguage || null;
    requestId = response.data.requestId || response.data.request_id || null;
  }

  const normalizedResponse = {
    transcriptionText: transcript,
    requestId: requestId,
    detectedLanguage: detectedLanguage,
  };

  console.log("Response structure:", {
    isArray: Array.isArray(response.data),
    arrayLength: Array.isArray(response.data) ? response.data.length : 0,
    hasTranscriptionText: !!normalizedResponse.transcriptionText,
    hasRequestId: !!normalizedResponse.requestId,
    hasDetectedLanguage: !!normalizedResponse.detectedLanguage,
    transcriptionText: normalizedResponse.transcriptionText,
    requestId: normalizedResponse.requestId,
    detectedLanguage: normalizedResponse.detectedLanguage,
  });

  console.log("Detected Language:", normalizedResponse.detectedLanguage);
  console.log("Transcription Text:", normalizedResponse.transcriptionText);

  return normalizedResponse;
};

/**
 * Sign off (delete) user from the database
 * @param {string} userId - The user's database ID (e.g., "SID-00-000-002-556")
 * @param {string} reason - Optional reason for leaving
 * @returns {Promise<Object>} - Returns { success: boolean, statusCode: number, message: string, data: { userId: string } }
 */
export const signOffUser = async (userId, reason = "") => {
  const requestBody = {
    userId: userId,
    reason: reason,
  };

  const response = await api.request({
    method: "DELETE",
    url: endpoints.SIGN_OFF_USER,
    data: requestBody,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
