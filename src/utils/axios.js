import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/me',
    signIn: '/auth/signin',
    signUp: '/admin/api/auth/sign-up',
    forgotPassword: '/forgot-password',
    newPassword: (token) => `/auth/reset-password/${token}`,
  },
  // dashboard: {
  //   list: '/admin/dashboard',
  // },
  paymentGateway: {
    list: '/admin/payment-gateway',
    create: '/admin/payment-gateway',
    get: (id) => `/admin/payment-gateway/${id}`,
    update: (id) => `/admin/payment-gateway/${id}`,
  },
  merchant: {
    list: '/admin/merchant',
    verifyPassword: '/merchant-password/verify',
    create: '/admin/merchant',
    edit: (id) => `/admin/merchant/${id}`,
  },
  sites: {
    list: '/admin/websites-list',
  },
  customers: {
    list: '/customers',
  },
  transactions: {
    list: '/admin/transaction',
    listReport: '/admin/transactions/report',
    adminsTransaction: '/superadmin/transactions/history'
  },
  genericLookup: {
    list: '/generic-lookup',
    countryList: '/generic-lookup/country',
  },

  // process payment datafast bank1
  processPaymentDataFast: {
    processpayment: '/bank-b1/payment-process',
    paymentstatus: '/bank-b1/payment-process/transaction/status',
    paymentrefund: '/bank-b1/payment-process/transaction/refund',
  },

  // process payment paymentez bank2
  processPaymentPaymentz: {
    processpayment: '/bank-b2/payment-process',
    paymentrefund: '/bank-b2/payment-process/transaction/refund',
  },

  // process payment nuvei bank3
  processPaymentNuvei: {
    processpayment: '/bank-b3/payment-process',
    paymentstatus: '/bank-b3/payment-process/transaction/status',
    paymentrefund: '/bank-b3/payment-process/transaction/refund',
    verifyTransaction: '/bank-b3/payment-process/transaction/verify',
    threeDsPaymentProcess: '/bank-b3/payment-process/3ds-payment',
  },

  // process payment monrem bank5
  processPaymentMonrem: {
    processpayment: '/bank-b5/payment-process',
    paymentstatus: '/bank-b5/payment-process/transaction/status',
    paymentrefund: '/bank-b5/payment-process/refund',
  },

  onboarding: {
    submitOnboardingForm1: '/onboarding/admin',
    submitOnboardingForm2: (id) => `/onboarding/second-stage/admin/${id}`,
    list: '/superadmin/onboarding/list',
    approve: '/approval/approve',
    approve2: '/approval/approve-and-send-login',
    reject: '/approval/reject',
    onboadingFormMdr:(id) => `/approval/mdr-rates/${id}`,
  },
  onboardingDashboard: {
    new: '/superadmin/onboarding/list?page=0&size=100&status=NEW',
    kycInProgress: '/superadmin/onboarding/list?page=0&size=1000&status=KYC_PENDING',
    approvalPending: '/superadmin/onboarding/list?page=0&size=1000&status=APPROVAL_PENDING',
    approvedToday: '/superadmin/onboarding/list?page=0&size=1000&status=ACTIVE',
    rejected: '/superadmin/onboarding/list?page=0&size=100&status=REJECTED',
  },
  connector: {
    list: 'superadmin/connectors/list',
    assignConnector: '/admin/connector-assignment/update',
    toggleConnector: '/superadmin/connectors',  // api/superadmin/connectors/{connectorId}/{status}
    updateConnector: '/superadmin/connectors/update',  // api/superadmin/connectors/{connectorId}/{status}
  },
  admin: {
    list: 'superadmin/admin/list',
    oneClickLoginAdmin: (id) => `/super-admin/impersonate/${id}`,
  },
  dashboard: {
    list: '/superadmin/dashboard/transactionWidgets',
    analyticMonthly: '/superadmin/admin-analytics/monthly',
    analyticPie: '/superadmin/admin-analytics/pie',
  },
};
