import { StrictMode, act } from "react";
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

const AD_HOSTNAME = "saayamforall.org";
// Must match NO_AD_TIMEOUT_MS in AdSlot.jsx.
const NO_AD_TIMEOUT_MS = 5000;

const originalLocation = window.location;

const setHostname = (hostname) => {
  Object.defineProperty(window, "location", {
    value: { ...originalLocation, hostname },
    writable: true,
  });
};

// MutationObserver delivers records in a microtask, so a status change needs a
// flush before React has re-rendered.
const setAdStatus = async (ins, status) => {
  await act(async () => {
    ins.setAttribute("data-ad-status", status);
  });
};

const isCollapsed = (frame) => frame.className.includes("py-1");
const isHidden = (frame) => frame.className.includes("hidden");

afterEach(() => {
  Object.defineProperty(window, "location", {
    value: originalLocation,
    writable: true,
  });
  delete window.adsbygoogle;
});

describe.each([
  // Per issue #1706 spec: visible "Advertisement" label on the horizontal
  // ad only. VerticalAd is tested separately because it intentionally bypasses
  // AdSlot and renders the AdSense snippet directly.
  ["HorizontalAd", HorizontalAd, "2901014906", true],
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

describe("VerticalAd", () => {
  it("renders the AdSense snippet directly without an AdSlot frame", () => {
    const { container } = render(<VerticalAd />);

    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).toBeTruthy();
    expect(ins.getAttribute("data-ad-slot")).toBe("9177881705");
    expect(ins.parentElement).toBe(container);
    expect(screen.queryByRole("complementary")).toBeNull();
    expect(screen.queryByText("ADVERTISEMENT")).toBeNull();
  });

  it.each(["localhost", AD_HOSTNAME, "www.saayamforall.org"])(
    "pushes to adsbygoogle when mounted on %s",
    (hostname) => {
      setHostname(hostname);

      render(<VerticalAd />);

      expect(window.adsbygoogle).toHaveLength(1);
    },
  );
});

describe("AdSlot ad requests", () => {
  it("does not push to adsbygoogle on non-production hostnames", () => {
    setHostname("localhost");

    render(<AdSlot slot="123" />);

    expect(window.adsbygoogle).toBeUndefined();
  });

  it.each([AD_HOSTNAME, "www.saayamforall.org"])(
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

describe("AdSlot collapse", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setHostname(AD_HOSTNAME);
  });

  afterEach(() => {
    // Discard rather than run: firing a pending collapse timer here would set
    // state outside act() after the assertions, producing React warnings.
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("collapses a labelled slot to a strip when the ad is unfilled", async () => {
    const { container } = render(<AdSlot slot="123" showLabel />);
    const ins = container.querySelector("ins.adsbygoogle");

    await setAdStatus(ins, "unfilled");

    expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);
    // The label survives so the collapsed slot still reads as an ad space.
    expect(screen.getByText("ADVERTISEMENT")).toBeTruthy();
    // Never unmounted: a late creative must still have somewhere to land.
    expect(container.querySelector("ins.adsbygoogle")).toBeTruthy();
    expect(ins.style.display).toBe("none");
  });

  it("collapses an unlabelled slot to no visual footprint, keeping the ins mounted", async () => {
    const { container } = render(<AdSlot slot="123" />);
    const ins = container.querySelector("ins.adsbygoogle");

    await setAdStatus(ins, "unfilled");

    expect(isHidden(screen.getByRole("complementary", { hidden: true }))).toBe(
      true,
    );
    expect(container.querySelector("ins.adsbygoogle")).toBeTruthy();
  });

  it("stays expanded for unfill-optimized, which carries replacement content", async () => {
    const { container } = render(<AdSlot slot="123" showLabel />);
    const ins = container.querySelector("ins.adsbygoogle");

    await setAdStatus(ins, "unfill-optimized");
    act(() => jest.advanceTimersByTime(10000));

    const frame = screen.getByRole("complementary");
    expect(isCollapsed(frame)).toBe(false);
    expect(isHidden(frame)).toBe(false);
  });

  // Measured on production: a slot too narrow for any standard format gets
  // data-adsbygoogle-status="done" and NO data-ad-status at all. Keying the
  // timeout on the script having run would leave this frame expanded forever.
  it("collapses when the request resolves without any data-ad-status", () => {
    const { container } = render(<AdSlot slot="123" showLabel />);
    container
      .querySelector("ins.adsbygoogle")
      .setAttribute("data-adsbygoogle-status", "done");

    act(() => jest.advanceTimersByTime(10000));

    expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);
  });

  it("collapses when the AdSense script never runs at all", () => {
    render(<AdSlot slot="123" showLabel />);

    act(() => jest.advanceTimersByTime(NO_AD_TIMEOUT_MS));

    expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);
  });

  it("holds the frame open for the full timeout before collapsing", () => {
    render(<AdSlot slot="123" showLabel />);

    act(() => jest.advanceTimersByTime(NO_AD_TIMEOUT_MS - 1));
    expect(isCollapsed(screen.getByRole("complementary"))).toBe(false);

    act(() => jest.advanceTimersByTime(1));
    expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);
  });

  it.each(["filled", "unfill-optimized"])(
    "re-expands when a late %s arrives after the timeout collapsed it",
    async (status) => {
      const { container } = render(<AdSlot slot="123" showLabel />);
      const ins = container.querySelector("ins.adsbygoogle");

      act(() => jest.advanceTimersByTime(10000));
      expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);

      await setAdStatus(ins, status);

      expect(isCollapsed(screen.getByRole("complementary"))).toBe(false);
      expect(ins.style.display).toBe("block");
    },
  );

  // StrictMode runs setup -> cleanup -> setup. Cleanup disconnects the observer
  // and clears the timer, so the second setup has to reattach both; asserting
  // only the collapse would leave the observer half untested.
  it("keeps both the timer and the observer alive under StrictMode", async () => {
    const { container } = render(
      <StrictMode>
        <AdSlot slot="123" showLabel />
      </StrictMode>,
    );
    const ins = container.querySelector("ins.adsbygoogle");

    act(() => jest.advanceTimersByTime(NO_AD_TIMEOUT_MS));
    expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);

    await setAdStatus(ins, "filled");

    expect(isCollapsed(screen.getByRole("complementary"))).toBe(false);
  });

  it("never collapses off the ad hostname, where no status is ever coming", () => {
    setHostname("localhost");

    render(<AdSlot slot="123" showLabel />);
    act(() => jest.advanceTimersByTime(10000));

    const frame = screen.getByRole("complementary");
    expect(isCollapsed(frame)).toBe(false);
    expect(isHidden(frame)).toBe(false);
  });

  // The observer is attached on every host so the collapse can be exercised
  // locally by setting the attribute by hand in devtools.
  it("still honours an explicit unfilled status off the ad hostname", async () => {
    setHostname("localhost");

    const { container } = render(<AdSlot slot="123" showLabel />);
    await setAdStatus(container.querySelector("ins.adsbygoogle"), "unfilled");

    expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);
  });
});
