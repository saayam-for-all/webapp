import api from "./api";
import endpoints from "./endpoints.json";

/**
 * Upload audio file to AWS S3
 *
 * TODO: Replace local storage with S3 upload API before production.
 * Currently storing audio locally for testing purposes only.
 *
 * @param {Blob} audioBlob - The audio blob to upload
 * @returns {Promise<Object>} - Returns the local URL and file metadata (for testing)
 */
export const uploadAudioToS3 = async (audioBlob) => {
  // TODO: Replace this local storage implementation with actual S3 upload
  // For testing: Store audio locally and clean up after use
  try {
    // Create a local object URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);
    const timestamp = Date.now();
    const fileName = `recording-${timestamp}.webm`;

    // Store audio reference in sessionStorage for cleanup
    const audioKey = `audio_${timestamp}`;
    const audioData = {
      url: audioUrl,
      fileName: fileName,
      timestamp: timestamp,
      size: audioBlob.size,
    };

    // Store in sessionStorage (will be cleared when tab closes)
    const storedAudios = JSON.parse(
      sessionStorage.getItem("temp_audios") || "[]",
    );
    storedAudios.push(audioKey);
    sessionStorage.setItem("temp_audios", JSON.stringify(storedAudios));
    sessionStorage.setItem(audioKey, JSON.stringify(audioData));

    console.log(
      "[TESTING] Audio stored locally:",
      audioKey,
      "Size:",
      (audioBlob.size / 1024).toFixed(2),
      "KB",
    );

    // Return mock S3 response format for compatibility
    return {
      url: audioUrl,
      key: audioKey,
      fileName: fileName,
      size: audioBlob.size,
      // Note: This is a local URL, not S3 URL
      _isLocalStorage: true, // Flag to indicate this is local storage
    };

    /* PRODUCTION CODE (commented out for now):
    const formData = new FormData();
    formData.append("audio", audioBlob, `recording-${Date.now()}.webm`);

    const response = await api.post(endpoints.UPLOAD_AUDIO_TO_S3, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
    */
  } catch (error) {
    console.error("Error storing audio locally:", error);
    throw new Error(
      error.response?.data?.message || "Failed to store audio locally",
    );
  }
};

/**
 * Clean up locally stored audio files
 * Call this after form submission or when audio is no longer needed
 * @param {string} audioKey - Optional: specific audio key to delete, or delete all if not provided
 */
export const cleanupLocalAudio = (audioKey = null) => {
  try {
    if (audioKey) {
      // Delete specific audio
      const audioData = sessionStorage.getItem(audioKey);
      if (audioData) {
        const data = JSON.parse(audioData);
        URL.revokeObjectURL(data.url); // Release the object URL
        sessionStorage.removeItem(audioKey);

        // Remove from stored list
        const storedAudios = JSON.parse(
          sessionStorage.getItem("temp_audios") || "[]",
        );
        const filtered = storedAudios.filter((key) => key !== audioKey);
        sessionStorage.setItem("temp_audios", JSON.stringify(filtered));

        console.log("[TESTING] Cleaned up local audio:", audioKey);
      }
    } else {
      // Clean up all stored audios
      const storedAudios = JSON.parse(
        sessionStorage.getItem("temp_audios") || "[]",
      );
      storedAudios.forEach((key) => {
        const audioData = sessionStorage.getItem(key);
        if (audioData) {
          try {
            const data = JSON.parse(audioData);
            URL.revokeObjectURL(data.url);
          } catch (e) {
            console.warn("Error cleaning up audio:", key, e);
          }
        }
        sessionStorage.removeItem(key);
      });
      sessionStorage.removeItem("temp_audios");
      console.log("[TESTING] Cleaned up all local audio files");
    }
  } catch (error) {
    console.error("Error cleaning up local audio:", error);
  }
};

/**
 * Convert audio blob to base64 string
 * @param {Blob} audioBlob - The audio blob to convert
 * @returns {Promise<string>} - Base64 encoded audio string
 */
const blobToBase64 = (audioBlob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Remove data:audio/...;base64, prefix
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
};

/**
 * Transcribe audio using Google Cloud Speech-to-Text API
 *
 * Note: Currently using direct API call from frontend for testing.
 * TODO: Move to backend API for production (more secure).
 *
 * @param {Blob} audioBlob - The audio blob to transcribe
 * @param {string} languageCode - Language code (e.g., "en-US", "es-ES", "hi-IN")
 * @param {boolean} isStreaming - Whether this is a streaming transcription (for future use)
 * @returns {Promise<Object>} - Returns transcription result with text and detected language
 */
