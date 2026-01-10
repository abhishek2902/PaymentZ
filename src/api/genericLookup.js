import axios, { endpoints } from 'src/utils/axios';

// list of generic lookups options
export const listGenericLookups = async (params) => {
  const res = await axios.get(endpoints.genericLookup.list, { params });
  return res.data;
};

// list of generic lookup countries
export const listGenericLookupCountries = async (params) => {
  const res = await axios.get(endpoints.genericLookup.countryList, { params });
  return res.data;
};
