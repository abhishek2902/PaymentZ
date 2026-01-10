import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { Edit } from 'src/sections/connector/Edit';

// ----------------------------------------------------------------------

const metadata = { title: `Connector-Edit | Dashboard - ${CONFIG.appName}` };

export default function Sites() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <Edit />
    </>
  );
}
