import React, { useState, useContext, useEffect } from 'react';
import { IPInfoContext } from 'ip-info-react';
import { v1 as uuidv1 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Autocomplete,
  FormControlLabel,
  Box,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { decode as base64Decode } from 'js-base64';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listGenericLookupCountries } from 'src/api/genericLookup';
import { useBoolean } from 'src/hooks/use-boolean';
import { processPaymentDataFast, processPaymentPaymentz } from 'src/api/processpayment';
import { toast } from 'src/components/snackbar';
import { CONFIG } from 'src/config-global';
import { Iconify } from 'src/components/iconify';
import ProcessPaymentStatus from './ProcessPaymentStatus';

import { PaymentNewCardForm } from './PaymentNewCardForm';
import PaymentStatusModal from './PaymentStatusModal';

// Validation Schema
const validationSchema = Yup.object().shape({
  // Customer Details
  firstname: Yup.string()
    .trim()
    .required('First Name is required')
    .min(2, 'Must be at least 2 characters'),
  // middleName: Yup.string().required('Middle Name is required'),
  lastName: Yup.string().trim().required('Last Name is required'),
  // ipAddress: Yup.string().required('IP Address is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  // customer_identificationDocType: Yup.string().required('ID Type is required'),
  // identificationDocId: Yup.string().required('ID Number is required'),
  phone: Yup.string()
    .trim()
    .matches(/^\d{10,15}$/, 'Phone must be 10-15 digits')
    .required('Phone Number is required'),

  // merchantCustomerId: Yup.string().required('Customer ID is required'),

  // Billing Details
  // billingStreet1: Yup.string().required('Billing Address is required'),
  countryName: Yup.string().trim().required('Billing Country is required'),
  // billingPostcode: Yup.string().required('Billing post code is required'),

  // Shipping Details
  // shippingStreet1: Yup.string().required('Shipping Address is required'),
  // shippingCountry: Yup.string().required('Shipping Country is required'),

  // Cart Details
  // productName: Yup.string().required('Product Name is required'),
  // productDescription: Yup.string().required('Product Description is required'),
  productPrice: Yup.string().trim().required('Product Price is required'),

  // Card fields
  cardBrand: Yup.string().required('Card Type is required'),
  cardNumber: Yup.string()
    .required('Card number is required')
    .matches(/^\d{14,16}$/, 'Card number must be between 14 and 16 digits'),
  cardHolder: Yup.string()
    .required('Card holder name is required')
    .matches(/^[A-Za-z\s]+$/, 'Card holder name must only contain letters'),
  cardExpiry: Yup.string()
    .required('Expiration date is required')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format'),
  cardCvv: Yup.string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

const initialValues = {
  firstname: '',
  middleName: '',
  lastName: '',
  // ipAddress: '',
  email: '',
  // identificationDocId: '',
  phone: '',
  // merchantCustomerId: '',
  // billingStreet1: '',
  countryName: '',
  // billingPostcode: '',
  // shippingStreet1: '',
  // shippingCountry: '',
  // productName: '',
  // productDescription: '',
  productPrice: '',
  cardNumber: '',
  cardBrand: 'VISA',
  cardHolder: '',
  cardExpiry: '',
  cardCvv: '',
};

// format card expiry
const formatCardExpiry = (value) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
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

export default function MaskingFormField() {
  const [checkoutId, setCheckoutId] = useState(null);
  const [apiValidationErrors, setApiValidationErrors] = useState([]);
  const [useBillingAsShipping, setUseBillingAsShipping] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const userInfo = useContext(IPInfoContext);
  const query = useQueryParams();
  const page = query.get('page');
  const paymentGatewayName = query.get('paymentGtw');
  const merchantId = query.get('mid') && base64Decode(query.get('mid'));
  const siteToken = query.get('st') && base64Decode(query.get('st'));
  const encodedMerchantId = query.get('mid');
  const encodedSiteToken = query.get('st');
  const queryClient = useQueryClient();
  const [processPaymentError, setProcessPaymentError] = useState(null);
  const navigate = useNavigate();

  // React Query Mutation process payment datafast
  const processPaymentDataFastMutation = useMutation({
    mutationFn: processPaymentDataFast,
    onSuccess: (data) => {
      // data?.result?.code === '000.200.100'; this will be removed in live
      if (data?.result?.code === '000.000.000' || data?.result?.code === '000.200.100') {
        // toast.success('Payment processed successfully!');
        setProcessPaymentError(null);
        setApiValidationErrors([]);
        setCheckoutId(data?.id); // Update checkoutId
        queryClient.invalidateQueries(['processPaymentDataFast']);
      } else {
        // toast.error('Failed to process payment');
        setProcessPaymentError(data?.result?.description);
        setApiValidationErrors(data?.result?.parameterErrors);
      }
    },
    onError: () => {
      toast.error('Failed to generate checkout id');
    },
  });

  // Fetch payment gateway status
  const {
    data: countryList = [],
    isLoading: isCountryListLoading,
    error: countriesError,
  } = useQuery({
    queryKey: ['listgenericlookupcountries'],
    queryFn: () => listGenericLookupCountries().then((res) => res),
    staleTime: 3600000, // 60 minutes cache
    cacheTime: 60 * 60 * 1000, // Keep in cache for 60 minutes
  });

  const ipAddress = userInfo.ip;
  const merchantCustomerId = uuidv1();

  // process payment data fast
  const handlePaymentDatafast = async (values, { setSubmitting, setErrors }) => {
    const formattedPrice = parseFloat(values.productPrice).toFixed(2);
    try {
      const procesPaymentValue = {
        ...values,
        siteToken,
        ipAddress,
        merchantCustomerId,
        productPrice: formattedPrice, // Ensure two decimal places
        merchantId,
        amount: formattedPrice,
      };

      await processPaymentDataFastMutation.mutateAsync(procesPaymentValue, {
        onError: (error) => {
          if (error.response && error.response.data) {
            const backendErrors = error.response.data.errors || {};
            const formattedErrors = Object.keys(backendErrors).reduce((acc, key) => {
              acc[key] = backendErrors[key].join(', '); // If multiple errors per field
              return acc;
            }, {});
            setErrors(formattedErrors);
          } else {
            toast.error('An unexpected error occurred.');
          }
        },
      });
      // processPaymentDataFastMutation.mutate(procesPaymentValue);
    } catch (error) {
      console.error('Error:', error);
      setApiValidationErrors(error?.error || []);
      toast.error('Error processing payment');
    }
    setSubmitting(false);
  };

  // React Query Mutation process payment paymentz
  const processPaymentPaymentzMutation = useMutation({
    mutationFn: processPaymentPaymentz,
    onSuccess: (data) => {
      setProcessPaymentError(null);
      setApiValidationErrors([]);
      if (!data?.otpUrl) {
        setPaymentSuccess(true);
      }

      // open payment url openf for otp fill.
      if (data?.otpUrl) {
        setOpenModal(false);
        window.open(data?.otpUrl);
        navigate('/dashboard/transactions');
      }
      // window.open(data?.checkoutUrl);
      queryClient.invalidateQueries(['dashboardData']);
    },
    onError: () => {
      setOpenModal(false);
      toast.error('Failed to generate checkout id');
    },
  });

  // process payment paymentz
  const handlePaymentzPayment = async (values, { setSubmitting, setErrors }) => {
    const formattedPrice = parseFloat(values.productPrice).toFixed(2);

    try {
      setOpenModal(true);
      setPaymentSuccess(false);

      const procesPaymentValue = {
        ...values,
        siteToken,
        ipAddress,
        merchantId,
        amount: formattedPrice,
        cardBrand: 'VISA',
      };

      await processPaymentPaymentzMutation.mutateAsync(procesPaymentValue, {
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

  // payment form variables
  const strike1paymentUrl = CONFIG.strike1PaymentUrl;
  const bankRedirectUrl = CONFIG.bankRedirectUrl;

  // datafasr payment page
  if (checkoutId && merchantId && siteToken && page !== 'paymentStatus') {
    // set local storage
    localStorage.setItem('merchantId', encodedMerchantId);
    localStorage.setItem('siteToken', encodedSiteToken);
    localStorage.setItem('paymentId', checkoutId);

    return (
      <iframe
        title="Payment Page"
        srcDoc={`<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Page</title>
          <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>       
          <script src="${strike1paymentUrl}?checkoutId=${checkoutId}"></script>
        </head>
        <body>
          <h1>Complete Your Payment</h1>
          <form action="${bankRedirectUrl}" class="paymentWidgets" data-brands="VISA MASTER AMEX DISCOVER"></form>
        </body>
        </html>`}
        style={{ width: '100%', height: '600px', border: 'none' }}
      />
    );
  }

  return (
    <Container maxWidth="md">
      {page === 'paymentStatus' ? (
        <ProcessPaymentStatus />
      ) : (
        <>
          <Typography variant="h4" gutterBottom align="center">
            Secure Payment Form
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={
              paymentGatewayName && paymentGatewayName?.toLowerCase() === 'paymentez'
                ? handlePaymentzPayment
                : handlePaymentDatafast
            }
          >
            {({ isSubmitting, getFieldProps, values, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* CUSTOMER DETAILS */}
                  <Grid item xs={12}>
                    <Typography variant="h6">Customer Details</Typography>
                  </Grid>
                  <CustomField name="firstname" label="First Name" />
                  <CustomField name="middleName" label="Middle Name" />
                  <CustomField name="lastName" label="Last Name" />
                  {/* <CustomField name="ipAddress" label="IP Address" /> */}
                  <CustomField name="email" label="Email Address" />
                  {/* <CustomField name="identificationDocId" label="ID Number(Doc ID)" /> */}
                  <CustomField name="phone" label="Phone Number" />

                  {/* This select country_code */}
                  {/* <Field name="country">
                    {({ field, form, meta }) => (
                      <Autocomplete
                        options={countryList}
                        sx={{ width: 418, ml: 2, mt: 2 }}
                        getOptionLabel={(option) =>
                          `${option.country_name} (${option.country_code})`
                        }
                        value={
                          countryList.find((country) => country.country_code === field.value) ||
                          null
                        } // Set selected value
                        onChange={(_, newValue) => {
                          form.setFieldValue(field.name, newValue ? newValue.country_code : ''); // Store country code
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            fullWidth
                            label="Select Country"
                            variant="outlined"
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
                        )}
                      />
                    )}
                  </Field> */}

                  {/* This select country name */}
                  <Field name="countryName">
                    {({ field, form, meta }) => (
                      <Autocomplete
                        options={countryList}
                        sx={{ width: 418, ml: 2, mt: 2 }}
                        getOptionLabel={(option) =>
                          `${option.country_name} (${option.country_code})`
                        }
                        value={
                          countryList.find((country) => country.country_name === field.value) ||
                          null
                        } // Set selected value by country_name
                        onChange={(_, newValue) => {
                          form.setFieldValue(field.name, newValue ? newValue.country_name : ''); // Store country_name
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            fullWidth
                            label="Select Country"
                            variant="outlined"
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
                        )}
                      />
                    )}
                  </Field>
                  {/* <CustomField name="productPrice" label="Amount" /> */}

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
                  <CustomField
                    name="cardExpiry"
                    label="Expiration date"
                    placeholder="MM/YY"
                    formatValue={formatCardExpiry}
                  />
                  <CustomField name="cardCvv" label="CVV" placeholder="***" />
                  <CustomField name="productPrice" label="Amount" />

                  {/* <Grid item xs={12} sm={6}>
                    <Field name="cardBrand">
                      {({ field, form, meta }) => (
                        <Autocomplete
                          options={['VISA', 'MASTER', 'AMEX', 'DISCOVER']}
                          getOptionLabel={(option) => option}
                          onChange={(event, newValue) => {
                            form.setFieldValue('cardBrand', newValue);
                          }}
                          value={field.value || ''}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Card Type"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        />
                      )}
                    </Field>
                  </Grid> */}

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
      )}
      <PaymentStatusModal
        open={openModal}
        success={paymentSuccess}
        onClose={() => setOpenModal(false)}
      />
    </Container>
  );
}
