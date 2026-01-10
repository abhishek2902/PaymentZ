import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { MerchantModal } from '../MerchantModal';

// ----------------------------------------------------------------------

export function CreateMerchant() {
  return (
    <DashboardContent>
      <MerchantModal />
    </DashboardContent>
  );
}
