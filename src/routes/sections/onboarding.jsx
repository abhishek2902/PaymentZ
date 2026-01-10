import ThankYouPage from 'src/components/onboarding/ThankYouPage';
import OnboardingForm from 'src/pages/onboard/onboarding-form';

export const onboardingRoutes = [
  {
    path: '/admin/onboarding/:onboardingId',
    element: <OnboardingForm />,
  },
  {
    path: '/admin/onboarding/thank-you',
    element: <ThankYouPage />,
  },
];