export const transcribeAudio = async (
  audioBlob,
  languageCode = "en-US",
  isStreaming = false,
) => {
  try {
    // Check if API key is available (for direct frontend call)
    const apiKey =
      typeof process == "undefined"
        ? import.meta.env.VITE_GOOGLE_CLOUD_API_KEY
        : process.env.VITE_GOOGLE_CLOUD_API_KEY;

    if (apiKey) {
      // Direct Google Cloud Speech-to-Text API call from frontend
      console.log("Using direct Google Cloud Speech-to-Text API");

      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);

      // Determine encoding based on MIME type
      const mimeType = audioBlob.type || "audio/webm";
      let encoding = "WEBM_OPUS";
      let sampleRateHertz = 48000;

      if (mimeType.includes("webm")) {
        encoding = "WEBM_OPUS";
        sampleRateHertz = 48000;
      } else if (mimeType.includes("ogg")) {
        encoding = "OGG_OPUS";
        sampleRateHertz = 48000;
      } else if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
        encoding = "MP3";
        sampleRateHertz = 44100;
      } else if (mimeType.includes("wav")) {
        encoding = "LINEAR16";
        sampleRateHertz = 16000;
      }

      // Call Google Cloud Speech-to-Text API
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            config: {
              encoding: encoding,
              sampleRateHertz: sampleRateHertz,
              languageCode: languageCode,
              enableAutomaticPunctuation: true,
            },
            audio: {
              content: base64Audio,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to transcribe audio",
        );
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const transcription = data.results
          .map((result) => result.alternatives[0].transcript)
          .join(" ");

        return {
          text: transcription,
          languageCode: languageCode,
          confidence: data.results[0].alternatives[0].confidence || 0.9,
        };
      } else {
        return {
          text: "",
          languageCode: languageCode,
          confidence: 0,
        };
      }
    } else {
      // Fallback to backend API if no API key
      console.log("No API key found, using backend API");
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("languageCode", languageCode);
      formData.append("isStreaming", isStreaming.toString());

      const response = await api.post(endpoints.TRANSCRIBE_AUDIO, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    }
  } catch (error) {
    console.error("Error transcribing audio:", error);

    // Provide helpful error message
    if (error.message?.includes("API key")) {
      throw new Error(
        "Google Cloud API key not configured. Add VITE_GOOGLE_CLOUD_API_KEY to .env file.",
      );
    } else if (error.response?.status === 404) {
      console.warn(
        "⚠️ Transcription API not found. Backend endpoint /audio/v0.0.1/transcribe needs to be implemented.",
      );
      throw new Error(
        "Transcription API not available. Backend endpoint needs to be implemented.",
      );
    } else if (error.response?.status >= 500) {
      throw new Error(
        error.response?.data?.message ||
          "Transcription service error. Please try again.",
      );
    } else {
      throw new Error(
        error.message ||
          error.response?.data?.message ||
          "Failed to transcribe audio.",
      );
    }
  }
};

/**
 * Get supported languages for Google Cloud Speech-to-Text
 * @returns {Promise<Array>} - Returns array of supported language codes and names
 */
export const getSupportedLanguages = async () => {
  try {
    const response = await api.get(endpoints.GET_SUPPORTED_LANGUAGES);
    return response.data;
  } catch (error) {
    console.error("Error fetching supported languages:", error);
    // Return default languages if API fails
    return [
      { code: "en-US", name: "English (US)" },
      { code: "es-ES", name: "Spanish (Spain)" },
      { code: "fr-FR", name: "French (France)" },
      { code: "de-DE", name: "German (Germany)" },
      { code: "hi-IN", name: "Hindi (India)" },
      { code: "zh-CN", name: "Chinese (Simplified)" },
      { code: "ar-SA", name: "Arabic (Saudi Arabia)" },
      { code: "pt-BR", name: "Portuguese (Brazil)" },
      { code: "ru-RU", name: "Russian (Russia)" },
      { code: "ja-JP", name: "Japanese (Japan)" },
    ];
  }
};

/**
 * Detect language from audio
 * @param {Blob} audioBlob - The audio blob to analyze
 * @returns {Promise<string>} - Returns detected language code
 */
export const detectLanguage = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await api.post(endpoints.DETECT_LANGUAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.languageCode;
  } catch (error) {
    console.error("Error detecting language:", error);
    return "en-US"; // Default to English
  }
};
