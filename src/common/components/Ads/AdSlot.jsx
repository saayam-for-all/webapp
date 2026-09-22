import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const AD_CLIENT = "ca-pub-3674612346757233";
const AD_ALLOWED_HOSTNAMES = ["saayamforall.org", "www.saayamforall.org"];
const POSITIVE_AD_STATUSES = ["filled", "unfill-optimized"];
const NO_AD_TIMEOUT_MS = 5000;

const FRAME_BASE =
  "w-full rounded-lg border border-slate-200 bg-slate-50 text-center [&_ins.adsbygoogle]:!bg-transparent";
const FRAME_EXPANDED = "my-6 py-4 px-0 xl:px-4";
const FRAME_COLLAPSED = "my-2 py-1 px-0 xl:px-4";

const AdSlot = ({ slot, showLabel = false }) => {
  const { t } = useTranslation();
  const insRef = useRef(null);
  const hasPushedRef = useRef(false);
  const [collapsed, setCollapsed] = useState(false);
  const advertisementLabel = t("ADVERTISEMENT", {
    defaultValue: "ADVERTISEMENT",
  });

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) {
      return undefined;
    }

    const isAdHost = AD_ALLOWED_HOSTNAMES.includes(window.location.hostname);

    if (isAdHost && !hasPushedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasPushedRef.current = true;
      } catch (e) {
        console.error("Adsense error", e);
      }
    }

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

  let frameLayout = FRAME_EXPANDED;
  if (collapsed) {
    frameLayout = showLabel ? FRAME_COLLAPSED : "hidden";
  }

  return (
    <div
      role="complementary"
      aria-label={advertisementLabel}
      className={`${FRAME_BASE} ${frameLayout}`}
    >
      {showLabel && (
        <span
          className={`block text-[10px] font-semibold uppercase tracking-wider text-slate-400 ${
            collapsed ? "" : "mb-3"
          }`}
        >
          {advertisementLabel}
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
