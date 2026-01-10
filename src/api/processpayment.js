import axios, { endpoints } from 'src/utils/axios';

// this is for process payment data fast
export const processPaymentDataFast = async (body) => {
  const res = await axios.post(endpoints.processPaymentDataFast.processpayment, body);
  return res.data;
};

// this is used to get the status of the payment
export const processPaymentDataFastStatus = async (body) => {
  const res = await axios.post(endpoints.processPaymentDataFast.paymentstatus, body);
  return res.data;
};

// this is used to refund the payment of datafast
export const processPaymentDataFastRefund = async (body) => {
  const res = await axios.post(endpoints.processPaymentDataFast.paymentrefund, body);
  return res.data;
};

// process payment paymentz
export const processPaymentPaymentz = async (body) => {
  const res = await axios.post(endpoints.processPaymentPaymentz.processpayment, body);
  return res.data;
};

// this is used to refund the payment of paymentez
export const processPaymentPaymentezRefund = async (body) => {
  const res = await axios.post(endpoints.processPaymentPaymentz.paymentrefund, body);
  return res.data;
};

// process payment nuvei
export const processPaymentNuvei = async (body) => {
  const res = await axios.post(endpoints.processPaymentNuvei.processpayment, body);
  return res.data;
};

// Verify the transaction of nuvei
export const processPaymentNuveiVerifyTransaction = async (body) => {
  const res = await axios.post(endpoints.processPaymentNuvei.verifyTransaction, body);
  return res.data;
};

// process url api call
export const processPaymentNuveiUrl = async ({ transactionId }) => {
  const res = await axios.post(
    `${endpoints.processPaymentNuvei.threeDsPaymentProcess}/${transactionId}`
  );
  return res.data;
};

// this is used to refund the payment of nuvei
export const processPaymentNuveiRefund = async (body) => {
  const res = await axios.post(endpoints.processPaymentNuvei.paymentrefund, body);
  return res.data;
};

// Monrem

// this is used to process the payment of monrem
export const processPaymentMonrem = async (body) => {
  const res = await axios.post(endpoints.processPaymentMonrem.processpayment, body);
  return res.data;
};

// this is used to refund the payment of monrem
export const processPaymentMonremRefund = async (body) => {
  const res = await axios.post(endpoints.processPaymentMonrem.paymentrefund, body);
  return res.data;
};
