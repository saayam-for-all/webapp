import { getEnums } from "../services/requestServices";

/**
 * Fetches enums from the API and stores them in localStorage.
 * Only fetches if a valid auth token exists, to avoid 401 errors
 * that were previously causing an infinite reload loop.
 */
export const fetchAndStoreEnums = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  try {
    const enumsData = await getEnums();
    localStorage.setItem("enums", JSON.stringify(enumsData));
  } catch (error) {
    console.error("Failed to fetch enums:", error);
  }
};
