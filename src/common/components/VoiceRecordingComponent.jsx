import React, { useMemo, useRef, useEffect, useState } from "react";
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
import { uploadAudioAndTranscribe } from "../../services/audioServices";

const DEFAULT_MAX_RECORDING_SECONDS = 60;

const VoiceRecordingComponent = ({
  onTranscriptionUpdate,
  onAudioUploaded,
  maxFileSizeMB = 10,
  descriptionLimit = 500,
  maxRecordingSeconds = DEFAULT_MAX_RECORDING_SECONDS,
  showLanguage = true,
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
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  const howlRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const mimeTypeRef = useRef("audio/webm");
  const audioUrlRef = useRef(null);

  const clampedMaxSeconds = Math.max(
    1,
    Math.min(Number(maxRecordingSeconds) || DEFAULT_MAX_RECORDING_SECONDS, 60),
  );

  const languageDisplay = useMemo(() => {
    if (!detectedLanguage) return "";

    const base = String(detectedLanguage).split("-")[0];

    try {
      if (typeof Intl !== "undefined" && Intl.DisplayNames) {
        const dn = new Intl.DisplayNames([navigator.language || "en"], {
          type: "language",
        });
        return dn.of(base) || base;
      }
    } catch (e) {
      // ignore
    }

    return base;
  }, [detectedLanguage]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    const canStop = mr && mr.state && mr.state !== "inactive";

    setIsRecording(false);
    setIsPaused(false);
    clearTimer();

    if (canStop) {
      mr.stop();
    }

    stopStream();
  };

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
      clearTimer();
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    try {
      setError("");
      setTranscriptionError(false);
      setDetectedLanguage(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const nextBlob = new Blob(audioChunksRef.current, {
          type: mimeTypeRef.current,
        });
        setAudioBlob(nextBlob);

        const fileSizeMB = nextBlob.size / (1024 * 1024);
        if (fileSizeMB > maxFileSizeMB) {
          setError(
            `Audio file size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxFileSizeMB}MB).`,
          );
          setIsProcessing(false);
          return;
        }

        setIsProcessing(true);

        try {
          const localAudioUrl = URL.createObjectURL(nextBlob);
          setAudioUrl(localAudioUrl);
          audioUrlRef.current = localAudioUrl;

          const transcriptionResult = await uploadAudioAndTranscribe(nextBlob);

          const dl = transcriptionResult?.detectedLanguage || null;
          setDetectedLanguage(dl);

          const uploadResult = {
            url: localAudioUrl,
            requestId: transcriptionResult?.requestId || null,
            fileName: `recording-${Date.now()}.webm`,
            size: nextBlob.size,
            audioBlob: nextBlob,
            detectedLanguage: dl,
          };

          if (onAudioUploaded) onAudioUploaded(uploadResult);

          const text = transcriptionResult?.text || "";
          if (text) {
            const finalText = text.substring(0, descriptionLimit);
            setTranscriptionError(false);
            if (onTranscriptionUpdate) onTranscriptionUpdate(finalText);
          } else {
            setTranscriptionError(true);
          }
        } catch (err) {
          setError(err?.message || "Failed to process audio");
          setTranscriptionError(true);
        } finally {
          setIsProcessing(false);
        }
      };

      // reset local state for new recording
      setAudioUrl(null);
      setIsPlaying(false);
      setAudioBlob(null);
      audioChunksRef.current = [];

      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
        howlRef.current = null;
      }

      mediaRecorder.start(1000);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      clearTimer();
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          if (next >= clampedMaxSeconds) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const pauseRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === "recording") {
      mr.pause();
      setIsPaused(true);
      clearTimer();
    }
  };

  const resumeRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === "paused") {
      mr.resume();
      setIsPaused(false);

      clearTimer();
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          if (next >= clampedMaxSeconds) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
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
        if (howlRef.current) {
          howlRef.current.pause();
          setIsPlaying(false);
        }
        return;
      }

      if (!howlRef.current) {
        howlRef.current = new Howl({
          src: [audioUrl],
          html5: true,
          format: ["webm", "ogg", "mp3", "m4a", "wav"],
          volume: 1.0,
          onplay: () => setIsPlaying(true),
          onpause: () => setIsPlaying(false),
          onend: () => setIsPlaying(false),
          onloaderror: () => {
            setError(
              "Failed to load audio. The audio format may not be supported.",
            );
            setIsPlaying(false);
          },
          onplayerror: () => {
            setError(
              "Could not play audio. Please check browser audio permissions.",
            );
            setIsPlaying(false);
          },
        });
      }

      howlRef.current.play();
    } catch (e) {
      setError("Could not play audio. Please check browser audio permissions.");
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setAudioUrl(null);
    setAudioBlob(null);
    setIsPlaying(false);
    setError("");
    setTranscriptionError(false);
    setDetectedLanguage(null);
    audioChunksRef.current = [];

    if (onAudioUploaded) onAudioUploaded(null);
    if (onTranscriptionUpdate) onTranscriptionUpdate("");
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

  const showCountdownWarning =
    isRecording && recordingTime >= Math.max(0, clampedMaxSeconds - 10);

  return (
    <div
      className="flex items-center gap-3 border border-gray-300 rounded-lg bg-white shadow-sm px-2 py-1"
      aria-label="Voice recording options"
    >
      {showLanguage && detectedLanguage && (
        <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
          <span className="text-xs text-gray-600">Language:</span>
          <span className="text-xs font-medium text-gray-800">
            {languageDisplay}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {!isRecording && !audioUrl && (
          <Tooltip text="Start recording">
            <button
              type="button"
              onClick={startRecording}
              disabled={isProcessing}
              className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
              aria-label="Start recording"
            >
              <FiMic size={20} />
            </button>
          </Tooltip>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 text-white rounded-full shadow-md animate-pulse ${
                showCountdownWarning ? "bg-orange-500" : "bg-red-500"
              }`}
              aria-live="polite"
            >
              <div className="relative">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs font-semibold">
                Recording: {formatTime(recordingTime)} /{" "}
                {formatTime(clampedMaxSeconds)}
              </span>
            </div>

            {isPaused ? (
              <Tooltip text="Resume recording">
                <button
                  type="button"
                  onClick={resumeRecording}
                  className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                  aria-label="Resume recording"
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
                  aria-label="Pause recording"
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
                aria-label="Stop recording"
              >
                <FiStopCircle size={20} />
              </button>
            </Tooltip>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 animate-pulse">
              Processing audio...
            </span>
          </div>
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

        {audioUrl && !isProcessing && !isRecording && (
          <div className="flex items-center gap-2">
            <Tooltip text={isPlaying ? "Pause playback" : "Play recording"}>
              <button
                type="button"
                onClick={togglePlayback}
                className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                aria-label={isPlaying ? "Pause playback" : "Play recording"}
              >
                {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
              </button>
            </Tooltip>

            <Tooltip text="Delete recording">
              <button
                type="button"
                onClick={deleteRecording}
                className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                aria-label="Delete recording"
              >
                <FiTrash2 size={18} />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecordingComponent;
