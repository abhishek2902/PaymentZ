import { Navigate, useRoutes } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';
import { onboardingRoutes } from './onboarding';

// ----------------------------------------------------------------------

export function Router() {
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('[Router] Initializing router');
    console.log('[Router] Current path:', window.location.pathname);
    console.log('[Router] Redirect path:', CONFIG.auth.redirectPath);
    console.log('[Router] Auth routes:', authRoutes.length);
  }

  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to={CONFIG.auth.redirectPath} replace />,
    },

    // Auth
    ...authRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,

    // Onboarding
    ...onboardingRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);

  if (typeof window !== 'undefined') {
    console.log('[Router] Routes configured, current route:', routes);
  }

  return routes;
}
