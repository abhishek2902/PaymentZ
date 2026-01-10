import axios, { endpoints } from 'src/utils/axios';

//  this api is used to list all sites
export const listSite = async (params) => {
  const res = await axios.get(endpoints.sites.list, { params });
  return res.data;
};
