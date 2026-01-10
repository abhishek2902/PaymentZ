import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Users | Dashboard - ${CONFIG.appName}` };

export default function Sites() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserListView />
    </>
  );
}
