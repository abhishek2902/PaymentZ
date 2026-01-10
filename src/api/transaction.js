import axios, { endpoints } from 'src/utils/axios';

export const listTransaction = async (params) => {
  const res = await axios.get(endpoints.transactions.list, { params });
  return res.data;
};

export const listTransactionReport = async (params) => {
  const res = await axios.get(endpoints.transactions.listReport, { params });
  return res.data;
};

export const adminsTransaction = async (params) => {
  const res = await axios.get(endpoints.transactions.adminsTransaction, { params });
  return res.data;
};
