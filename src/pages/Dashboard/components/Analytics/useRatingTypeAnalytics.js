import { useEffect, useState } from "react";
import { getOrgRatingTypeAnalytics } from "../../../../services/analyticsServices";
import { getRatingTypePayload, mapRatingTypeAnalytics } from "./ratingTypeData";

export const useRatingTypeAnalytics = ({
  enabled,
  dateRange,
  startDate,
  endDate,
  country,
}) => {
  const [request, setRequest] = useState(null);
  let requestKey = null;
  try {
    requestKey = JSON.stringify(
      getRatingTypePayload(dateRange, startDate, endDate, country),
    );
  } catch {
    // Invalid custom dates must not be sent to the backend.
  }

  useEffect(() => {
    if (!enabled || requestKey === null) return;
    let cancelled = false;
    setRequest({ key: requestKey, status: "loading" });
    const load = async () => {
      try {
        const response = await getOrgRatingTypeAnalytics(
          JSON.parse(requestKey),
        );
        if (!cancelled) {
          setRequest({ key: requestKey, status: "success", response });
        }
      } catch {
        if (!cancelled) setRequest({ key: requestKey, status: "error" });
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [enabled, requestKey]);

  if (!enabled) return { status: "idle" };
  if (requestKey === null) return { status: "invalid" };
  if (!request || request.key !== requestKey) return { status: "loading" };
  if (request.status !== "success") return { status: request.status };
  try {
    return {
      status: "success",
      data: mapRatingTypeAnalytics(request.response, dateRange),
    };
  } catch {
    return { status: "error" };
  }
};
