import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IPInfoContext } from 'ip-info-react';

import { TextField, Button, Grid, Container, Typography, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Base64, decode as base64Decode } from 'js-base64';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { processPaymentNuvei, processPaymentNuveiVerifyTransaction } from 'src/api/processpayment';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import PaymentStatusNuveiModal from './PaymentStatusNuveiModal';
import { PaymentIframeModal } from './PaymentIframeModal';
import { OtpModal } from './OtpModal';
import PaymentIframePopup from './PaymentIframePopup';

// Validation Schema
const validationSchema = Yup.object().shape({
  // Customer Details
  firstname: Yup.string()
    .trim()
    .required('First Name is required')
    .min(2, 'Must be at least 2 characters'),
  lastName: Yup.string().trim().required('Last Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  amount: Yup.string().trim().required('Product Price is required'),

  // Card fields
  cardNumber: Yup.string()
    .required('Card number is required')
    .matches(/^\d{14,16}$/, 'Card number must be between 14 and 16 digits'),
  cardHolder: Yup.string()
    .required('Card holder name is required')
    .matches(/^[A-Za-z\s]+$/, 'Card holder name must only contain letters'),
  cardExpiryMonth: Yup.string()
    .required('Expiration Month is required')
    .matches(/^(0[1-9]|1[0-2])$/, 'Expiration Month must be in MM format'),
  cardExpiryYear: Yup.string()
    .required('Expiration date is required')
    .matches(/^\d{4}$/, 'Expiration date must be in YYYY format'),
  cardCvv: Yup.string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

const initialValues = {
  firstname: '',
  lastName: '',
  email: '',
  amount: '',
  cardNumber: '',
  cardHolder: '',
  cardExpiryMonth: '',
  cardExpiryYear: '',
  cardCvv: '',
};

// Reusable Input Field Component
const CustomField = ({ name, label, placeholder, formatValue, sm = 6 }) => (
  <Grid item xs={12} sm={sm}>
    <Field name={name}>
      {({ field, meta, form }) => {
        const handleChange = (e) => {
          let value = e.target.value;
          if (formatValue) {
            value = formatValue(value);
          }
          form.setFieldValue(name, value);
        };

        return (
          <TextField
            {...field}
            fullWidth
            placeholder={placeholder}
            label={label}
            variant="outlined"
            value={field.value || ''}
            onChange={handleChange}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: meta.touched && meta.error ? 'red' : 'default',
                },
                '&:hover fieldset': {
                  borderColor: meta.touched && meta.error ? 'red' : 'inherit',
                },
                '&.Mui-focused fieldset': {
                  borderColor: meta.touched && meta.error ? 'red' : 'inherit',
                },
              },
              '& .MuiInputLabel-root': {
                color: meta.touched && meta.error ? 'red' : 'default',
              },
              '& .MuiFormHelperText-root': {
                color: 'red',
              },
            }}
          />
        );
      }}
    </Field>
  </Grid>
);

// Extract Query Parameters
const useQueryParams = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

