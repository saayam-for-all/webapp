import { useEffect, useRef } from "react";

const VerticalAd = () => {
  const hasPushedRef = useRef(false);

  useEffect(() => {
    if (
      window.location.hostname === "saayamforall.org" &&
      !hasPushedRef.current
    ) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasPushedRef.current = true;
      } catch (e) {
        console.error("Adsense error", e);
      }
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
