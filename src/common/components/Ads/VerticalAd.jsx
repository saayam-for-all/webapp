import { useEffect, useRef } from "react";

const AD_ALLOWED_HOSTNAMES = ["saayamforall.org", "www.saayamforall.org"];

const VerticalAd = () => {
  const hasPushedRef = useRef(false);

  useEffect(() => {
    if (
      hasPushedRef.current ||
      !AD_ALLOWED_HOSTNAMES.includes(window.location.hostname)
    ) {
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
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-3674612346757233"
      data-ad-slot="9177881705"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default VerticalAd;
