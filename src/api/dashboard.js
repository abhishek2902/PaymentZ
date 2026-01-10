import axios, { endpoints } from 'src/utils/axios';

export const dashboardFetchData = async (params) => {
  const res = await axios.get(endpoints.dashboard.list, { params });
  return res.data;
};

export const analyticMonthly = async (params) => {
  const res = await axios.get(endpoints.dashboard.analyticMonthly, { params });
  return res.data;
};

export const analyticPie = async () => {
  const res = await axios.get(endpoints.dashboard.analyticPie);
  return res.data;
};
