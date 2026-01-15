import api from "./api";
import endpoints from "./endpoints.json";
import { uploadAudio, speechDetectC2, speechDetectV2 } from "./requestServices";
import audioBufferToWav from "audiobuffer-to-wav";

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
export const blobToBase64 = (audioBlob) => {
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
 * Convert audio blob to WAV format (LINEAR16 PCM) at 16kHz sample rate
 *
 * Optimized for Google Cloud Speech-to-Text best practices:
 * - Encoding: LINEAR16 (PCM) - lossless encoding, explicitly set for optimal performance
 * - Sample Rate: 16 kHz - optimal for speech recognition
 * - Channels: Mono (1 channel) - recommended for speech
 * - Bit Depth: 16-bit - standard for LINEAR16 PCM
 * - Format: WAV with LINEAR16 encoding (explicitly set in WAV header)
 *
 * This format prevents accuracy loss from compression and works best
 * with background noise, ensuring optimal transcription results.
 * The WAV header explicitly specifies LINEAR16 (PCM) encoding, which
 * allows Google Cloud Speech-to-Text to auto-detect and use the optimal settings.
 *
 * Alternative optimal format: FLAC (also lossless), but LINEAR16 WAV is
 * more widely supported and provides the same quality for speech recognition.
 *
 * @param {Blob} audioBlob - The audio blob to convert (can be WebM, Opus, etc.)
 * @returns {Promise<string>} - Base64 encoded WAV audio string (LINEAR16 PCM, 16kHz, mono, 16-bit)
 */
const convertToLinear16Wav = async (audioBlob) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting audio conversion...");
      console.log("Audio blob size:", (audioBlob.size / 1024).toFixed(2), "KB");
      console.log("Audio blob type:", audioBlob.type);

      // Check if audio is too large (more than 10MB)
      const maxSizeMB = 10;
      const sizeMB = audioBlob.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        throw new Error(
          `Audio file too large: ${sizeMB.toFixed(2)}MB. Maximum allowed: ${maxSizeMB}MB`,
        );
      }

      // Create audio context with 16kHz sample rate
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)({
        sampleRate: 16000,
      });

      console.log("Decoding audio data...");
      // Decode the audio blob
      const arrayBuffer = await audioBlob.arrayBuffer();
      console.log(
        "ArrayBuffer size:",
        (arrayBuffer.byteLength / 1024).toFixed(2),
        "KB",
      );

      let audioBuffer;
      try {
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0)); // Use slice to create a copy
      } catch (decodeError) {
        console.error("Error decoding audio data:", decodeError);
        console.error("Error name:", decodeError.name);
        console.error("Error message:", decodeError.message);

        // Provide more helpful error message
        if (
          decodeError.name === "EncodingError" ||
          decodeError.message.includes("decode")
        ) {
          throw new Error(
            `Failed to decode audio format. The browser may not support ${audioBlob.type}. ` +
              `Try using a different browser or record a shorter audio clip. Error: ${decodeError.message}`,
          );
        } else if (sizeMB > 5) {
          throw new Error(
            `Audio file is too large (${sizeMB.toFixed(2)}MB) to process. ` +
              `Please record a shorter audio clip (under 5MB recommended).`,
          );
        } else {
          throw new Error(
            `Failed to process audio. Error: ${decodeError.message}. ` +
              `Please try recording again or use a shorter audio clip.`,
          );
        }
      }

      console.log("Original audio decoded:", {
        sampleRate: audioBuffer.sampleRate,
        duration: audioBuffer.duration.toFixed(2) + "s",
        channels: audioBuffer.numberOfChannels,
        length: audioBuffer.length,
      });

      // Check duration limit (e.g., 5 minutes max)
      const maxDurationSeconds = 300; // 5 minutes
      if (audioBuffer.duration > maxDurationSeconds) {
        throw new Error(
          `Audio too long: ${audioBuffer.duration.toFixed(2)}s. Maximum allowed: ${maxDurationSeconds}s`,
        );
      }

      // If already 16kHz, use it directly; otherwise resample
      let processedBuffer = audioBuffer;
      if (audioBuffer.sampleRate !== 16000) {
        console.log(
          `Resampling from ${audioBuffer.sampleRate}Hz to 16000Hz...`,
        );
        const targetLength = Math.floor(audioBuffer.duration * 16000);
        console.log("Target length:", targetLength);

        // Resample to 16kHz
        const offlineContext = new OfflineAudioContext(
          1, // mono channel
          targetLength,
          16000,
        );

        const source = offlineContext.createBufferSource();
        const buffer = offlineContext.createBuffer(
          audioBuffer.numberOfChannels,
          audioBuffer.length,
          audioBuffer.sampleRate,
        );

        // Copy audio data
        for (
          let channel = 0;
          channel < audioBuffer.numberOfChannels;
          channel++
        ) {
          buffer.copyToChannel(audioBuffer.getChannelData(channel), channel);
        }

        source.buffer = buffer;
        source.connect(offlineContext.destination);
        source.start();

        processedBuffer = await offlineContext.startRendering();
        console.log("Resampled audio to 16kHz");
      }

      // Convert to mono if stereo
      let monoBuffer = processedBuffer;
      if (processedBuffer.numberOfChannels > 1) {
        const monoData = new Float32Array(processedBuffer.length);
        for (let i = 0; i < processedBuffer.length; i++) {
          let sum = 0;
          for (
            let channel = 0;
            channel < processedBuffer.numberOfChannels;
            channel++
          ) {
            sum += processedBuffer.getChannelData(channel)[i];
          }
          monoData[i] = sum / processedBuffer.numberOfChannels;
        }
        monoBuffer = new AudioBuffer({
          length: processedBuffer.length,
          numberOfChannels: 1,
          sampleRate: 16000,
        });
        monoBuffer.copyToChannel(monoData, 0);
      }

      console.log(
        "Converting to LINEAR16 PCM (16-bit) using audiobuffer-to-wav library...",
      );

      // Use audiobuffer-to-wav library for faster conversion
      // This library handles the conversion from AudioBuffer to WAV format efficiently
      const wavBuffer = audioBufferToWav(monoBuffer, {
        float32: false, // Use 16-bit PCM (LINEAR16) instead of 32-bit float
      });

      console.log("LINEAR16 PCM conversion complete:", {
        samples: monoBuffer.length,
        duration: (monoBuffer.length / 16000).toFixed(2) + "s",
        bitDepth: "16-bit",
        encoding: "LINEAR16 (PCM)",
        sampleRate: "16 kHz",
        channels: "Mono (1)",
        format: "WAV with LINEAR16 encoding (lossless)",
        optimized: "Yes - Google Cloud Speech-to-Text optimal format",
      });
      console.log(
        "WAV file size:",
        (wavBuffer.byteLength / 1024).toFixed(2),
        "KB",
      );

      console.log("Converting to base64...");
      // Convert to base64
      const base64 = arrayBufferToBase64(wavBuffer);
      console.log("Base64 length:", base64.length, "characters");
      console.log("✅ Audio conversion complete!");

      resolve(base64);
    } catch (error) {
      console.error("❌ Error converting audio to LINEAR16:", error);
      console.error("Error stack:", error.stack);
      reject(
        new Error(
          `Audio conversion failed: ${error.message}. Please try recording a shorter audio clip.`,
        ),
      );
    }
  });
};

