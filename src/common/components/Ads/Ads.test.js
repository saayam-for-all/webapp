import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import AdSlot from "./AdSlot";
import HorizontalAd from "./HorizontalAd";
import VerticalAd from "./VerticalAd";
import SquareAd from "./SquareAd";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const originalLocation = window.location;

const setHostname = (hostname) => {
  Object.defineProperty(window, "location", {
    value: { ...originalLocation, hostname },
    writable: true,
  });
};

afterEach(() => {
  Object.defineProperty(window, "location", {
    value: originalLocation,
    writable: true,
  });
  delete window.adsbygoogle;
});

describe.each([
  // Per issue #1706 spec: visible "Advertisement" label on the horizontal
  // ad only; the off-white frame applies to every format.
  ["HorizontalAd", HorizontalAd, "2901014906", true],
  ["VerticalAd", VerticalAd, "9177881705", false],
  ["SquareAd", SquareAd, "3303489520", false],
])("%s", (_name, AdComponent, slot, labelVisible) => {
  it("renders the Advertisement frame with its slot", () => {
    const { container } = render(<AdComponent />);

    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).toBeTruthy();
    expect(ins.getAttribute("data-ad-slot")).toBe(slot);
    expect(screen.getByRole("complementary")).toBeTruthy();
  });

  it(`${labelVisible ? "shows" : "does not show"} the visible Advertisement label`, () => {
    render(<AdComponent />);

    if (labelVisible) {
      expect(screen.getByText("ADVERTISEMENT")).toBeTruthy();
    } else {
      expect(screen.queryByText("ADVERTISEMENT")).toBeNull();
    }
  });
});

describe("AdSlot", () => {
  it("does not push to adsbygoogle on non-production hostnames", () => {
    setHostname("localhost");

    render(<AdSlot slot="123" />);

    expect(window.adsbygoogle).toBeUndefined();
  });

  it.each(["saayamforall.org", "www.saayamforall.org"])(
    "pushes to adsbygoogle exactly once on %s (even under StrictMode double effects)",
    (hostname) => {
      setHostname(hostname);

      render(
        <StrictMode>
          <AdSlot slot="123" />
        </StrictMode>,
      );

      expect(window.adsbygoogle).toHaveLength(1);
    },
  );

  it("exposes an accessible advertisement region", () => {
    render(<AdSlot slot="123" />);

    expect(
      screen.getByRole("complementary", { name: "ADVERTISEMENT" }),
    ).toBeTruthy();
  });
});
