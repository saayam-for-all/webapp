import { renderHook } from "@testing-library/react";
import { useMatches } from "react-router-dom";
import useShowAds from "./useShowAds";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useMatches: jest.fn(),
}));

describe("useShowAds", () => {
  it("returns true when a match has leaveAdSpace: true", () => {
    useMatches.mockReturnValue([{ handle: { leaveAdSpace: true } }]);
    const { result } = renderHook(() => useShowAds());
    expect(result.current).toBe(true);
  });

  it("returns false when no match has leaveAdSpace set", () => {
    useMatches.mockReturnValue([{ handle: {} }]);
    const { result } = renderHook(() => useShowAds());
    expect(result.current).toBe(false);
  });

  it("returns false when handle is undefined", () => {
    useMatches.mockReturnValue([{ handle: undefined }]);
    const { result } = renderHook(() => useShowAds());
    expect(result.current).toBe(false);
  });

  it("returns false when matches array is empty", () => {
    useMatches.mockReturnValue([]);
    const { result } = renderHook(() => useShowAds());
    expect(result.current).toBe(false);
  });

  it("returns true when any one match has leaveAdSpace: true", () => {
    useMatches.mockReturnValue([
      { handle: { leaveAdSpace: false } },
      { handle: { leaveAdSpace: true } },
    ]);
    const { result } = renderHook(() => useShowAds());
    expect(result.current).toBe(true);
  });
});
