import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ReportingView } from 'src/sections/reporting/view';

// ----------------------------------------------------------------------

const metadata = { title: `Reporting | Dashboard - ${CONFIG.appName}` };

export default function Reporting() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReportingView />
    </>
  );
}
