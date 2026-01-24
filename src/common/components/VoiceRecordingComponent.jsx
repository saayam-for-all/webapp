import React, { useState, useRef, useEffect } from "react";
import {
  FiMic,
  FiMicOff,
  FiStopCircle,
  FiPlay,
  FiPause,
  FiAlertTriangle,
  FiTrash2,
} from "react-icons/fi";
import { Howl } from "howler";
import {
  uploadAudioAndTranscribe,
  blobToBase64,
} from "../../services/audioServices";
import { speechDetectV2 } from "../../services/audioServices";

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
          const transcriptionResult = await uploadAudioAndTranscribe(audioBlob);

          // Create upload result object with requestId and audio blob
          const uploadResult = {
            url: localAudioUrl,
            requestId: transcriptionResult.requestId,
            fileName: `recording-${Date.now()}.webm`,
            size: audioBlob.size,
            audioBlob: audioBlob, // Include blob for later submission
            detectedLanguage: transcriptionResult.detectedLanguage || null, // Include detected language
          };

          if (onAudioUploaded) {
            onAudioUploaded(uploadResult);
          }

          // Use transcription from speechDetectV2 API response
          // The transcript is in the detected language (e.g., Hindi: "क्या मेरी आवाज आ रही है")
          if (transcriptionResult && transcriptionResult.text) {
            const finalText = transcriptionResult.text.substring(
              0,
              descriptionLimit,
            );
            accumulatedTextRef.current = finalText;
            setTranscriptionError(false);

            // Update description field with the transcript from speechDetectV2
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
  // Uses speechDetectV2 API which auto-detects language and returns transcript
  const performLiveTranscription = async () => {
    if (audioChunksRef.current.length === 0) return;

    try {
      // Get cumulative blob of all audio so far
      const cumulativeBlob = new Blob(audioChunksRef.current, {
        type: mimeTypeRef.current,
      });

      // Only transcribe if we have enough audio (at least 2 seconds worth)
      if (cumulativeBlob.size < 10000) return; // Skip if too small

      // Convert audio blob to base64 for speechDetectV2 API
      const base64Audio = await blobToBase64(cumulativeBlob);

      // Call speechDetectV2 API which auto-detects language and transcribes
      const response = await speechDetectV2(base64Audio);

      if (response && response.transcriptionText) {
        // speechDetectV2 returns full cumulative transcription in detected language
        // e.g., Hindi: "क्या मेरी आवाज आ रही है" or English: "can you hear me hello hello hello"
        const newText = response.transcriptionText;

        // Update accumulated text with the full transcription (in detected language)
        accumulatedTextRef.current = newText;

        // Update description field with accumulated text (truncated to limit)
        const updatedText = accumulatedTextRef.current.substring(
          0,
          descriptionLimit,
        );

        // Update description field with transcript from speechDetectV2
        if (onTranscriptionUpdate) {
          onTranscriptionUpdate(updatedText);
        }
      } else {
      }
    } catch (err) {
      // Don't show errors for live transcription failures to avoid spam
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
              setIsPlaying(true);
            },
            onpause: () => {
              setIsPlaying(false);
            },
            onend: () => {
              setIsPlaying(false);
            },
            onloaderror: (id, error) => {
              setError(
                "Failed to load audio. The audio format may not be supported.",
              );
              setIsPlaying(false);
            },
            onplayerror: (id, error) => {
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
        howlRef.current.play();
      }
    } catch (error) {
      setError("Could not play audio. Please check browser audio permissions.");
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    // Stop playback if playing
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }

    // Clean up audio URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    // Reset state
    setAudioUrl(null);
    setAudioBlob(null);
    setIsPlaying(false);
    setError("");
    setTranscriptionError(false);
    accumulatedTextRef.current = "";
    audioChunksRef.current = [];

    // Notify parent component
    if (onAudioUploaded) {
      onAudioUploaded(null);
    }

    // Clear description if it was from transcription
    if (onTranscriptionUpdate) {
      onTranscriptionUpdate("");
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
      {/* Show record button only when not recording and no audio exists */}
      {!isRecording && !audioUrl && (
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
      )}

      {/* Show recording controls and visual feedback while recording */}
      {isRecording && (
        <div className="flex items-center gap-2">
          {/* Visual feedback: Pulsing red indicator with timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-full shadow-md animate-pulse">
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-xs font-semibold">
              Recording: {formatTime(recordingTime)}
            </span>
          </div>

          {/* Pause/Resume button */}
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

          {/* Stop button */}
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

      {/* Processing indicator */}
      {isProcessing && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 animate-pulse">
            Processing audio...
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}

      {/* Transcription error indicator */}
      {transcriptionError && !isProcessing && (
        <Tooltip text="Transcription unavailable. You can type the description manually.">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full cursor-help shadow-md">
            <FiAlertTriangle size={20} />
          </div>
        </Tooltip>
      )}

      {/* Playback and Delete controls - shown after recording stops and audio is ready */}
      {audioUrl && !isProcessing && !isRecording && (
        <div className="flex items-center gap-2">
          <Tooltip text={isPlaying ? "Pause playback" : "Play recording"}>
            <button
              type="button"
              onClick={togglePlayback}
              className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
            >
              {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
            </button>
          </Tooltip>

          <Tooltip text="Delete recording">
            <button
              type="button"
              onClick={deleteRecording}
              className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
            >
              <FiTrash2 size={18} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default VoiceRecordingComponent;
