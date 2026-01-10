import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { Edit } from 'src/sections/Admin/Edit';

// ----------------------------------------------------------------------

const metadata = { title: `Admin-Edit | Dashboard - ${CONFIG.appName}` };

export default function AdminEdit() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <Edit />
    </>
  );
}