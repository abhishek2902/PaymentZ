import { DashboardContent } from 'src/layouts/dashboard';

import { PaymentGatewayModal } from '../PaymentGatewayModal';

// ----------------------------------------------------------------------

export function CreateMerchant() {
  return (
    <DashboardContent>
      <PaymentGatewayModal />
    </DashboardContent>
  );
}
