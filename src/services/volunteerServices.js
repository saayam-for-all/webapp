import api from "./api";
import endpoints from "./endpoints.json";

export const getVolunteerOrgsList = async () => {
  const response = await api.get(endpoints.GET_VOLUNTEER_ORGS_LIST);
  return response.data;
};
export const getVolunteerSkills = async () => {
  const response = await api.get(endpoints.GET_VOLUNTEER_SKILLS);
  return response.data;
};
export const createVolunteer = async (volunteerData) => {
  const response = await api.post(endpoints.CREATE_VOLUNTEER, volunteerData);
  return response.data;
};
export const updateVolunteer = async (volunteerData) => {
  const response = await api.put(endpoints.UPDATE_VOLUNTEER, volunteerData);
  return response.data;
};

export const getUserId = async (email) => {
  try {
    const response = await api.get(`${endpoints.GET_USER_ID}/${email}`);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error while fetching user ID";
    throw new Error(message);
  }
};

export const getVolunteersData = async () => {
  const { data } = await api.get(endpoints.GET_VOLUNTEERS_DATA);
  return Array.isArray(data?.body)
    ? data.body
    : Array.isArray(data)
      ? data
      : [];
};
