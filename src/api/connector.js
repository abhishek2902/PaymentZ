import axios, { endpoints } from 'src/utils/axios';
// remove later
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const listConnector = async (params) => {

    // remove later
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  const res = await axios.get(endpoints.connector.list, { params });
  return res.data;
};

export const toggleConnector = async (connectorId, status) => {

    // remove later
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  const res = await axios.put(
    `${endpoints.connector.toggleConnector}/${connectorId}/${status}`
  );
  return res.data;
};


export const updateConnector = async (body) => {

  // remove later
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  const res = await axios.put(
    `${endpoints.connector.updateConnector}`,
     body);

  return res.data;
};