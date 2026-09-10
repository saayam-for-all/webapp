import { useMatches } from "react-router-dom";

const useShowAds = () =>
  useMatches().some((match) => match.handle?.leaveAdSpace);

export default useShowAds;
