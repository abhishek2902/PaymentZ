// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      resetPassword: `${ROOTS.AUTH}/jwt/reset-password`,
      newPassword: `${ROOTS.AUTH}/jwt/new-password`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    paymentGateway: `${ROOTS.DASHBOARD}/payment-gateway`,
    merchants: `${ROOTS.DASHBOARD}/merchants`,
    adminOnboarding: `${ROOTS.DASHBOARD}/admin-onboarding`,
    adminEdit: `${ROOTS.DASHBOARD}/admin/edit/:id`,
    sites: `${ROOTS.DASHBOARD}/sites`,
    customers: `${ROOTS.DASHBOARD}/customers`,
    transactions: `${ROOTS.DASHBOARD}/transactions`,
    newtransaction: `${ROOTS.DASHBOARD}/newtransaction`,
    users: `${ROOTS.DASHBOARD}/users`,
    reporting: `${ROOTS.DASHBOARD}/reporting`,
    connector: `${ROOTS.DASHBOARD}/connector`,
    connectoredit: `${ROOTS.DASHBOARD}/connector/edit/:id`,
  },
};
