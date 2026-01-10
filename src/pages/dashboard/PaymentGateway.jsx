import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ListPaymentGateway } from 'src/sections/payment-gateway/view';

// ----------------------------------------------------------------------

const metadata = { title: `Payment Gateway | Dashboard - ${CONFIG.appName}` };

export default function PaymentGateway() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ListPaymentGateway title="Payment Gateway" />
    </>
  );
}
