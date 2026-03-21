import { fetchAuthSession } from "aws-amplify/auth";

export const getIdToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.idToken?.toString() || "";
  } catch {
    return "";
  }
};

export const getTokenPayload = async () => {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.idToken?.payload || null;
  } catch {
    return null;
  }
};
