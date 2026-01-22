import { useEffect } from "react";

const HorizontalAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-3674612346757233"
      data-ad-slot="2901014906"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default HorizontalAd;
