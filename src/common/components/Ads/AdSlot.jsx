import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const AD_CLIENT = "ca-pub-3674612346757233";
// AdSense serves creatives only on the registered production domain; pushing
// on other hosts just logs errors and skews reporting.
const AD_ALLOWED_HOSTNAMES = ["saayamforall.org", "www.saayamforall.org"];

// AdSense stamps data-ad-status on the <ins> once the request resolves.
// "unfill-optimized" means no ad was returned but AdSense substituted its own
// content, so the slot still has something to show — only "unfilled" is empty.
const POSITIVE_AD_STATUSES = ["filled", "unfill-optimized"];

// Waiting for an explicit "unfilled" is not enough: a slot too narrow for any
// standard format gets data-adsbygoogle-status="done" with no data-ad-status at
// all and no creative, and would otherwise sit expanded and empty forever. So
// the frame collapses unless the slot is positively showing something. The
// window is generous because a slow-but-successful ad would otherwise collapse
// and then re-expand, which reads as a flicker.
const NO_AD_TIMEOUT_MS = 5000;

const FRAME_BASE =
  "w-full rounded-lg border border-slate-200 bg-slate-50 text-center [&_ins.adsbygoogle]:!bg-transparent";
// Keep horizontal padding off until xl (1280px). At the 992px desktop rail
// threshold, <main> is about 744px wide; a 32px inset would leave only 712px
// and could prevent a standard 728px creative from fitting. At xl, <main> has
// enough room for both the inset and the creative.
const FRAME_EXPANDED = "my-6 py-4 px-0 xl:px-4";
// With no ad to show, shrink to a thin labelled strip rather than leaving a
// large empty box.
const FRAME_COLLAPSED = "my-2 py-1 px-0 xl:px-4";

const AdSlot = ({ slot, showLabel = false }) => {
  const { t } = useTranslation();
  const insRef = useRef(null);
  // AdSense throws "already have ads in this slot" if the same <ins> is
  // pushed twice, which React re-mounts (e.g. StrictMode) would otherwise do.
  const hasPushedRef = useRef(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) {
      return undefined;
    }

    const isAdHost = AD_ALLOWED_HOSTNAMES.includes(window.location.hostname);

    // Skip only the duplicate push, never the rest of the effect. StrictMode
    // runs setup -> cleanup -> setup, so an early return on the second setup
    // would leave the observer and timer detached after cleanup tore them down
    // — and that fails silently in the browser while tests stay green.
    if (isAdHost && !hasPushedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasPushedRef.current = true;
      } catch (e) {
        console.error("Adsense error", e);
      }
    }

    // Observed on every host, including non-production, so the collapse can be
    // exercised locally by setting data-ad-status by hand in devtools.
    const syncFromStatus = () => {
      const status = ins.getAttribute("data-ad-status");
      if (POSITIVE_AD_STATUSES.includes(status)) {
        setCollapsed(false);
      } else if (status === "unfilled") {
        setCollapsed(true);
      }
    };

    const observer = new MutationObserver(syncFromStatus);
    observer.observe(ins, { attributeFilter: ["data-ad-status"] });
    syncFromStatus();

    // Only meaningful where a request was actually made. Off the ad hostname no
    // status is ever coming, so timing out would collapse every frame.
    let timeoutId;
    if (isAdHost) {
      timeoutId = setTimeout(() => {
        const status = ins.getAttribute("data-ad-status");
        if (!POSITIVE_AD_STATUSES.includes(status)) {
          setCollapsed(true);
        }
      }, NO_AD_TIMEOUT_MS);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  // An unlabelled slot has nothing to show once collapsed, so it takes up no
  // space at all. The <ins> stays mounted either way: a creative arriving after
  // the timeout re-expands the frame through the observer above.
  let frameLayout = FRAME_EXPANDED;
  if (collapsed) {
    frameLayout = showLabel ? FRAME_COLLAPSED : "hidden";
  }

  return (
    <div
      role="complementary"
      aria-label={t("ADVERTISEMENT")}
      className={`${FRAME_BASE} ${frameLayout}`}
    >
      {showLabel && (
        <span
          className={`block text-[10px] font-semibold uppercase tracking-wider text-slate-400 ${
            collapsed ? "" : "mb-3"
          }`}
        >
          {t("ADVERTISEMENT")}
        </span>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: collapsed ? "none" : "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

AdSlot.propTypes = {
  slot: PropTypes.string.isRequired,
  showLabel: PropTypes.bool,
};

export default AdSlot;
