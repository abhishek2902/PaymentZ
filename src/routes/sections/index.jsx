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


import { useEffect, useMemo, useState } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { SplashScreen } from 'src/components/loading-screen';

// Lazy loaders (route ARRAYS, not components)
const loadAuthRoutes = () => import('./auth');
const loadMainRoutes = () => import('./main');
// const loadDashboardRoutes = () => import('./dashboard');
// const loadOnboardingRoutes = () => import('./onboarding');

export function Router() {
  const [loadedRoutes, setLoadedRoutes] = useState(null);

  useEffect(() => {
    Promise.all([
      loadAuthRoutes(),
      // loadDashboardRoutes(),
      loadMainRoutes(),
      // loadOnboardingRoutes(),
    ]).then(
      // ([auth, dashboard, main, onboarding]) => {
      ([auth, main,]) => {
        setLoadedRoutes([
          {
            path: '/',
            element: <Navigate to={CONFIG.auth.redirectPath} replace />,
          },

          ...auth.authRoutes,
          // ...dashboard.dashboardRoutes,
          ...main.mainRoutes,
          // ...onboarding.onboardingRoutes,

          { path: '*', element: <Navigate to="/404" replace /> },
        ]);
      }
    );
  }, []);

  // ✅ Always provide routes to useRoutes
  const routes = useMemo(
    () =>
      loadedRoutes ?? [
        {
          path: '*',
          element: <SplashScreen />,
        },
      ],
    [loadedRoutes]
  );

  // ✅ Hook is ALWAYS called
  return useRoutes(routes);
}
