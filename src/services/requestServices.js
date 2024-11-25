import api from "./api";

export const getRequests = async () => {
  const response = await api.get("/requests", {
    withCredentials: true,
  });
  return response.data;
};
