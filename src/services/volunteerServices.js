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
