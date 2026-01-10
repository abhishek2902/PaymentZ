import React, { useEffect } from 'react';
import { decode as base64Decode } from 'js-base64';
import { processPaymentDataFastStatus } from 'src/api/processpayment';
import { toast } from 'sonner';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

export default function ProcessPaymentStatus() {
  const [paymentStatusData, setPaymentStatusData] = React.useState({});
  const navigate = useNavigate();

  // Get merchantId, siteToken and paymentId from localStorage
  const merchantId = localStorage.getItem('merchantId');
  const siteToken = localStorage.getItem('siteToken');
  const paymentId = localStorage.getItem('paymentId');

  const fetchProcessPayment = async () => {
    try {
      const decodedMerchantId = base64Decode(merchantId);
      const decodedSiteToken = base64Decode(siteToken);

      const response = await processPaymentDataFastStatus({
        merchantId: decodedMerchantId,
        siteToken: decodedSiteToken,
        paymentId,
      });
      setPaymentStatusData(response);
      toast.success('Redirecting in 10 seconds...');
      const timer = setTimeout(() => {
        const path = window.location.pathname;
        if (path === '/dashboard/newtransaction') {
          // Redirect to vt
          navigate(
            `/dashboard/newtransaction?mid=${merchantId}&st=${siteToken}&paymentGtw=DATAFAST`
          );
        }

        // clear local storage
        localStorage.removeItem('merchantId');
        localStorage.removeItem('siteToken');
        localStorage.removeItem('paymentId');
      }, 10000); // Redirect after 10 seconds
    } catch (error) {
      toast.error('Error processing payment');
    }
  };

  /* eslint-disable */

  useEffect(() => {
    if (merchantId && siteToken && paymentId) {
      fetchProcessPayment();
    }
  }, [merchantId, siteToken, paymentId]);

  /* eslint-enable */

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card>
        <CardContent>
          <Typography component="h2" variant="h4" align="center" sx={{ fontWeight: 'bold', mt: 2 }}>
            Transaction Status
          </Typography>
          <div className="space-y-2">
            <p>
              <strong>Transaction ID:</strong> {paymentStatusData?.id}
            </p>
            <p>
              <strong>Merchant Transaction ID:</strong> {paymentStatusData?.merchantTransactionId}
            </p>
            <p>
              <strong>Payment Type:</strong> {paymentStatusData?.paymentType} (
              {paymentStatusData?.paymentBrand})
            </p>
            <p>
              <strong>Amount:</strong> {paymentStatusData?.amount} {paymentStatusData?.currency}
            </p>
            <p>
              <strong>Status:</strong> {paymentStatusData?.result?.description} (Code:{' '}
              {paymentStatusData?.result?.code})
            </p>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