/**
 * Create WAV file from PCM data (LINEAR16 format)
 *
 * Creates a standard WAV file with LINEAR16 PCM encoding:
 * - Format: PCM (uncompressed, lossless)
 * - Sample Rate: 16 kHz (optimal for speech)
 * - Channels: Mono (1 channel)
 * - Bit Depth: 16-bit (LINEAR16 standard)
 *
 * This format is explicitly recognized by Google Cloud Speech-to-Text
 * and ensures optimal transcription accuracy.
 *
 * @param {Int16Array} pcmData - PCM audio data (16-bit signed integers)
 * @param {number} sampleRate - Sample rate (16000 Hz)
 * @param {number} numChannels - Number of channels (1 for mono)
 * @returns {ArrayBuffer} - WAV file as ArrayBuffer with proper headers
 */
const createWavFile = (pcmData, sampleRate, numChannels) => {
  const length = pcmData.length;
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, "RIFF");
  view.setUint32(4, 36 + length * 2, true); // File size - 8
  writeString(8, "WAVE");

  // fmt chunk - Explicitly set LINEAR16 (PCM) encoding
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size (16 for PCM)
  view.setUint16(20, 1, true); // audio format (1 = PCM/LINEAR16) - explicitly LINEAR16
  view.setUint16(22, numChannels, true); // number of channels (1 = mono)
  view.setUint32(24, sampleRate, true); // sample rate (16000 Hz - optimal for speech)
  view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
  view.setUint16(32, numChannels * 2, true); // block align (channels * bytes per sample)
  view.setUint16(34, 16, true); // bits per sample (16-bit depth for LINEAR16)

  // data chunk
  writeString(36, "data");
  view.setUint32(40, length * 2, true); // data chunk size

  // Write PCM data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    view.setInt16(offset, pcmData[i], true);
    offset += 2;
  }

  return buffer;
};

