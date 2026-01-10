import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';
import ListCustomer from 'src/sections/customers/ListCustomer';

// ----------------------------------------------------------------------

const metadata = { title: `Admin - ${CONFIG.appName}` };

export default function Customers() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ListCustomer />
    </>
  );
}
