import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AdminOnboardingView } from '../../sections/admin-onboarding/AdminOnboardingView';

// ----------------------------------------------------------------------

const metadata = { title: `Admin Onboarding | Dashboard - ${CONFIG.appName}` };

export default function AdminOnboarding() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AdminOnboardingView title="Admins" />
    </>
  );
}
