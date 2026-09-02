import { StrictMode, act } from "react";
import { render, screen } from "@testing-library/react";
import useShowAds from "../../../hooks/useShowAds";
import HorizontalAd from "./HorizontalAd";
import SquareAd from "./SquareAd";
import VerticalAd from "./VerticalAd";
import bnCommon from "../../i18n/locales/bn/common.json";
import deCommon from "../../i18n/locales/de/common.json";
import enCommon from "../../i18n/locales/en/common.json";
import esCommon from "../../i18n/locales/es/common.json";
import frCommon from "../../i18n/locales/fr/common.json";
import hiCommon from "../../i18n/locales/hi/common.json";
import ptCommon from "../../i18n/locales/pt/common.json";
import ruCommon from "../../i18n/locales/ru/common.json";
import teCommon from "../../i18n/locales/te/common.json";
import zhCommon from "../../i18n/locales/zh/common.json";

jest.mock("../../../hooks/useShowAds", () => jest.fn());
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const AD_HOSTNAME = "saayamforall.org";
const NO_AD_TIMEOUT_MS = 5000;
const originalLocation = window.location;

const setHostname = (hostname) => {
  Object.defineProperty(window, "location", {
    value: { ...originalLocation, hostname },
    writable: true,
  });
};

const setAdStatus = async (ins, status) => {
  await act(async () => {
    ins.setAttribute("data-ad-status", status);
  });
};

const isCollapsed = (frame) => frame.className.includes("py-1");
const isHidden = (frame) => frame.className.includes("hidden");

beforeEach(() => {
  useShowAds.mockReturnValue(true);
});

afterEach(() => {
  Object.defineProperty(window, "location", {
    value: originalLocation,
    writable: true,
  });
  delete window.adsbygoogle;
});

describe("horizontal and square ad frames", () => {
  it("renders the labelled horizontal ad frame", () => {
    const { container } = render(<HorizontalAd />);

    expect(
      container.querySelector('ins[data-ad-slot="2901014906"]'),
    ).toBeTruthy();
    expect(
      screen.getByRole("complementary", { name: "ADVERTISEMENT" }),
    ).toBeTruthy();
    expect(screen.getByText("ADVERTISEMENT")).toBeTruthy();
  });

  it("renders the square ad frame without a visible label", () => {
    const { container } = render(<SquareAd />);

    expect(
      container.querySelector('ins[data-ad-slot="3303489520"]'),
    ).toBeTruthy();
    expect(
      screen.getByRole("complementary", { name: "ADVERTISEMENT" }),
    ).toBeTruthy();
    expect(screen.queryByText("ADVERTISEMENT")).toBeNull();
  });

  it("does not render a horizontal ad on routes where ads are disabled", () => {
    useShowAds.mockReturnValue(false);

    const { container } = render(<HorizontalAd />);

    expect(container.firstChild).toBeNull();
  });
});

describe.each([
  ["Bengali", bnCommon, "বিজ্ঞাপন"],
  ["German", deCommon, "Werbung"],
  ["English", enCommon, "Advertisement"],
  ["Spanish", esCommon, "Publicidad"],
  ["French", frCommon, "Publicité"],
  ["Hindi", hiCommon, "विज्ञापन"],
  ["Portuguese", ptCommon, "Publicidade"],
  ["Russian", ruCommon, "Реклама"],
  ["Telugu", teCommon, "ప్రకటన"],
  ["Chinese", zhCommon, "广告"],
])("Advertisement translation: %s", (_language, translations, expected) => {
  it("matches the production translation", () => {
    expect(translations.ADVERTISEMENT).toBe(expected);
  });
});

describe("vertical ads", () => {
  it("renders the AdSense snippet directly without a frame", () => {
    const { container } = render(<VerticalAd />);

    const ins = container.querySelector('ins[data-ad-slot="9177881705"]');
    expect(ins).toBeTruthy();
    expect(ins.parentElement).toBe(container);
    expect(screen.queryByRole("complementary")).toBeNull();
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

describe("horizontal ad requests", () => {
  it("does not push to adsbygoogle on non-production hostnames", () => {
    setHostname("localhost");

    render(<HorizontalAd />);

    expect(window.adsbygoogle).toBeUndefined();
  });

  it.each([AD_HOSTNAME, "www.saayamforall.org"])(
    "pushes exactly once on %s under StrictMode",
    (hostname) => {
      setHostname(hostname);

      render(
        <StrictMode>
          <HorizontalAd />
        </StrictMode>,
      );

      expect(window.adsbygoogle).toHaveLength(1);
    },
  );
});

describe("ad frame collapse", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setHostname(AD_HOSTNAME);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("collapses an unfilled horizontal ad to a labelled strip", async () => {
    const { container } = render(<HorizontalAd />);
    const ins = container.querySelector("ins.adsbygoogle");

    await setAdStatus(ins, "unfilled");

    expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);
    expect(screen.getByText("ADVERTISEMENT")).toBeTruthy();
    expect(container.querySelector("ins.adsbygoogle")).toBeTruthy();
    expect(ins.style.display).toBe("none");
  });

  it("hides an unfilled square frame while keeping its ins mounted", async () => {
    const { container } = render(<SquareAd />);
    const ins = container.querySelector("ins.adsbygoogle");

    await setAdStatus(ins, "unfilled");

    expect(isHidden(screen.getByRole("complementary", { hidden: true }))).toBe(
      true,
    );
    expect(container.querySelector("ins.adsbygoogle")).toBeTruthy();
  });

  it("collapses after timeout when AdSense provides no positive status", () => {
    render(<HorizontalAd />);

    act(() => jest.advanceTimersByTime(NO_AD_TIMEOUT_MS));

    expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);
  });

  it.each(["filled", "unfill-optimized"])(
    "re-expands when a late %s status arrives",
    async (status) => {
      const { container } = render(<HorizontalAd />);
      const ins = container.querySelector("ins.adsbygoogle");

      act(() => jest.advanceTimersByTime(NO_AD_TIMEOUT_MS));
      expect(isCollapsed(screen.getByRole("complementary"))).toBe(true);

      await setAdStatus(ins, status);

      expect(isCollapsed(screen.getByRole("complementary"))).toBe(false);
      expect(ins.style.display).toBe("block");
    },
  );

  it("does not time out on a non-production hostname", () => {
    setHostname("localhost");

    render(<HorizontalAd />);
    act(() => jest.advanceTimersByTime(NO_AD_TIMEOUT_MS));

    const frame = screen.getByRole("complementary");
    expect(isCollapsed(frame)).toBe(false);
    expect(isHidden(frame)).toBe(false);
  });
});
