import React, { useContext, useState } from 'react';
import { toast } from 'sonner';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { fDate } from 'src/utils/format-time';
import Grid from '@mui/material/Grid';
import { Icon } from '@iconify/react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import { IPInfoContext } from 'ip-info-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  processPaymentDataFastRefund,
  processPaymentMonremRefund,
  processPaymentNuveiRefund,
  processPaymentPaymentezRefund,
} from 'src/api/processpayment';
import { fCentstoDollerCurrency, fCurrency } from 'src/utils/format-number';
import { getCardIcon } from '../customers/CustomerTableRow';

export function TransactionDetailsModal({ currentUser, open, onClose }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const queryClient = useQueryClient();
  const userInfo = useContext(IPInfoContext);
  const ipAddress = userInfo.ip;

  // React Query Mutation

  // refund payment datafast
  const refundaymentDataFastMutation = useMutation({
    mutationFn: processPaymentDataFastRefund,
    onSuccess: (data) => {
      toast.success('Payment refund processed successfully!');
      setOpenConfirm(false);
      onClose();
      queryClient.invalidateQueries(['processPaymentDataFast', 'dashboardData', 'transaction']);
    },
    onError: () => {
      toast.error('Failed to process of refund!');
    },
  });

  // refund payment paymentez
  const refundaymentPaymentezMutation = useMutation({
    mutationFn: processPaymentPaymentezRefund,
    onSuccess: (data) => {
      toast.success('Refund Proccess Requested Successfully!');
      setOpenConfirm(false);
      onClose();
      queryClient.invalidateQueries(['processPaymentDataFast', 'dashboardData', 'transaction']);
    },
    onError: () => {
      toast.error('Failed to process of refund!');
    },
  });

  // refund payment nuvei
  const refundanmentNuveiMutation = useMutation({
    mutationFn: processPaymentNuveiRefund,
    onSuccess: (data) => {
      toast.success('Refund Proccess Requested Successfully!');
      setOpenConfirm(false);
      onClose();
      queryClient.invalidateQueries(['processPaymentDataFast', 'dashboardData', 'transaction']);
    },
    onError: () => {
      toast.error('Failed to process of refund!');
    },
  });

  // refund payment monrem
  const refundanmentMonremMutation = useMutation({
    mutationFn: processPaymentMonremRefund,
    onSuccess: (data) => {
      if (data?.ok === false) {
        setOpenConfirm(false);
        toast.error(data?.message || 'Failed to process of refund!');
      } else {
        toast.success('Refund Proccess Requested Successfully!');
        setOpenConfirm(false);
        onClose();
      }
      queryClient.invalidateQueries(['processPaymentDataFast', 'dashboardData', 'transaction']);
    },
    onError: () => {
      toast.error('Failed to process of refund!');
    },
  });

  if (!currentUser) return null;

  const {
    merchantDetails,
    amount,
    paymentResponse,
    refund,
    paymentStatusCode,
    status,
    paymentGatewayName,
    paymentStatus,
    paymentId,
    customer,
  } = currentUser;

  const { card, paymentBrand, paymentType, ndc, resultDetails } = paymentResponse || {};

  // refund payment
  const refundPayment = () => {
    if (paymentGatewayName?.toLowerCase() === 'paymentez') {
      refundaymentPaymentezMutation.mutate({
        merchantId: merchantDetails?.id,
        siteToken: merchantDetails?.merchantSiteToken,
        paymentId: paymentResponse?.transaction?.ltp_id,
      });
    } else if (paymentGatewayName?.toLowerCase() === 'datafast') {
      refundaymentDataFastMutation.mutate({
        merchantId: merchantDetails?.id,
        siteToken: merchantDetails?.merchantSiteToken,
        paymentId: ndc,
      });
    }
    // refund payment nuvei
    else if (paymentGatewayName?.toLowerCase() === 'nuvei') {
      refundanmentNuveiMutation.mutate({
        transactionId: paymentResponse?.transaction?.id || paymentResponse?.data?.transaction?.id,
        amount,
      });
    }

    // refund payment monrem
    else if (paymentGatewayName?.toLowerCase() === 'monrem') {
      refundanmentMonremMutation.mutate({
        merchantId: merchantDetails?.id,
        siteToken: merchantDetails?.merchantSiteToken,
        transactionId: paymentResponse?.transaction_id,
        ipAddress,
      });
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { p: 2, borderRadius: 2 } }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>Transaction Details</Box>
          {refund?.status?.toLowerCase() === 'refund-failed' && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Icon icon="fluent-color:warning-20" width="23" height="23" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                The refund failed, Contact admin.
              </Typography>
            </Box>
          )}
          {(status?.toLowerCase() === 'success' || paymentStatus?.toLowerCase() === 'success') &&
            refund?.status?.toLowerCase() !== 'refund-success' &&
            paymentGatewayName.toLowerCase() !== 'monrem' && (
              <Button
                type="button"
                color="error"
                sx={{ color: '#b30b00' }}
                onClick={() => setOpenConfirm(true)}
              >
                Refund Transaction
              </Button>
            )}

          {/* Confirmation Dialog */}
          <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
            <DialogTitle>Confirm Refund</DialogTitle>
            <DialogContent>Are you sure you want to refund this transaction?</DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirm(false)} color="primary">
                No
              </Button>
              <Button onClick={refundPayment} color="error" variant="contained">
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Customer & Payment Methods Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              {/* Customer */}
              <Typography variant="subtitle1" fontWeight="bold">
                Customer Name
              </Typography>
              <Typography variant="body2">{customer?.customerName || 'N/A'}</Typography>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Customer Email
              </Typography>
              <Typography variant="body2">{customer?.customerEmail}</Typography>
              {/* Card Details */}

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Card Holder Name
              </Typography>
              <Typography variant="body1">
                {paymentGatewayName?.toLowerCase() === 'paymentez'
                  ? paymentResponse?.card?.holder_name || 'N/A'
                  : card?.holder || 'N/A'}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Payment Methods
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={getCardIcon(
                    paymentBrand || paymentResponse?.card?.type || paymentResponse?.data?.card?.type
                  )}
                  alt={paymentBrand || paymentResponse?.card?.type}
                  sx={{ width: 36, height: 36 }}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {card?.last4Digits ||
                  paymentResponse?.card?.number ||
                  paymentResponse?.data?.card?.number
                    ? `****${card?.last4Digits || paymentResponse?.card?.number || paymentResponse?.data?.card?.number}`
                    : 'N/A'}
                </Typography>
              </Typography>
              <Typography variant="body2">
                Expires{' '}
                {card?.expiryMonth ||
                  card?.expiry_month ||
                  paymentResponse?.data?.card?.expiry_month ||
                  'N/A'}{' '}
                /{' '}
                {card?.expiryYear ||
                  card?.expiry_year ||
                  paymentResponse?.data?.card?.expiry_year ||
                  'N/A'}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Gateway
              </Typography>
              <Typography variant="body1">{paymentGatewayName}</Typography>

              {/* <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Merchant
              </Typography>
              <Typography variant="body1">{merchantDetails?.businessName}</Typography>
              <Typography variant="body2">{merchantDetails?.emailAddress}</Typography> */}
            </Paper>
          </Grid>

          {/* Transaction Details Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight="bold">
                Payment Details
              </Typography>
              <Grid container spacing={1}>
                {[
                  [
                    'Txn ID',
                    paymentResponse?.merchantTransactionId ||
                      paymentResponse?.transaction?.id ||
                      paymentResponse?.data?.transaction?.id ||
                      paymentResponse?.transaction_id,
                  ],
                  [
                    'Payment ID',
                    paymentResponse?.ndc || paymentResponse?.transaction?.ltp_id || paymentId,
                  ],
                  ...(refund?.status?.toLowerCase() === 'refund-success'
                    ? [
                        [
                          'Refund ID',
                          refund?.refundPayload?.referencedId || refund?.refundPayload?.id,
                        ],
                      ]
                    : []),
                  ...(refund?.status?.toLowerCase() === 'refund-success'
                    ? [
                        [
                          'Refund Date',
                          refund?.refundPayload?.resultDetails?.AcquirerTimestamp
                            ? fDate(refund?.refundPayload?.resultDetails?.AcquirerTimestamp)
                            : // : refund?.refundPayload?.transaction?.payment_date
                              //   ? fDate(refund?.refundPayload?.transaction?.payment_date)
                              // : refund?.refundPayload?.payment_date
                              //   ? fDate(refund?.refundPayload?.payment_date)
                              null,
                        ],
                      ]
                    : []),
                  [
                    'Amount',
                    paymentGatewayName?.toLowerCase() === 'monrem'
                      ? fCentstoDollerCurrency(amount)
                      : fCurrency(amount),
                  ],
                  [
                    'Card Number',
                    card?.last4Digits ||
                    paymentResponse?.card?.number ||
                    paymentResponse?.data?.card?.number
                      ? `****${card?.last4Digits || paymentResponse?.card?.number || paymentResponse?.data?.card?.number}`
                      : 'N/A',
                  ],
                  [
                    'Currency',
                    paymentResponse?.currency || paymentResponse?.order?.currency || 'USD',
                  ],

                  [
                    'Expires',
                    `${
                      card?.expiryMonth ||
                      card?.expiry_month ||
                      paymentResponse?.data?.card?.expiry_month ||
                      'N/A'
                    } / ${card?.expiryYear || card?.expiry_year || paymentResponse?.data?.card?.expiry_year || 'N/A'}`,
                  ],

                  [
                    'Card Type',
                    paymentGatewayName?.toLowerCase() === 'paymentez' ||
                    paymentGatewayName?.toLowerCase() === 'nuvei'
                      ? paymentResponse?.card?.type || paymentResponse?.data?.card?.type
                      : paymentGatewayName?.toLowerCase() === 'monrem'
                        ? 'N/A'
                        : `${paymentType} - ${paymentBrand}`,
                  ],
                  [
                    'Dev Reference',
                    resultDetails?.ReferenceNbr ||
                      paymentResponse?.data?.transaction?.dev_reference ||
                      paymentResponse?.transaction?.dev_reference ||
                      paymentResponse?.rrn,
                  ],
                  [
                    'Extended Message',
                    resultDetails?.ExtendedDescription ||
                      paymentResponse?.data?.transaction?.message ||
                      paymentResponse?.transaction?.message,
                  ],
                  [
                    'Authorization Code',
                    resultDetails?.AuthCode ||
                      paymentResponse?.data?.transaction?.authorization_code ||
                      paymentResponse?.transaction?.authorization_code,
                  ],
                  [
                    'Carrier Code',
                    resultDetails?.clearingInstituteName ||
                      paymentResponse?.data?.transaction?.carrier_code ||
                      paymentResponse?.transaction?.carrier_code,
                  ],
                  ['Status Code', paymentStatusCode || paymentResponse?.transaction?.status],
                  [
                    'Message',
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          refund?.status?.toLowerCase() === 'refund-success'
                            ? 'warning'
                            : status?.toLowerCase() === 'success' ||
                                paymentStatus?.toLowerCase() === 'success'
                              ? 'green'
                              : status?.toLowerCase() === 'failed' ||
                                  paymentStatus?.toLowerCase() === 'failure'
                                ? 'red'
                                : 'default',
                      }}
                    >
                      {(refund?.status?.toLowerCase() === 'refund-success'
                        ? refund?.status
                        : paymentStatus) || 'N/A'}
                    </Typography>,
                  ],
                  ...(refund?.status?.toLowerCase() === 'refund-failed'
                    ? [['Failed Refund Message', refund?.status]]
                    : []),
                  ...(refund?.status?.toLowerCase() === 'refund-failed'
                    ? [
                        [
                          'Failed Refund Date',
                          refund?.refundPayload?.resultDetails?.AcquirerTimestamp
                            ? fDate(refund?.refundPayload?.resultDetails?.AcquirerTimestamp)
                            : null,
                        ],
                      ]
                    : []),
                  ...(refund?.status?.toLowerCase() === 'refund-failed'
                    ? [['Failed Refund ID', refund?.refundPayload?.referencedId]]
                    : []),
                ].map(([label, value]) => (
                  <Grid item xs={6} key={label}>
                    <Typography variant="body2" fontWeight="bold">
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {value || 'N/A'}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