/**
 * Convert ArrayBuffer to base64 string
 * @param {ArrayBuffer} buffer - ArrayBuffer to convert
 * @returns {string} - Base64 encoded string
 */
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Get the test text for audio generation
 * Edit this text to test different phrases
 * @returns {string} - Test text to be converted to speech
 */
export const getTestText = () => {
  return "Hello, how are you doing? I am going there. Let's go. Let Let Let Let Let Let Let Let Let Let  Let  Letaaaaaaa  Let  Let  Let Let Creates Creates Creates Creates  ";
};

/**
 * Get test base64 audio string from file
 * This reads the base64 string from cb-base64-string.txt for testing
 * @returns {Promise<string>} - Base64 encoded audio string
 */
export const getTestBase64Audio = async () => {
  try {
    // Fetch the base64 string from the file
    const response = await fetch("/cb-base64-string.txt");
    if (!response.ok) {
      throw new Error(`Failed to fetch base64 string: ${response.status}`);
    }
    const base64String = await response.text();
    // Trim any whitespace/newlines
    return base64String.trim();
  } catch (error) {
    console.error("Error loading test base64 audio:", error);
    // Fallback: return empty string or throw error
    throw new Error(
      "Failed to load test base64 audio. Make sure cb-base64-string.txt is in the public folder.",
    );
  }
};

/**
 * Generate test audio in LINEAR16 WAV format (16kHz) for testing
 *
 * Optimized for Google Cloud Speech-to-Text best practices:
 * - Encoding: LINEAR16 (PCM) - lossless encoding
 * - Sample Rate: 16 kHz - optimal for speech
 * - Channels: Mono (1 channel)
 * - Bit Depth: 16-bit
 *
 * Uses Web Speech API to generate speech from text, then converts to LINEAR16 WAV
 * using the same conversion function as live recordings for consistency.
 *
 * @returns {Promise<string>} - Base64 encoded WAV audio string (LINEAR16 PCM, 16kHz, mono, 16-bit)
 */
