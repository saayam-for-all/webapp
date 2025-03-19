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
