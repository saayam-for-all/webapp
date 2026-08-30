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
 * with the given constant RMS energy level (all samples at the same amplitude).
 * This produces a temporal coefficient-of-variation of 0 — mimicking steady
 * background noise (fan, AC unit, etc.).
 *
 * Including `sampleRate` on the fake buffer is required for the temporal
 * variance check added in isSilentAudio.
 *
 * @param {number} rms        - desired RMS value of the fake audio (0 = silence)
 * @param {number} sampleRate - sample rate used for 100 ms frame computation
 */
function mockAudioContext(rms, sampleRate = 44100) {
  const durationSeconds = 2;
  const sampleCount = sampleRate * durationSeconds;
  // Constant-amplitude signal → RMS == amplitude, temporal CV == 0
  const channelData = new Float32Array(sampleCount).fill(rms);

  const fakeAudioBuffer = { getChannelData: () => channelData, sampleRate };

  const fakeCtx = {
    decodeAudioData: jest.fn().mockResolvedValue(fakeAudioBuffer),
    close: jest.fn(),
  };

  window.AudioContext = jest.fn(() => fakeCtx);
  window.webkitAudioContext = jest.fn(() => fakeCtx);
  return fakeCtx;
}

/**
 * Build a mock for window.AudioContext with alternating frame amplitudes to
 * simulate variable audio (e.g., actual speech).  Even 100 ms frames use
 * highRms, odd frames use lowRms.  This produces a high coefficient of
 * variation, indicating speech rather than steady background noise.
 *
 * @param {number} lowRms     - amplitude for odd frames
 * @param {number} highRms    - amplitude for even frames
 * @param {number} sampleRate - sample rate used for 100 ms frame computation
 */
function mockAudioContextVariableFrames(lowRms, highRms, sampleRate = 44100) {
  const durationSeconds = 2;
  const sampleCount = sampleRate * durationSeconds;
  const frameSamples = Math.floor(sampleRate * 0.1); // 100 ms frames
  const channelData = new Float32Array(sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    const frameIdx = Math.floor(i / frameSamples);
    channelData[i] = frameIdx % 2 === 0 ? highRms : lowRms;
  }

  const fakeAudioBuffer = { getChannelData: () => channelData, sampleRate };

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
  capturedOnDataAvailable = null;
  capturedOnStop = null;

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

/**
 * Shared helper that flushes the macrotask queue so that any Promise
 * continuations started by a previous test complete *before* we reset mock
 * call counts.  Without this flush an async chain from test N can call a mock
 * during test N+1, causing spurious "unexpected call" failures.
 */
async function flushPendingTasks() {
  // A 0-ms setTimeout fires after all queued microtasks, giving any
  // in-flight Promise chains from the previous test a chance to settle.
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Shared helper: start a recording, push one data chunk, then stop.
 * Returns after the stop button is clicked (async processing still pending).
 */
async function recordAndStop() {
  const startBtn = screen.getByRole("button", { name: /start recording/i });
  await act(async () => {
    fireEvent.click(startBtn);
  });

  const audioChunk = new Blob([new ArrayBuffer(100)], { type: "audio/webm" });
  await act(async () => {
    capturedOnDataAvailable({ data: audioChunk });
  });

  const stopBtn = screen.getByRole("button", { name: /stop recording/i });
  await act(async () => {
    fireEvent.click(stopBtn);
  });
}

/**
 * Shared common setup applied inside each beforeEach — keeps the three
 * describe blocks DRY while ensuring isolated state per test.
 */
async function commonSetup() {
  // Let any lingering Promises from the previous test settle before resetting
  // call counts so we don't see spurious cross-test mock calls.
  await flushPendingTasks();

  jest.clearAllMocks();
  setupMediaMocks();

  // Provide Blob.prototype.arrayBuffer for older jsdom environments
  if (!Blob.prototype.arrayBuffer) {
    Blob.prototype.arrayBuffer = function () {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsArrayBuffer(this);
      });
    };
  }

  // Mock URL helpers that jsdom doesn't implement
  URL.createObjectURL = jest.fn(() => "blob:mock-url");
  URL.revokeObjectURL = jest.fn();
}

// ── Import component AFTER mocks are set up ────────────────────────────────

let VoiceRecordingComponent;
beforeAll(async () => {
  const mod = await import("./VoiceRecordingComponent");
  VoiceRecordingComponent = mod.default;
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("VoiceRecordingComponent — silence detection", () => {
  beforeEach(async () => {
    await commonSetup();
  });

  it("shows no-speech error icon and does NOT call transcription API when audio is silent", async () => {
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

    await recordAndStop();

    // Wait for the silence detection to complete — compact error icon shown
    // (error message is now on the aria-label of the icon, not inline text)
    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute(
        "aria-label",
        expect.stringMatching(/no speech detected/i),
      );
    });

    // Transcription API should NOT have been called
    expect(mockUploadAudioAndTranscribe).not.toHaveBeenCalled();
    // Description should NOT be updated
    expect(onTranscriptionUpdate).not.toHaveBeenCalled();
  });

  it("calls transcription API normally when audio contains speech", async () => {
    // RMS = 0.1 → well above the background-noise upper threshold (0.06)
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

    await recordAndStop();

    // Wait for the FULL async chain to complete — play/delete/X buttons appear
    // once audioUrl is set and isProcessing is false. Waiting for this (rather
    // than only the API call) ensures no lingering Promises leak into the next
    // test.
    await waitFor(() => {
      expect(mockUploadAudioAndTranscribe).toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: /play recording|pause playback/i }),
      ).toBeInTheDocument();
    });

    // Description should be updated with transcription text
    expect(onTranscriptionUpdate).toHaveBeenCalledWith("Hello world");
  });
});