export const generateHelloAudio = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("=== Generating Test Audio ===");
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)({
        sampleRate: 16000, // 16 kHz - optimal for speech recognition
      });

      // Use Web Speech API to generate test speech
      // Get test text from the exported function (you can edit getTestText() to change the text)
      const testText = getTestText();
      console.log("Test text:", testText);
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Create a MediaStreamDestination to capture the audio
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          console.log(
            "Speech generated, converting to base64 string (WEBM OPUS format)...",
          );
          // Convert to base64 (WEBM OPUS format - no format conversion needed for new API)
          const base64 = await blobToBase64(audioBlob);
          console.log("✅ Test audio converted to base64 string");
          resolve(base64);
        } catch (error) {
          console.error("Error converting test audio:", error);
          reject(error);
        }
      };

      // Start recording
      mediaRecorder.start();

      // Speak "Hello"
      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
        }, 100);
      };

      utterance.onerror = (error) => {
        mediaRecorder.stop();
        reject(error);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      // Fallback: Generate a simple tone-based "Hello" pattern
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)({
          sampleRate: 16000,
        });
        const duration = 0.5; // 0.5 seconds
        const sampleCount = Math.floor(16000 * duration);
        const buffer = audioContext.createBuffer(1, sampleCount, 16000);
        const data = buffer.getChannelData(0);

        // Generate a simple tone pattern for "Hello" (H-L-O pattern)
        for (let i = 0; i < sampleCount; i++) {
          const t = i / 16000;
          // Simple frequency pattern: 440Hz (A note) for "Hello"
          const frequency = 440;
          data[i] = Math.sin(2 * Math.PI * frequency * t) * 0.3;
        }

        // Use audiobuffer-to-wav library for faster conversion
        console.log(
          "Fallback: Creating LINEAR16 WAV from tone pattern using library...",
        );
        const wavBuffer = audioBufferToWav(buffer, {
          float32: false, // Use 16-bit PCM (LINEAR16) instead of 32-bit float
        });
        const base64 = arrayBufferToBase64(wavBuffer);
        console.log("✅ Fallback audio created in LINEAR16 WAV format");
        resolve(base64);
      } catch (fallbackError) {
        console.error("Fallback method also failed:", fallbackError);
        reject(fallbackError);
      }
    }
  });
};

/**
 * Upload audio and get transcription using the new API endpoint
 * @param {Blob} audioBlob - The audio blob to upload and transcribe
 * @returns {Promise<Object>} - Returns transcription text and requestId
 */
export const uploadAudioAndTranscribe = async (audioBlob) => {
  try {
    // Log audio blob details
    console.log("=== Audio Recording Details ===");
    console.log("Audio blob type:", audioBlob.type);
    console.log("Audio blob size:", (audioBlob.size / 1024).toFixed(2), "KB");
    console.log("Audio blob size (bytes):", audioBlob.size);

    // Convert WEBM/Opus audio blob to base64 string (no format conversion needed)
    console.log("Converting audio blob to base64 string (WEBM OPUS format)...");
    const base64Audio = await blobToBase64(audioBlob);

    console.log("✅ Base64 conversion complete");
    console.log("Base64 string length:", base64Audio.length, "characters");
    console.log(
      "Base64 preview (first 100 chars):",
      base64Audio.substring(0, 100),
    );
    console.log(
      "Base64 preview (last 100 chars):",
      base64Audio.substring(base64Audio.length - 100),
    );
    console.log("================================");

    // Call the speechDetectV2 API which detects language and transcribes
    // No need to pass sampleRate or encoding - API handles WEBM OPUS format
    const response = await speechDetectV2(base64Audio);

    console.log("=== Transcription Response ===");
    console.log("Detected Language:", response.detectedLanguage);
    console.log("Transcription Text:", response.transcriptionText);
    console.log("Text Length:", response.transcriptionText?.length || 0);
    console.log("==============================");

    // Return transcription text, requestId, and detected language if available
    return {
      text: response.transcriptionText || "",
      requestId: response.requestId || null,
      detectedLanguage: response.detectedLanguage || null,
    };
  } catch (error) {
    console.error("Error uploading and transcribing audio:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);

    // Provide more specific error messages
    if (error.response?.status === 502) {
      throw new Error(
        "Server error (502): The audio upload service is temporarily unavailable. Please try again later or contact support.",
      );
    } else if (error.response?.status === 413) {
      throw new Error(
        "Audio file too large. Please record a shorter audio clip.",
      );
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message ||
          "Invalid audio format. Please try recording again.",
      );
    }

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to upload and transcribe audio.",
    );
  }
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
