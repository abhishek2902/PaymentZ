import React from 'react';
import { useLocation } from 'react-router-dom';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import FormField from './FormField';
import MaskingFormField from './MaskingFormField';
import FormFieldNuvei from './FormFieldNuvei';
import FormFieldMonrem from './FormFieldMonrem';

// Extract Query Parameters
const useQueryParams = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

export default function FormTransaction() {
  const query = useQueryParams();
  const paymentGatewayName = query.get('paymentGtw');
  const transactionId = query.get('transactionId'); // identifiere from monrem
  const page = query.get('page');
  const verifyCres = query.get('cres'); // identifiere from nuvei

  return (
    <div>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Create Transaction"
          links={[{ name: 'Dashboard' }, { name: 'Virtual Terminal' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {/* <FormField /> */}
        {/* datafast */}
        {((paymentGatewayName && paymentGatewayName?.toLowerCase() === 'datafast') ||
          (page && page === 'paymentStatus')) && <FormField />}

        {/* paymentez */}
        {paymentGatewayName && paymentGatewayName?.toLowerCase() === 'paymentez' && (
          <MaskingFormField />
        )}

        {/* nuvei */}
        {((paymentGatewayName && paymentGatewayName?.toLowerCase() === 'nuvei') || verifyCres) && (
          <FormFieldNuvei />
        )}

        {/* monrem */}
        {((paymentGatewayName && paymentGatewayName?.toLowerCase() === 'monrem') ||
          transactionId) && <FormFieldMonrem />}
      </DashboardContent>
    </div>
  );
}