export default function FormFieldNuvei() {
  const [apiValidationErrors, setApiValidationErrors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const query = useQueryParams();
  const merchantId = query.get('mid') && base64Decode(query.get('mid'));
  const siteToken = query.get('st') && base64Decode(query.get('st'));
  const verifyCres = query.get('cres');
  const transactionIdFromQuery = query.get('transactionId');
  const statusDetailFromQuery = query.get('statusDetail');
  const queryClient = useQueryClient();
  const userInfo = useContext(IPInfoContext);
  const [processPaymentError, setProcessPaymentError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionMessage, setTransactionMessage] = useState(null);
  const [blankIframe, setBlankIframe] = useState(null);
  const [verifyResponseHtml, setVerifyResponseHtml] = useState(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [statusDetail, setStatusDetail] = useState(null);
  const [returnUrl, setReturnUrl] = useState('');
  const navigate = useNavigate();

  const ipAddress = userInfo.ip;
  // otpCloseHandller
  const otpCloseHandller = () => {
    setOtpModalOpen(false);
    setTransactionId(null);
  };

  // handle otp submit
  const handleOtpSubmit = (otpCode) => {
    verifyTransactionMutation.mutate({
      transactionId,
      statusDetail,
      value: otpCode,
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin; // http://localhost:3031
      const pathname = window.location.pathname; // /dashboard/newtransaction
      const full = `${origin}${pathname}`; // full URL
      setReturnUrl(full);
    }
  }, []);

  // verify transaction if statusDetail is 35
  const verifyTransactionMutation = useMutation({
    mutationFn: processPaymentNuveiVerifyTransaction,
    onSuccess: (data) => {
      const responseData = data?.data;
      // handller for 36
      if (responseData?.transaction?.status_detail === 36) {
        setOpenModal(false);
        setVerifyResponseHtml(responseData['3ds']?.browser_response?.challenge_request);
      } else {
        setOtpModalOpen(false);
        setTransactionId(responseData?.transaction?.id);
        setTransactionStatus(responseData?.transaction?.status);
        setTransactionMessage(responseData?.transaction?.message);
        setOpenModal(true); // for modal open
        setPaymentSuccess(true); // for stop loading
        setVerifyResponseHtml(null);
      }
    },
    onError: () => {
      toast.error('Failed to verify transaction');
    },
  });

  // ✅ Trigger the verify API if all query parameters are present
  useEffect(() => {
    if (verifyCres && transactionIdFromQuery && statusDetailFromQuery) {
      verifyTransactionMutation.mutate({
        transactionId: transactionIdFromQuery,
        statusDetail: Number(statusDetailFromQuery),
        value: verifyCres,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyCres, transactionIdFromQuery, statusDetailFromQuery]);

  // React Query Mutation process payment nuvei
  const processPaymentNuveiMutation = useMutation({
    mutationFn: processPaymentNuvei,
    onSuccess: (data) => {
      // If statusDetail is 35, show iframe for 5 seconds then call verify API
      if (data?.statusDetail === 35) {
        setBlankIframe(data?.chalangeRequested);
        setVerifyResponseHtml(null);
        setTimeout(() => {
          setBlankIframe(null);
          verifyTransactionMutation.mutate({
            transactionId: data.transactionId,
            statusDetail: data.statusDetail,
            value: '',
          });
        }, 5000);
      } else if (data?.statusDetail === 36) {
        setVerifyResponseHtml(data?.chalangeRequested);
        setBlankIframe(null);
      }
      // // If statusDetail is 31, show otp modal
      else if (data?.statusDetail === 31) {
        setVerifyResponseHtml(null);
        setBlankIframe(null);
        setOpenModal(false);
        setOtpModalOpen(true);
        setTransactionId(data?.transactionId);
      } else {
        setTransactionId(data?.transactionId);
        setTransactionStatus(data?.currentStatus);
        setTransactionMessage(data?.message);
        setPaymentSuccess(true);
      }
      setStatusDetail(data?.statusDetail);
      setProcessPaymentError(null);
      setApiValidationErrors([]);

      // window.open(data?.checkoutUrl);
      queryClient.invalidateQueries(['dashboardData']);
    },
    onError: () => {
      setVerifyResponseHtml(null);
      setBlankIframe(null);
      setOpenModal(false);
      toast.error('Failed to generate checkout id');
    },
  });

  // process payment nuvei
  const handleNuveiPayment = async (values, { setSubmitting, setErrors }) => {
    const formattedPrice = parseFloat(values.amount).toFixed(2);

    try {
      setOpenModal(true);
      setPaymentSuccess(false);

      const procesPaymentValue = {
        ...values,
        siteToken,
        merchantId,
        ipAddress,
        amount: formattedPrice,
        returnUrl,
        // Encrypt card fields
        // cardNumber: Base64.encode(values.cardNumber),
        // cardExpiryMonth: Base64.encode(values.cardExpiryMonth),
        // cardExpiryYear: Base64.encode(values.cardExpiryYear),
        // cardCvv: Base64.encode(values.cardCvv),
      };

      await processPaymentNuveiMutation.mutateAsync(procesPaymentValue, {
        onError: (error) => {
          if (error.response && error.response.data) {
            const backendErrors = error.response.data.errors || {};
            const formattedErrors = Object.keys(backendErrors).reduce((acc, key) => {
              acc[key] = backendErrors[key].join(', '); // If multiple errors per field
              return acc;
            }, {});
            setOpenModal(false);
            setErrors(formattedErrors);
          } else {
            setOpenModal(false);
            toast.error('An unexpected error occurred.');
          }
        },
      });
    } catch (error) {
      setOpenModal(false);
      console.error('Error:', error);
      setApiValidationErrors(error?.error || []);
      toast.error('Error processing payment');
    }
  };

  return (
    <Container maxWidth="md">
      <>
        <Typography variant="h4" gutterBottom align="center">
          Secure Payment Form
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleNuveiPayment}
        >
          {({ isSubmitting, getFieldProps, values, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                {/* CUSTOMER DETAILS */}
                <Grid item xs={12}>
                  <Typography variant="h6">Customer Details</Typography>
                </Grid>
                <CustomField name="firstname" label="First Name" />
                <CustomField name="lastName" label="Last Name" />
                <CustomField name="email" label="Email Address" />
                <CustomField name="amount" label="Amount" />
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ marginBottom: '12px' }}>
                    Card Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <CustomField name="cardHolder" label="Card Holder Name" sm={12} />
                </Grid>
                <CustomField
                  name="cardNumber"
                  placeholder="xxxx xxxx xxxx xxxx"
                  label="Card number"
                />
                <CustomField name="cardExpiryMonth" label="Expiration Month" placeholder="MM" />
                <CustomField name="cardExpiryYear" label="Expiration Year" placeholder="YYYY" />
                <CustomField name="cardCvv" label="CVV" placeholder="***" />

                {/* </Grid> */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      gap: 1,
                      display: 'flex',
                      alignItems: 'center',
                      typography: 'caption',
                      color: 'text.disabled',
                    }}
                  >
                    <Iconify icon="solar:lock-password-outline" />
                    Your transaction is secured with SSL encryption
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                  {processPaymentError && (
                    <Typography sx={{ mt: 2 }} variant="body2" color="error">
                      {processPaymentError}
                    </Typography>
                  )}
                  {Array.isArray(apiValidationErrors) && apiValidationErrors?.length > 0 && (
                    <Typography sx={{ mt: 2 }} variant="body2" color="error">
                      {apiValidationErrors.map((error, index) => (
                        <li key={index}>{error?.error || error?.message}</li>
                      ))}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </>

      {/* Status Modal */}
      <PaymentStatusNuveiModal
        open={openModal}
        success={paymentSuccess}
        onClose={() => {
          setOpenModal(false);
          setTransactionId(null);
          setTransactionStatus(null);
          setTransactionMessage(null);
          if (verifyCres && transactionIdFromQuery && statusDetailFromQuery) {
            navigate(`/dashboard/transactions`);
            // navigate transaction page if verify response is 36
          }
        }}
        transactionMessage={transactionMessage}
        transactionId={transactionId}
        transactionStatus={transactionStatus}
      />

      {/* Otp Modal */}
      <OtpModal
        open={otpModalOpen}
        onClose={otpCloseHandller}
        onSubmit={(otpCode) => {
          handleOtpSubmit(otpCode);
        }}
      />

      {/* Html render if verifyResponse return 36 for submit process */}
      <PaymentIframeModal
        iframeHtml={verifyResponseHtml}
        open={!!verifyResponseHtml}
        onClose={() => setVerifyResponseHtml(null)}
      />

      {/* {verifyResponseHtml && <PaymentIframePopup iframeHtml={verifyResponseHtml} />} */}

      {/* Blank iframe if verifyResponse return 35 for submit process */}
      {blankIframe && (
        <div
          dangerouslySetInnerHTML={{ __html: blankIframe }}
          style={{ width: '100%', height: 'calc(100vh - 180px)' }}
        />
      )}
    </Container>
  );
}
