import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const Dashboard = lazy(() => import('src/pages/dashboard/Dashboard'));
const PaymentGateway = lazy(() => import('src/pages/dashboard/PaymentGateway'));
const Merchants = lazy(() => import('src/pages/dashboard/Merchants'));
const Sites = lazy(() => import('src/pages/dashboard/Sites'));
const Customers = lazy(() => import('src/pages/dashboard/Customers'));
const Transactions = lazy(() => import('src/pages/dashboard/Transactions'));
const NewTransaction = lazy(() => import('src/pages/dashboard/NewTransaction'));
const Users = lazy(() => import('src/pages/dashboard/Users'));
const Connector = lazy(() => import('src/pages/dashboard/Connector'));
const ConnectorEdit = lazy(() => import('src/pages/dashboard/ConnectorEdit'));
const AdminEdit = lazy(() => import('src/pages/dashboard/AdminEdit'));
const Reporting = lazy(() => import('src/pages/dashboard/Reporting'));
const AdminOnboarding = lazy(() => import('src/pages/dashboard/AdminOnboarding'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    // element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    element: <>{layoutContent}</>,
    children: [
      { element: <Dashboard />, index: true },
      { path: 'payment-gateway', element: <PaymentGateway /> },
      { path: 'merchants', element: <Merchants /> },
      { path: 'admin-onboarding', element: <AdminOnboarding /> },
      { path: 'sites', element: <Sites /> },
      { path: 'customers', element: <Customers /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'newtransaction', element: <NewTransaction /> },
      { path: 'users', element: <Users /> },
      { path: 'reporting', element: <Reporting /> },
      { path: 'connector', element: <Connector /> },
      { path: 'connector/edit/:id', element: <ConnectorEdit /> },
      { path: 'admin/edit/:id', element: <AdminEdit /> },
    ],
  },
];
