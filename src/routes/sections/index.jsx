// import { Navigate, useRoutes } from 'react-router-dom';

// import { CONFIG } from 'src/config-global';

// import { authRoutes } from './auth';
// import { mainRoutes } from './main';
// import { dashboardRoutes } from './dashboard';
// import { onboardingRoutes } from './onboarding';

// // ----------------------------------------------------------------------

// export function Router() {
//   // Debug logging
//   if (typeof window !== 'undefined') {
//     console.log('[Router] Initializing router');
//     console.log('[Router] Current path:', window.location.pathname);
//     console.log('[Router] Redirect path:', CONFIG.auth.redirectPath);
//     console.log('[Router] Auth routes:', authRoutes.length);
//   }

//   const routes = useRoutes([
//     {
//       path: '/',
//       element: <Navigate to={CONFIG.auth.redirectPath} replace />,
//     },

//     // Auth
//     ...authRoutes,

//     // Dashboard
//     ...dashboardRoutes,

//     // Main
//     ...mainRoutes,

//     // Onboarding
//     ...onboardingRoutes,

//     // No match
//     { path: '*', element: <Navigate to="/404" replace /> },
//   ]);

//   if (typeof window !== 'undefined') {
//     console.log('[Router] Routes configured, current route:', routes);
//   }

//   return routes;
// }


import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { SplashScreen } from 'src/components/loading-screen';

const AuthRoutes = lazy(() => import('./auth'));
const MainRoutes = lazy(() => import('./main'));
const DashboardRoutes = lazy(() => import('./dashboard'));
const OnboardingRoutes = lazy(() => import('./onboarding'));

export function Router() {
  const routes = useRoutes([
    { path: '/', element: <Navigate to={CONFIG.auth.redirectPath} replace /> },

    {
      element: (
        <Suspense fallback={<SplashScreen />}>
          <AuthRoutes />
        </Suspense>
      ),
    },
    {
      element: (
        <Suspense fallback={<SplashScreen />}>
          <MainRoutes />
        </Suspense>
      ),
    },
    {
      element: (
        <Suspense fallback={<SplashScreen />}>
          <DashboardRoutes />
        </Suspense>
      ),
    },
    {
      element: (
        <Suspense fallback={<SplashScreen />}>
          <OnboardingRoutes />
        </Suspense>
      ),
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ]);

  return routes;
}
