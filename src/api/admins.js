import axios, { endpoints } from 'src/utils/axios';
// remove later
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const listAdmin = async (params) => {
  const res = await axios.get(endpoints.admin.list, { params });
  return res.data;
};

export const assignConnector = async (body) => {
  const res = await axios.put(endpoints.connector.assignConnector, body);
  return res.data;
};

export const oneClickLoginAdmin = async (id) => {
  const res = await axios.post(endpoints.admin.oneClickLoginAdmin(id));
  return res.data;
};