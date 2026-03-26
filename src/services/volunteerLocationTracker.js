import { store } from "../redux/store";
import api from "./api";
import endpoints from "./endpoints.json";

let intervalId = null;
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

const getAuthState = () => store.getState()?.auth || {};

const getVolunteerUserId = () => {
  const authState = getAuthState();

  return authState?.user?.userDbId || "";
};

const isVolunteerUser = () => {
  const authState = getAuthState();
  const user = authState?.user || {};

  const rawGroups =
    user?.groups ??
    user?.group ??
    user?.cognitoGroups ??
    user?.["cognito:groups"] ??
    [];

  const normalizedGroups = Array.isArray(rawGroups)
    ? rawGroups
    : [rawGroups].filter(Boolean);

  return (
    normalizedGroups.includes("Volunteers") ||
    normalizedGroups.includes("Volunteer")
  );
};

const getBrowserPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      reject,
      { enableHighAccuracy: true, timeout: 15000 },
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
  };
};

const syncWithCoordinates = async ({ user_id, storedLocation }) => {
  const browserPosition = await getBrowserPosition();

  const currentLocation = {
    latitude: formatCoordinate(browserPosition.latitude),
    longitude: formatCoordinate(browserPosition.longitude),
  };

  const shouldSkipApi =
    storedLocation?.mode === "coords" &&
    !hasLocationChanged(storedLocation, currentLocation);

  if (shouldSkipApi) return;

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
};

const syncWithAddress = async ({ user_id, storedLocation }) => {
  const address = getAddressFromProfile();
  if (!address) return;

  const shouldSkipApi =
    storedLocation?.mode === "address" &&
    storedLocation?.address?.trim() === address.trim();

  if (shouldSkipApi) return;

  await updateVolunteerLocation({ user_id, address });

  setStoredLocalLocation({
    latitude: null,
    longitude: null,
    address,
    mode: "address",
  });
};

const checkAndSyncLocation = async () => {
  if (inFlight) return;

  try {
    inFlight = true;

    if (!isVolunteerUser()) return;

    const user_id = getVolunteerUserId();
    if (!user_id) return;

    const storedLocation = getStoredLocalLocation();

    try {
      await syncWithCoordinates({ user_id, storedLocation });
    } catch {
      await syncWithAddress({ user_id, storedLocation });
    }
  } finally {
    inFlight = false;
  }
};

export const startVolunteerLocationTracking = async ({
  intervalMs = DEFAULT_INTERVAL_MS,
} = {}) => {
  if (!isVolunteerUser()) return;
  if (intervalId) return;

  await checkAndSyncLocation();

  intervalId = window.setInterval(checkAndSyncLocation, intervalMs);
};

export const stopVolunteerLocationTracking = () => {
  if (intervalId) window.clearInterval(intervalId);
  intervalId = null;
  inFlight = false;
};

export const syncVolunteerLocationNow = async () => {
  await checkAndSyncLocation();
};
