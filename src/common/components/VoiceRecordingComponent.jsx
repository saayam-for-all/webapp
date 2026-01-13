import React, { useState, useRef, useEffect } from "react";
import {
  FiMic,
  FiMicOff,
  FiStopCircle,
  FiPlay,
  FiPause,
  FiAlertTriangle,
} from "react-icons/fi";
import { Howl } from "howler";
import {
  transcribeAudio,
  uploadAudioAndTranscribe,
} from "../../services/audioServices";

const VoiceRecordingComponent = ({
  onTranscriptionUpdate,
  onAudioUploaded,
  languageCode = "en-US",
  maxFileSizeMB = 10,
  descriptionLimit = 500,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState(false);
  const howlRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const mimeTypeRef = useRef("audio/webm");
  const transcriptionIntervalRef = useRef(null);
  const accumulatedTextRef = useRef("");
  const audioUrlRef = useRef(null); // Store audio URL for cleanup

  // Cleanup Howler instance when audioUrl changes
  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
      // Clean up Howler instance
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
      // Clean up local audio URL when component unmounts
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Try to find a supported MIME type
      let mimeType = "audio/webm;codecs=opus";
      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];

      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      mimeTypeRef.current = mimeType;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop live transcription interval
        if (transcriptionIntervalRef.current) {
          clearInterval(transcriptionIntervalRef.current);
          transcriptionIntervalRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeTypeRef.current,
        });
        setAudioBlob(audioBlob);

        // Check file size
        const fileSizeMB = audioBlob.size / (1024 * 1024);
        if (fileSizeMB > maxFileSizeMB) {
          setError(
            `Audio file size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxFileSizeMB}MB)`,
          );
          setIsProcessing(false);
          return;
        }

        setIsProcessing(true);

        try {
          // Create local URL for playback
          const localAudioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(localAudioUrl);
          audioUrlRef.current = localAudioUrl;

          // Upload audio and get transcription using new API
          console.log("=== Starting Audio Upload ===");
          console.log("Audio format:", audioBlob.type);
          console.log("Audio size:", (audioBlob.size / 1024).toFixed(2), "KB");

          const transcriptionResult = await uploadAudioAndTranscribe(audioBlob);

          // Create upload result object with requestId
          const uploadResult = {
            url: localAudioUrl,
            requestId: transcriptionResult.requestId,
            fileName: `recording-${Date.now()}.webm`,
            size: audioBlob.size,
          };

          console.log(
            "✅ Audio uploaded and transcribed. Request ID:",
            transcriptionResult.requestId,
          );
          console.log(
            "Transcription text:",
            transcriptionResult.text || "(empty)",
          );
          console.log("=============================");

          if (onAudioUploaded) {
            onAudioUploaded(uploadResult);
          }

          // Use transcription from API response
          if (transcriptionResult && transcriptionResult.text) {
            const finalText = transcriptionResult.text.substring(
              0,
              descriptionLimit,
            );
            accumulatedTextRef.current = finalText;
            setTranscriptionError(false);
            if (onTranscriptionUpdate) {
              onTranscriptionUpdate(finalText);
            }
          } else if (accumulatedTextRef.current) {
            // Fallback to accumulated live transcription if API transcription is empty
            const truncatedText = accumulatedTextRef.current.substring(
              0,
              descriptionLimit,
            );
            setTranscriptionError(false);
            if (onTranscriptionUpdate) {
              onTranscriptionUpdate(truncatedText);
            }
          } else {
            // No transcription available
            setTranscriptionError(true);
          }
        } catch (err) {
          console.error("❌ Error processing audio:", err);
          console.error("Error details:", {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            headers: err.response?.headers,
          });
          console.error("Audio blob that failed:", {
            type: audioBlob.type,
            size: audioBlob.size,
          });
          setError(err.message || "Failed to process audio");
          // Still try to use accumulated live transcription if available
          if (accumulatedTextRef.current) {
            const truncatedText = accumulatedTextRef.current.substring(
              0,
              descriptionLimit,
            );
            if (onTranscriptionUpdate) {
              onTranscriptionUpdate(truncatedText);
            }
          }
        } finally {
          setIsProcessing(false);
        }
      };

      // Reset accumulated text when starting new recording
      accumulatedTextRef.current = "";
      setTranscriptionError(false);
      setAudioUrl(null);
      setIsPlaying(false);
      setAudioBlob(null);
      // Stop any currently playing audio
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
        howlRef.current = null;
      }

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start live transcription - send chunks every 3 seconds
      transcriptionIntervalRef.current = setInterval(() => {
        // Use refs to avoid stale closure issues
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          performLiveTranscription();
        }
      }, 3000); // Transcribe every 3 seconds during recording
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop live transcription interval
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
        transcriptionIntervalRef.current = null;
      }

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Pause live transcription
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
        transcriptionIntervalRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Resume live transcription
      if (!transcriptionIntervalRef.current && mediaRecorderRef.current) {
        transcriptionIntervalRef.current = setInterval(() => {
          // Use refs to avoid stale closure issues
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
          ) {
            performLiveTranscription();
          }
        }, 3000);
      }
    }
  };

  // Live transcription: send audio chunks periodically during recording
  const performLiveTranscription = async () => {
    if (audioChunksRef.current.length === 0) return;

    try {
      // Get cumulative blob of all audio so far
      const cumulativeBlob = new Blob(audioChunksRef.current, {
        type: mimeTypeRef.current,
      });

      // Only transcribe if we have enough audio (at least 2 seconds worth)
      if (cumulativeBlob.size < 10000) return; // Skip if too small

      const transcription = await transcribeAudio(
        cumulativeBlob,
        languageCode,
        true, // isStreaming = true for live transcription
      );

      if (transcription && transcription.text) {
        // For live transcription, we want to append new text
        // The backend should return only the new transcribed portion
        const newText = transcription.text;

        // If backend returns full transcription, extract only new parts
        // Otherwise, append the new text
        if (newText.length > accumulatedTextRef.current.length) {
          // Backend returned full cumulative transcription
          accumulatedTextRef.current = newText;

          // Update description field with accumulated text (truncated to limit)
          const updatedText = accumulatedTextRef.current.substring(
            0,
            descriptionLimit,
          );
          if (onTranscriptionUpdate) {
            onTranscriptionUpdate(updatedText);
          }
        } else {
          // Backend returned only new portion, append it
          accumulatedTextRef.current += " " + newText;
          const updatedText = accumulatedTextRef.current.substring(
            0,
            descriptionLimit,
          );
          if (onTranscriptionUpdate) {
            onTranscriptionUpdate(updatedText);
          }
        }
      }
    } catch (err) {
      // Don't show errors for live transcription failures to avoid spam
      console.log("Live transcription error (silent):", err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    try {
      if (isPlaying) {
        // Pause playback
        if (howlRef.current) {
          howlRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        // If Howl instance doesn't exist or was unloaded, create a new one
        if (!howlRef.current) {
          howlRef.current = new Howl({
            src: [audioUrl],
            html5: true, // Use HTML5 Audio for blob URLs
            format: ["webm", "ogg", "mp3", "m4a", "wav"], // Support multiple formats
            volume: 1.0,
            onplay: () => {
              console.log("Audio playback started");
              setIsPlaying(true);
            },
            onpause: () => {
              console.log("Audio playback paused");
              setIsPlaying(false);
            },
            onend: () => {
              console.log("Audio playback ended");
              setIsPlaying(false);
            },
            onloaderror: (id, error) => {
              console.error("Howler load error:", error);
              setError(
                "Failed to load audio. The audio format may not be supported.",
              );
              setIsPlaying(false);
            },
            onplayerror: (id, error) => {
              console.error("Howler play error:", error);
              setError(
                "Could not play audio. Please check browser audio permissions.",
              );
              setIsPlaying(false);
              // Try to recover by unloading and reloading
              if (howlRef.current) {
                howlRef.current.once("unlock", () => {
                  if (howlRef.current) {
                    howlRef.current.play();
                  }
                });
              }
            },
          });
        }

        // Play the audio
        const soundId = howlRef.current.play();
        console.log("Playing audio with Howler, sound ID:", soundId);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setError("Could not play audio. Please check browser audio permissions.");
      setIsPlaying(false);
    }
  };

  const Tooltip = ({ children, text }) => {
    return (
      <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!isRecording ? (
        <Tooltip text="Start recording">
          <button
            type="button"
            onClick={startRecording}
            disabled={isProcessing}
            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <FiMic size={20} />
          </button>
        </Tooltip>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-red-500 text-white rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">
              {formatTime(recordingTime)}
            </span>
          </div>
          {isPaused ? (
            <Tooltip text="Resume recording">
              <button
                type="button"
                onClick={resumeRecording}
                className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
              >
                <FiMic size={20} />
              </button>
            </Tooltip>
          ) : (
            <Tooltip text="Pause recording">
              <button
                type="button"
                onClick={pauseRecording}
                className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors shadow-md"
              >
                <FiMicOff size={20} />
              </button>
            </Tooltip>
          )}
          <Tooltip text="Stop recording">
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
            >
              <FiStopCircle size={20} />
            </button>
          </Tooltip>
        </div>
      )}
      {isProcessing && (
        <span className="text-xs text-gray-600">Processing...</span>
      )}
      {error && (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
      {transcriptionError && !isProcessing && (
        <Tooltip text="Transcription unavailable. You can type the description manually.">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full cursor-help shadow-md">
            <FiAlertTriangle size={20} />
          </div>
        </Tooltip>
      )}
      {audioUrl && !isProcessing && (
        <Tooltip text={isPlaying ? "Pause playback" : "Play recording"}>
          <button
            type="button"
            onClick={togglePlayback}
            className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
          >
            {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default VoiceRecordingComponent;
