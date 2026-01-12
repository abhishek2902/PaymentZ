import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Enhanced lazy loading with error handling for iOS Safari
const lazyWithRetry = (componentImport) => {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Failed to load module:', error);
      // Retry once after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return componentImport();
    }
  });
};

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazyWithRetry(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazyWithRetry(() => import('src/pages/auth/jwt/sign-up')),
  ResetPasswordPage: lazyWithRetry(() => import('src/pages/auth/jwt/reset-password')),
  NewPasswordPage: lazyWithRetry(() => import('src/pages/auth/jwt/new-password')),
};

const authJwt = {
  path: 'jwt',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.SignUpPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'reset-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.ResetPasswordPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'new-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.NewPasswordPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
  },
];
