import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';
import { TransactionView } from 'src/sections/transactins-Analytics/TransactionView';
import { ListTransaction } from 'src/sections/transaction/ListTransaction';

// ----------------------------------------------------------------------

const metadata = { title: `Transaction | Dashboard - ${CONFIG.appName}` };

export default function Transactions() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <ListTransaction title="Transactions" /> */}
      <TransactionView title="Transactions and Analytics" />
    </>
  );
}
