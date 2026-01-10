import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ConnectorView } from 'src/sections/connector/connectorview';

// ----------------------------------------------------------------------

const metadata = { title: `Connector | Dashboard - ${CONFIG.appName}` };

export default function Sites() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ConnectorView />
    </>
  );
}
