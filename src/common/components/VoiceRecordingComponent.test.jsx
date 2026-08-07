import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Mocks ──────────────────────────────────────────────────────────────────────

// Mock howler — not needed for silence-detection tests
jest.mock("howler", () => ({
  Howl: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    unload: jest.fn(),
  })),
}));

// Mock audioServices
const mockUploadAudioAndTranscribe = jest.fn();
jest.mock("../../services/audioServices", () => ({
  uploadAudioAndTranscribe: (...args) => mockUploadAudioAndTranscribe(...args),
}));

// ── Helpers to build fake AudioContext / AudioBuffer ────────────────────────

/**
 * Build a minimal mock for window.AudioContext that returns channel data
 * with the given RMS energy level.
 *
 * @param {number} rms - desired RMS value of the fake audio (0 = total silence)
 */
function mockAudioContext(rms) {
  const sampleCount = 1000;
  // Each sample value s must satisfy: sqrt(N * s^2 / N) = rms  →  s = rms
  const amplitude = rms;
  const channelData = new Float32Array(sampleCount).fill(amplitude);

  const fakeAudioBuffer = { getChannelData: () => channelData };

  const fakeCtx = {
    decodeAudioData: jest.fn().mockResolvedValue(fakeAudioBuffer),
    close: jest.fn(),
  };

  window.AudioContext = jest.fn(() => fakeCtx);
  window.webkitAudioContext = jest.fn(() => fakeCtx);
  return fakeCtx;
}

// ── Mock MediaRecorder & getUserMedia ──────────────────────────────────────

let capturedOnDataAvailable;
let capturedOnStop;
let mockMediaRecorderInstance;

function setupMediaMocks() {
  mockMediaRecorderInstance = {
    start: jest.fn(),
    stop: jest.fn().mockImplementation(() => {
      if (capturedOnStop) capturedOnStop();
    }),
    pause: jest.fn(),
    resume: jest.fn(),
    state: "recording",
    ondataavailable: null,
    onstop: null,
  };

  // Capture callbacks when they are assigned
  Object.defineProperty(mockMediaRecorderInstance, "ondataavailable", {
    set(fn) {
      capturedOnDataAvailable = fn;
    },
    get() {
      return capturedOnDataAvailable;
    },
    configurable: true,
  });
  Object.defineProperty(mockMediaRecorderInstance, "onstop", {
    set(fn) {
      capturedOnStop = fn;
    },
    get() {
      return capturedOnStop;
    },
    configurable: true,
  });

  window.MediaRecorder = jest.fn(() => mockMediaRecorderInstance);
  window.MediaRecorder.isTypeSupported = jest.fn(() => true);

  const mockStream = { getTracks: () => [{ stop: jest.fn() }] };
  navigator.mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(mockStream),
  };
}

// ── Import component AFTER mocks are set up ────────────────────────────────

let VoiceRecordingComponent;
beforeAll(async () => {
  const mod = await import("./VoiceRecordingComponent");
  VoiceRecordingComponent = mod.default;
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("VoiceRecordingComponent — silence detection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMediaMocks();
    // Provide Blob.prototype.arrayBuffer for jsdom
    if (!Blob.prototype.arrayBuffer) {
      Blob.prototype.arrayBuffer = function () {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsArrayBuffer(this);
        });
      };
    }
    // Mock URL.createObjectURL / revokeObjectURL for jsdom
    if (!URL.createObjectURL) {
      URL.createObjectURL = jest.fn(() => "blob:mock-url");
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = jest.fn();
    }
  });

  it("shows no-speech error and does NOT call transcription API when audio is silent", async () => {
    // RMS = 0 → completely silent
    mockAudioContext(0);

    const onTranscriptionUpdate = jest.fn();
    const onAudioUploaded = jest.fn();

    render(
      <VoiceRecordingComponent
        onTranscriptionUpdate={onTranscriptionUpdate}
        onAudioUploaded={onAudioUploaded}
        maxRecordingSeconds={60}
      />,
    );

    // Click start recording
    const startBtn = screen.getByRole("button", { name: /start recording/i });
    await act(async () => {
      fireEvent.click(startBtn);
    });

    // Simulate a data chunk arriving (silent audio)
    const silentBlob = new Blob([new ArrayBuffer(100)], {
      type: "audio/webm",
    });
    await act(async () => {
      capturedOnDataAvailable({ data: silentBlob });
    });

    // Stop recording — triggers onstop handler
    const stopBtn = screen.getByRole("button", { name: /stop recording/i });
    await act(async () => {
      fireEvent.click(stopBtn);
    });

    // Wait for the silence detection to complete
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /no speech detected/i,
      );
    });

    // Transcription API should NOT have been called
    expect(mockUploadAudioAndTranscribe).not.toHaveBeenCalled();
    // Description should NOT be updated
    expect(onTranscriptionUpdate).not.toHaveBeenCalled();
  });

  it("calls transcription API normally when audio contains speech", async () => {
    // RMS = 0.1 → well above threshold (0.01)
    mockAudioContext(0.1);

    mockUploadAudioAndTranscribe.mockResolvedValue({
      text: "Hello world",
      detectedLanguage: "en",
      requestId: "req-123",
    });

    const onTranscriptionUpdate = jest.fn();
    const onAudioUploaded = jest.fn();

    render(
      <VoiceRecordingComponent
        onTranscriptionUpdate={onTranscriptionUpdate}
        onAudioUploaded={onAudioUploaded}
        maxRecordingSeconds={60}
      />,
    );

    // Start recording
    const startBtn = screen.getByRole("button", { name: /start recording/i });
    await act(async () => {
      fireEvent.click(startBtn);
    });

    // Simulate a data chunk
    const speechBlob = new Blob([new ArrayBuffer(100)], {
      type: "audio/webm",
    });
    await act(async () => {
      capturedOnDataAvailable({ data: speechBlob });
    });

    // Stop recording
    const stopBtn = screen.getByRole("button", { name: /stop recording/i });
    await act(async () => {
      fireEvent.click(stopBtn);
    });

    // Wait for transcription to complete
    await waitFor(() => {
      expect(mockUploadAudioAndTranscribe).toHaveBeenCalled();
    });

    // Description should be updated with transcription text
    expect(onTranscriptionUpdate).toHaveBeenCalledWith("Hello world");
  });
});
