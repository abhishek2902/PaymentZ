import axios, { endpoints } from 'src/utils/axios';

export const listMerchant = async (params) => {
  const res = await axios.get(endpoints.merchant.list, { params });
  return res.data;
};

// create new merchant
export const createMerchant = async (body) => {
  const res = await axios.post(endpoints.merchant.create, body);
  return res.data;
};

// update merchant
export const updateMerchant = async ({ id, body }) => {
  const res = await axios.patch(endpoints.merchant.edit(id), body);
  return res.data;
};

// verify merchant password
export const verifyMerchantPassword = async ({ email, password }) => {
  const res = await axios.post(endpoints.merchant.verifyPassword, { email, password });
  return res.data;
};
