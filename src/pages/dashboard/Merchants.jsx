import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ListMerchant } from 'src/sections/merchant/view';

// ----------------------------------------------------------------------

const metadata = { title: `Merchants | Dashboard - ${CONFIG.appName}` };

export default function Merchants() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ListMerchant title="Merchants" />
    </>
  );
}
