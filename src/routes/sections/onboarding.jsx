// import ThankYouPage from 'src/components/onboarding/ThankYouPage';
// import OnboardingForm from 'src/pages/onboard/onboarding-form';

// export const onboardingRoutes = [
//   {
//     path: '/admin/onboarding/:onboardingId',
//     element: <OnboardingForm />,
//   },
//   {
//     path: '/admin/onboarding/thank-you',
//     element: <ThankYouPage />,
//   },
// ];

import { lazy, Suspense } from 'react';
import { SplashScreen } from 'src/components/loading-screen';

const OnboardingForm = lazy(() =>
  import('src/pages/onboard/onboarding-form')
);

const ThankYouPage = lazy(() =>
  import('src/components/onboarding/ThankYouPage')
);

export const onboardingRoutes = [
  {
    path: '/admin/onboarding/:onboardingId',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <OnboardingForm />
      </Suspense>
    ),
  },
  {
    path: '/admin/onboarding/thank-you',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <ThankYouPage />
      </Suspense>
    ),
  },
];
