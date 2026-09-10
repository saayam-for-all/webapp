import useShowAds from "../../../hooks/useShowAds";
import AdSlot from "./AdSlot";

const HorizontalAd = () => {
  const showAds = useShowAds();

  if (!showAds) return null;

  return <AdSlot slot="2901014906" showLabel />;
};

export default HorizontalAd;