// ── Background-noise (temporal variance) detection ─────────────────────────

describe("VoiceRecordingComponent — background noise (temporal variance) detection", () => {
  beforeEach(async () => {
    await commonSetup();
  });

  it("treats steady background noise (e.g. fan) as silent — RMS in range but CV too low", async () => {
    // RMS = 0.02 sits between SILENCE_RMS_THRESHOLD (0.01) and
    // BACKGROUND_NOISE_RMS_UPPER (0.06).  Constant amplitude → CV = 0 < 0.25
    // → classified as background noise, not speech.
    mockAudioContext(0.02);

    const onTranscriptionUpdate = jest.fn();
    const onAudioUploaded = jest.fn();

    render(
      <VoiceRecordingComponent
        onTranscriptionUpdate={onTranscriptionUpdate}
        onAudioUploaded={onAudioUploaded}
        maxRecordingSeconds={60}
      />,
    );

    await recordAndStop();

    // Error icon should appear because audio is classified as background noise
    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute(
        "aria-label",
        expect.stringMatching(/no speech detected/i),
      );
    });

    // Transcription API must NOT be called for background noise
    expect(mockUploadAudioAndTranscribe).not.toHaveBeenCalled();
    expect(onTranscriptionUpdate).not.toHaveBeenCalled();
  });

  it("passes variable audio as potential speech — RMS in range but CV is high", async () => {
    // Alternating frame amplitudes: 0.05 (even frames) and 0.01 (odd frames).
    // Overall RMS ≈ 0.036, which is between 0.01 and 0.06, BUT the
    // coefficient of variation ≈ 0.67 >> 0.25 → classified as speech.
    mockAudioContextVariableFrames(0.01, 0.05);

    mockUploadAudioAndTranscribe.mockResolvedValue({
      text: "Variable signal speech",
      detectedLanguage: "en",
      requestId: "req-456",
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

    await recordAndStop();

    // Transcription API SHOULD be called since audio is variable (speech-like)
    await waitFor(() => {
      expect(mockUploadAudioAndTranscribe).toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: /play recording|pause playback/i }),
      ).toBeInTheDocument();
    });

    expect(onTranscriptionUpdate).toHaveBeenCalledWith(
      "Variable signal speech",
    );
  });
});

// ── Close / Cancel (X) button ─────────────────────────────────────────────

describe("VoiceRecordingComponent — Close / Cancel (X) button", () => {
  beforeEach(async () => {
    await commonSetup();
  });

  it("shows Close button after successful transcription and dismisses WITHOUT clearing transcribed text", async () => {
    // RMS = 0.1 → above BACKGROUND_NOISE_RMS_UPPER → treated as speech
    mockAudioContext(0.1);

    mockUploadAudioAndTranscribe.mockResolvedValue({
      text: "Keep this text",
      detectedLanguage: "en",
      requestId: "req-789",
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

    await recordAndStop();

    // Wait for full processing — play/delete/X buttons should all appear
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /close recorder/i }),
      ).toBeInTheDocument();
    });

    // Transcription text was written to parent
    expect(onTranscriptionUpdate).toHaveBeenCalledWith("Keep this text");
    const callsBefore = onTranscriptionUpdate.mock.calls.length;

    // Click the Close (X) button
    const closeBtn = screen.getByRole("button", { name: /close recorder/i });
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    // onAudioUploaded must be called with null (audio cleaned up)
    expect(onAudioUploaded).toHaveBeenLastCalledWith(null);

    // onTranscriptionUpdate must NOT be called again — transcribed text preserved
    expect(onTranscriptionUpdate).toHaveBeenCalledTimes(callsBefore);

    // Recorder should return to idle — mic button visible, Close button gone
    expect(
      screen.getByRole("button", { name: /start recording/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /close recorder/i }),
    ).not.toBeInTheDocument();
  });

  it("shows Close button in error state and dismisses cleanly back to idle mic button", async () => {
    // Silent audio → error state
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

    await recordAndStop();

    // Wait for error state — error icon and Close button should both appear
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /close recorder/i }),
      ).toBeInTheDocument();
    });

    // Click the Close (X) button to dismiss the error
    const closeBtn = screen.getByRole("button", { name: /close recorder/i });
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    // Error state should be cleared
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /close recorder/i }),
    ).not.toBeInTheDocument();

    // Recorder returns to idle state — mic button should be visible
    expect(
      screen.getByRole("button", { name: /start recording/i }),
    ).toBeInTheDocument();

    // Transcription text must not be cleared (was never set, so 0 calls)
    expect(onTranscriptionUpdate).not.toHaveBeenCalled();
  });

  it("does NOT show Close button while a recording is in progress", async () => {
    mockAudioContext(0.1);

    render(
      <VoiceRecordingComponent
        onTranscriptionUpdate={jest.fn()}
        onAudioUploaded={jest.fn()}
        maxRecordingSeconds={60}
      />,
    );

    // Start recording
    const startBtn = screen.getByRole("button", { name: /start recording/i });
    await act(async () => {
      fireEvent.click(startBtn);
    });

    // While recording is active, Close button should NOT be visible
    expect(
      screen.queryByRole("button", { name: /close recorder/i }),
    ).not.toBeInTheDocument();

    // Stop to cleanup (trigger onstop so the component settles before unmount)
    const stopBtn = screen.getByRole("button", { name: /stop recording/i });
    await act(async () => {
      fireEvent.click(stopBtn);
    });
  });
});
