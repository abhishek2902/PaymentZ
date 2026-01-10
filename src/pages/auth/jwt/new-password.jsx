import { Helmet } from 'react-helmet-async';
import { JwtNewPasswordView } from 'src/auth/view/jwt/jwt-new-password-view';

import { CONFIG } from 'src/config-global';
  
// ----------------------------------------------------------------------

const metadata = { title: `New Password - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <JwtNewPasswordView />
    </>
  );
}
