import axios, { endpoints } from 'src/utils/axios';

// list of payment gateways
export const listPaymentGateways = async (params) => {
  const res = await axios.get(endpoints.paymentGateway.list, { params });
  return res.data;
};

// create new payment gateway
export const createPaymentGateway = async (body) => {
  const res = await axios.post(endpoints.paymentGateway.create, body);
  return res.data;
};

// update payment gateway
export const updatePaymentGateway = async ({ id, body }) => {
  const res = await axios.patch(endpoints.paymentGateway.update(id), body);
  return res.data;
};

// Archive payment gateway
export const archivePaymentGateway = async ({ id, body }) => {
  const res = await axios.patch(endpoints.paymentGateway.update(id), body);
  return res.data;
};
