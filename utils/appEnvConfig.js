const APP_ENV_KEY = "appEnvironment";

export const setAppEnvironment = (env) => {
  if (!env) return;
  localStorage.setItem(APP_ENV_KEY, JSON.stringify(env));
};

export const getAppEnvironment = () => {
  try {
    return JSON.parse(localStorage.getItem(APP_ENV_KEY) || "null");
  } catch {
    return null;
  }
};

export const clearAppEnvironment = () => {
  localStorage.removeItem(APP_ENV_KEY);
};

export const getSpatialIntervalMs = () => {
  const env = getAppEnvironment();
  return Number(env?.spatial_interval_ms) || 5 * 60 * 1000;
};

export const getMinDistanceMeters = () => {
  const env = getAppEnvironment();
  return Number(env?.min_distance_meters) || 50;
};

export const getNotificationIntervalMs = () => {
  const env = getAppEnvironment();
  return Number(env?.notification_interval_ms) || 5 * 60 * 1000;
};
