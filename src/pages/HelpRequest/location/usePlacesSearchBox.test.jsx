import { renderHook, act } from "@testing-library/react";
import usePlacesSearchBox from "./usePlacesSearchBox";

describe("usePlacesSearchBox", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial empty suggestions", () => {
    const setLocation = jest.fn();
    const { result } = renderHook(() => usePlacesSearchBox(setLocation));
    expect(result.current.suggestions).toEqual([]);
  });

  it("does not fetch suggestions when query is less than 3 characters", async () => {
    const setLocation = jest.fn();
    const { result } = renderHook(() => usePlacesSearchBox(setLocation));

    await act(async () => {
      await result.current.handleSearchChange("ab");
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.suggestions).toEqual([]);
  });

  it("fetches suggestions from OpenStreetMap when query is 3+ characters", async () => {
    const mockSuggestions = [
      { display_name: "Kansas City, Missouri, USA" },
      { display_name: "Kansas, USA" },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockSuggestions),
    });

    const setLocation = jest.fn();
    const { result } = renderHook(() => usePlacesSearchBox(setLocation));

    await act(async () => {
      await result.current.handleSearchChange("Kansas");
      await new Promise((r) => setTimeout(r, 600)); // wait for debounce
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/search"),
      expect.any(Object),
    );
  });

  it("clears suggestions when query is less than 3 characters after having results", async () => {
    const setLocation = jest.fn();
    const { result } = renderHook(() => usePlacesSearchBox(setLocation));

    await act(async () => {
      await result.current.handleSearchChange("ab");
    });

    expect(result.current.suggestions).toEqual([]);
  });

  it("sets location and coordinates and clears suggestions when suggestion is selected", () => {
    const setLocation = jest.fn();
    const setCoordinates = jest.fn();
    const { result } = renderHook(() =>
      usePlacesSearchBox(setLocation, setCoordinates),
    );

    act(() => {
      result.current.handleSelectSuggestion({
        display_name: "Kansas City, Missouri, USA",
        lat: "39.0997",
        lon: "-94.5786",
      });
    });

    expect(setLocation).toHaveBeenCalledWith("Kansas City, Missouri, USA");
    expect(setCoordinates).toHaveBeenCalledWith({
      latitude: 39.0997,
      longitude: -94.5786,
    });
    expect(result.current.suggestions).toEqual([]);
  });

  it("does not reopen suggestions from a stale pending fetch after a suggestion is selected", async () => {
    const mockSuggestions = [{ display_name: "Kansas City, Missouri, USA" }];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockSuggestions),
    });
    const setLocation = jest.fn();
    const { result } = renderHook(() => usePlacesSearchBox(setLocation));

    // Start typing - this schedules a debounced fetch 500ms out
    await act(async () => {
      result.current.handleSearchChange("Kansas");
    });

    // User selects a suggestion immediately, before the debounce fires
    act(() => {
      result.current.handleSelectSuggestion({
        display_name: "Kansas City, Missouri, USA",
        lat: "39.0997",
        lon: "-94.5786",
      });
    });

    // Wait past the original debounce window - if the pending timer
    // wasn't cancelled, its fetch would resolve here and reopen the
    // suggestions list with stale results
    await act(async () => {
      await new Promise((r) => setTimeout(r, 700));
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.suggestions).toEqual([]);
  });

  it("handles fetch error gracefully", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const setLocation = jest.fn();
    const { result } = renderHook(() => usePlacesSearchBox(setLocation));

    await act(async () => {
      await result.current.handleSearchChange("Kansas");
      await new Promise((r) => setTimeout(r, 600));
    });

    expect(result.current.suggestions).toEqual([]);
  });
});
