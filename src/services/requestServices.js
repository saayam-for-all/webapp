import api from "./api";
import endpoints from "./endpoints.json";
import { requestsData } from "../pages/Dashboard/data";

export const getMyRequests = async () => {
  try {
    const response = await api.get(endpoints.GET_MY_REQUESTS);
    // If API returns empty data, fallback to mock data
    if (
      !response.data ||
      !response.data.body ||
      !Array.isArray(response.data.body) ||
      response.data.body.length === 0
    ) {
      console.warn("API returned empty data, using mock data fallback");
      return { body: requestsData.myRequests.data };
    }
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch my requests from API, using mock data:",
      error.message,
    );
    return { body: requestsData.myRequests.data };
  }
};

export const getOthersRequests = async () => {
  try {
    const response = await api.get(endpoints.GET_OTHERS_REQUESTS);
    // If API returns empty data, fallback to mock data
    if (
      !response.data ||
      !response.data.body ||
      !Array.isArray(response.data.body) ||
      response.data.body.length === 0
    ) {
      console.warn("API returned empty data, using mock data fallback");
      return { body: requestsData.othersRequests.data };
    }
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch others requests from API, using mock data:",
      error.message,
    );
    return { body: requestsData.othersRequests.data };
  }
};

export const getManagedRequests = async () => {
  try {
    const response = await api.get(endpoints.GET_MANAGED_REQUESTS);
    // If API returns empty data, fallback to mock data
    if (
      !response.data ||
      !response.data.body ||
      !Array.isArray(response.data.body) ||
      response.data.body.length === 0
    ) {
      console.warn("API returned empty data, using mock data fallback");
      return { body: requestsData.managedRequests.data };
    }
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch managed requests from API, using mock data:",
      error.message,
    );
    return { body: requestsData.managedRequests.data };
  }
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
