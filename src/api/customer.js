import axios, { endpoints } from 'src/utils/axios';

export const listCustomers = async (params) => {
  const res = await axios.get(endpoints.customers.list, { params });
  return res.data;
};
