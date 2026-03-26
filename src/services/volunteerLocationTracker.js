import api from "./api";
import endpoints from "./endpoints.json";
import { getTokenPayload } from "./tokenService";
import { getUserId } from "./volunteerServices";

let intervalId = null;
let cachedSid = null;
let inFlight = false;

const LOCAL_KEY = "latestVolunteerLocation";
const DEFAULT_INTERVAL_MS = 5 * 60 * 1000;
const MIN_DISTANCE_METERS = 50;

const formatCoordinate = (value) => Number(Number(value).toFixed(4));

const getStoredLocalLocation = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "null");
  } catch {
    return null;
  }
};

const setStoredLocalLocation = ({
  latitude = null,
  longitude = null,
  address = "",
  mode = "address",
}) => {
  localStorage.setItem(
    LOCAL_KEY,
    JSON.stringify({
      latitude,
      longitude,
      address,
      mode,
      updatedAt: new Date().toISOString(),
    }),
  );
};

const toRadians = (value) => (value * Math.PI) / 180;

const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const hasLocationChanged = (
  oldLoc,
  newLoc,
  thresholdMeters = MIN_DISTANCE_METERS,
) => {
  if (
    oldLoc?.latitude == null ||
    oldLoc?.longitude == null ||
    newLoc?.latitude == null ||
    newLoc?.longitude == null
  ) {
    return true;
  }

  const distance = getDistanceMeters(
    Number(oldLoc.latitude),
    Number(oldLoc.longitude),
    Number(newLoc.latitude),
    Number(newLoc.longitude),
  );

  return distance >= thresholdMeters;
};

const getPersonalInfo = () => {
  try {
    return JSON.parse(localStorage.getItem("personalInfo") || "null");
  } catch {
    return null;
  }
};

const getAddressFromProfile = () => {
  const personalInfo = getPersonalInfo();
  if (!personalInfo) return "";

  const parts = [
    personalInfo.city,
    personalInfo.state,
    personalInfo.country,
    personalInfo.zipCode || personalInfo.postalCode,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter(Boolean);

  return parts.join(", ");
};

const getEmailFromToken = async () => {
  const payload = await getTokenPayload();
  return payload?.email || "";
};

const resolveSidOnce = async () => {
  if (cachedSid) return cachedSid;

  const email = await getEmailFromToken();
  if (!email) {
    throw new Error("Email missing in token payload");
  }

  const response = await getUserId(email);
  const sid =
    response?.data?.user_id || response?.user_id || response?.body?.user_id;

  if (!sid) {
    throw new Error("SID missing from getUserIdByEmail response");
  }

  cachedSid = sid;
  return sid;
};

const isVolunteerUser = async () => {
  const payload = await getTokenPayload();
  const groups = payload?.["cognito:groups"] || [];
  return Array.isArray(groups) && groups.includes("Volunteers");
};

const getBrowserPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  });

const updateVolunteerLocation = async (payload) => {
  const response = await api.post(endpoints.UPDATE_VOLUNTEER_LOCATION, payload);

  return {
    latitude:
      response?.data?.data?.latitude ??
      response?.data?.latitude ??
      payload.latitude ??
      null,
    longitude:
      response?.data?.data?.longitude ??
      response?.data?.longitude ??
      payload.longitude ??
      null,
    raw: response?.data,
  };
};

const checkAndSyncLocation = async () => {
  if (inFlight) return;

  try {
    inFlight = true;

    const user_id = await resolveSidOnce();
    const address = getAddressFromProfile();
    const storedLocation = getStoredLocalLocation();

    try {
      const browserPosition = await getBrowserPosition();

      const currentLocation = {
        latitude: formatCoordinate(browserPosition.latitude),
        longitude: formatCoordinate(browserPosition.longitude),
      };

      if (
        storedLocation?.mode === "coords" &&
        !hasLocationChanged(storedLocation, currentLocation)
      ) {
        return;
      }

      const updated = await updateVolunteerLocation({
        user_id,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      setStoredLocalLocation({
        latitude: formatCoordinate(updated.latitude),
        longitude: formatCoordinate(updated.longitude),
        address: "",
        mode: "coords",
      });
    } catch (geoError) {
      if (!address) {
        return;
      }

      if (
        storedLocation?.mode === "address" &&
        storedLocation?.address?.trim() === address.trim()
      ) {
        return;
      }

      await updateVolunteerLocation({
        user_id,
        address,
      });

      setStoredLocalLocation({
        latitude: null,
        longitude: null,
        address,
        mode: "address",
      });
    }
  } catch (error) {
    console.error("Volunteer location sync failed:", error);
  } finally {
    inFlight = false;
  }
};

export const startVolunteerLocationTracking = async ({
  intervalMs = DEFAULT_INTERVAL_MS,
} = {}) => {
  const volunteer = await isVolunteerUser();
  if (!volunteer) return;
  if (intervalId) return;

  await checkAndSyncLocation();

  intervalId = window.setInterval(() => {
    checkAndSyncLocation();
  }, intervalMs);
};

export const stopVolunteerLocationTracking = () => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }

  intervalId = null;
  inFlight = false;
  cachedSid = null;
};

export const syncVolunteerLocationNow = async () => {
  await checkAndSyncLocation();
};
