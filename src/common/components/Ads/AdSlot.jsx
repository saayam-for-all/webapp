import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const AD_CLIENT = "ca-pub-3674612346757233";
// AdSense serves creatives only on the registered production domain; pushing
// on other hosts just logs errors and skews reporting.
const AD_ALLOWED_HOSTNAMES = ["saayamforall.org", "www.saayamforall.org"];

const AdSlot = ({ slot, showLabel = false }) => {
  const { t } = useTranslation();
  // AdSense throws "already have ads in this slot" if the same <ins> is
  // pushed twice, which React re-mounts (e.g. StrictMode) would otherwise do.
  const hasPushedRef = useRef(false);

  useEffect(() => {
    if (hasPushedRef.current) {
      return;
    }
    if (!AD_ALLOWED_HOSTNAMES.includes(window.location.hostname)) {
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      hasPushedRef.current = true;
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <div
      role="complementary"
      aria-label={t("ADVERTISEMENT")}
      className="my-6 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-center [&_ins.adsbygoogle]:!bg-transparent"
    >
      {showLabel && (
        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {t("ADVERTISEMENT")}
        </span>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
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
