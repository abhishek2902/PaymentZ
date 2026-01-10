// this function is used to get the account data

import axios, { endpoints } from 'src/utils/axios';

export const getAccountMe = async () => {
  const res = await axios.get(endpoints.auth.me);
  return res.data;
};
