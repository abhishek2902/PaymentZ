import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';
import ListSite from 'src/sections/sites/ListSite';

// ----------------------------------------------------------------------

const metadata = { title: `Sites | Dashboard - ${CONFIG.appName}` };

export default function Sites() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ListSite />
    </>
  );
}
