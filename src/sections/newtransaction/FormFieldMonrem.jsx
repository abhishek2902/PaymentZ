import React, { useState, useContext, useEffect } from 'react';
import { IPInfoContext } from 'ip-info-react';
import { v1 as uuidv1 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';

import { TextField, Button, Grid, Container, Typography, Autocomplete, Box } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { decode as base64Decode } from 'js-base64';
import { useMutation, useQuery } from '@tanstack/react-query';
import { listGenericLookupCountries } from 'src/api/genericLookup';
import { processPaymentMonrem } from 'src/api/processpayment';
import { toast } from 'src/components/snackbar';
import PaymentStatusMonremModal from './PaymentStatusMonremModal';

// Validation Schema
const validationSchema = Yup.object().shape({
  // Customer Details

  firstname: Yup.string()
    .trim()
    .required('First Name is required')
    .min(2, 'Must be at least 2 characters'),
  lastName: Yup.string().trim().required('Last Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .trim()
    .matches(/^\d{10,15}$/, 'Phone must be 10-15 digits')
    .required('Phone Number is required'),
  customerPhoneCode: Yup.string()
    .required('Phone Code is required')
    .matches(/^[1-9]{1,3}$/, 'Phone Code must be 1 to 3 digits (1–9 only)'),

  // Billing Details
  billingStreet: Yup.string().required('Billing Address is required'),
  billingCity: Yup.string().required('Billing City is required'),
  billingCountry: Yup.string().trim().required('Billing Country is required'),
  billingPostCode: Yup.string().required('Billing post code is required'),
  amount: Yup.string().trim().required('Product Price is required'),

  // Card fields
  cardNumber: Yup.string()
    .required('Card number is required')
    .matches(/^\d{14,16}$/, 'Card number must be between 14 and 16 digits'),
  cardHolder: Yup.string()
    .required('Card holder name is required')
    .matches(/^[A-Za-z\s]+$/, 'Card holder name must only contain letters'),
  cardExpMonth: Yup.string()
    .required('Expiration Month is required')
    .matches(/^(0[1-9]|1[0-2])$/, 'Expiration Month must be in MM format'),
  cardExpYear: Yup.string()
    .required('Expiration date is required')
    .matches(/^\d{2}$/, 'Expiration date must be in YY format'),
  cardCvv: Yup.string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

// countries and country code.
// const countries = [
//   { code: 'AF', name: 'Afghanistan' },
//   { code: 'AL', name: 'Albania' },
//   { code: 'DZ', name: 'Algeria' },
//   { code: 'AD', name: 'Andorra' },
//   { code: 'AO', name: 'Angola' },
//   { code: 'AR', name: 'Argentina' },
//   { code: 'AM', name: 'Armenia' },
//   { code: 'AU', name: 'Australia' },
//   { code: 'AT', name: 'Austria' },
//   { code: 'AZ', name: 'Azerbaijan' },
//   { code: 'BH', name: 'Bahrain' },
//   { code: 'BD', name: 'Bangladesh' },
//   { code: 'BY', name: 'Belarus' },
//   { code: 'BE', name: 'Belgium' },
//   { code: 'BZ', name: 'Belize' },
//   { code: 'BJ', name: 'Benin' },
//   { code: 'BO', name: 'Bolivia' },
//   { code: 'BA', name: 'Bosnia and Herzegovina' },
//   { code: 'BR', name: 'Brazil' },
//   { code: 'BG', name: 'Bulgaria' },
//   { code: 'CA', name: 'Canada' },
//   { code: 'CL', name: 'Chile' },
//   { code: 'CN', name: 'China' },
//   { code: 'CO', name: 'Colombia' },
//   { code: 'CR', name: 'Costa Rica' },
//   { code: 'HR', name: 'Croatia' },
//   { code: 'CU', name: 'Cuba' },
//   { code: 'CY', name: 'Cyprus' },
//   { code: 'CZ', name: 'Czech Republic' },
//   { code: 'DK', name: 'Denmark' },
//   { code: 'DO', name: 'Dominican Republic' },
//   { code: 'EC', name: 'Ecuador' },
//   { code: 'EG', name: 'Egypt' },
//   { code: 'FR', name: 'France' },
//   { code: 'DE', name: 'Germany' },
//   { code: 'GR', name: 'Greece' },
//   { code: 'HK', name: 'Hong Kong' },
//   { code: 'HU', name: 'Hungary' },
//   { code: 'IS', name: 'Iceland' },
//   { code: 'IN', name: 'India' },
//   { code: 'ID', name: 'Indonesia' },
//   { code: 'IE', name: 'Ireland' },
//   { code: 'IL', name: 'Israel' },
//   { code: 'IT', name: 'Italy' },
//   { code: 'JP', name: 'Japan' },
//   { code: 'KW', name: 'Kuwait' },
//   { code: 'MY', name: 'Malaysia' },
//   { code: 'MX', name: 'Mexico' },
//   { code: 'NL', name: 'Netherlands' },
//   { code: 'NZ', name: 'New Zealand' },
//   { code: 'NG', name: 'Nigeria' },
//   { code: 'NO', name: 'Norway' },
//   { code: 'PK', name: 'Pakistan' },
//   { code: 'PE', name: 'Peru' },
//   { code: 'PH', name: 'Philippines' },
//   { code: 'PL', name: 'Poland' },
//   { code: 'PT', name: 'Portugal' },
//   { code: 'QA', name: 'Qatar' },
//   { code: 'RO', name: 'Romania' },
//   { code: 'RU', name: 'Russia' },
//   { code: 'SA', name: 'Saudi Arabia' },
//   { code: 'SG', name: 'Singapore' },
//   { code: 'ZA', name: 'South Africa' },
//   { code: 'KR', name: 'South Korea' },
//   { code: 'ES', name: 'Spain' },
//   { code: 'SE', name: 'Sweden' },
//   { code: 'CH', name: 'Switzerland' },
//   { code: 'TH', name: 'Thailand' },
//   { code: 'TR', name: 'Turkey' },
//   { code: 'UA', name: 'Ukraine' },
//   { code: 'AE', name: 'United Arab Emirates' },
//   { code: 'GB', name: 'United Kingdom' },
//   { code: 'US', name: 'United States' },
//   { code: 'VN', name: 'Vietnam' },
//   { code: 'YE', name: 'Yemen' },
//   { code: 'ZW', name: 'Zimbabwe' },
// ];

// Initial Values
const initialValues = {
  firstname: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  customerPhoneCode: '',
  billingStreet: '',
  billingCountry: '',
  billingCity: '',
  billingPostCode: '',
  amount: '',
  cardHolder: '',
  cardNumber: '',
  cardExpMonth: '',
  cardExpYear: '',
  cardCvv: '',
};

// Reusable Input Field Component
export const CustomField = ({ name, label }) => (
  <Grid item xs={12} sm={6}>
    <Field name={name}>
      {({ field, meta }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
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
    </Field>
  </Grid>
);

// Extract Query Parameters
const useQueryParams = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

export default function FormFieldMonrem() {
  const [apiValidationErrors, setApiValidationErrors] = useState([]);
  const userInfo = useContext(IPInfoContext);
  const query = useQueryParams();
  const merchantId = query.get('mid') && base64Decode(query.get('mid'));
  const siteToken = query.get('st') && base64Decode(query.get('st'));
  const transactionIdFromQuery = query.get('transactionId');
  const statusFromQuery = query.get('status');
  const [openModal, setOpenModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processPaymentError, setProcessPaymentError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionMessage, setTransactionMessage] = useState(null);
  const navigate = useNavigate();

  // React Query Mutation process payment monrem
  const processPaymentMonremMutation = useMutation({
    mutationFn: processPaymentMonrem,
    onSuccess: (data) => {
      if (data?.ok === false) {
        setOpenModal(false);
        setProcessPaymentError(data?.message);
        toast.error(data?.message);
      } else if (data?.redirect) {
        window.open(data?.redirect?.url);
        setOpenModal(false);
      } else {
        setPaymentSuccess(true); // stop processing and show status
        setTransactionId(data?.transaction_id);
        setTransactionStatus(data?.status);
        setTransactionMessage(data?.status_description);
        setProcessPaymentError(null);
        setApiValidationErrors([]);
      }
    },
    onError: () => {
      setOpenModal(false);
      toast.error('Failed to process payment');
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
  const orderId = uuidv1();

  // process payment data fast
  const handlePaymentMonrem = async (values, { setSubmitting, setErrors }) => {
    // change dollars to cents
    const amountInCents = Math.round(values.amount * 100);
    const {
      firstname,
      middleName,
      lastName,
      email,
      phone,
      customerPhoneCode,
      cardCvv,
      ...filteredValues
    } = values;

    const origin = window.location.origin; // http://localhost:3031
    const pathname = window.location.pathname; // /dashboard/newtransaction
    const fullUrl = `${origin}${pathname}`; // full URL
    try {
      setOpenModal(true);
      setPaymentSuccess(false); // start processing modal
      // clear state when modal open
      setTransactionId(null);
      setTransactionStatus(null);
      setTransactionMessage(null);

      const procesPaymentValue = {
        ...filteredValues,
        orderId,
        ipAddress,
        currency: 'USD',
        description: 'Purchase',
        refererUrl: origin,
        customerFirstName: firstname,
        customerLastName: lastName,
        customerEmail: email,
        customerPhone: phone,
        amount: amountInCents,
        customerPhoneCode: `00${customerPhoneCode}`,
        cardSecurityCode: cardCvv,
        returnUrl: fullUrl,
        callbackUrl: fullUrl,
        siteToken,
        merchantId,
      };

      await processPaymentMonremMutation.mutateAsync(procesPaymentValue, {
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
          setOpenModal(false);
        },
      });
    } catch (error) {
      console.error('Error:', error);
      setApiValidationErrors(error?.error || []);
      toast.error('Error processing payment');
      setOpenModal(false);
    }
    setSubmitting(false);
  };

  // show after 3ds redirect
  useEffect(() => {
    if (transactionIdFromQuery && statusFromQuery) {
      setOpenModal(true);
      setPaymentSuccess(true);
      setTransactionId(transactionIdFromQuery);
      setTransactionStatus(statusFromQuery);
    }
  }, [transactionIdFromQuery, statusFromQuery]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Secure Payment Form
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handlePaymentMonrem}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {/* CUSTOMER DETAILS */}
              <Grid item xs={12}>
                <Typography variant="h6">Customer Details</Typography>
              </Grid>
              <CustomField name="firstname" label="First Name" />
              <CustomField name="middleName" label="Middle Name" />
              <CustomField name="lastName" label="Last Name" />
              <CustomField name="email" label="Email Address" />
              <CustomField name="customerPhoneCode" label="Phone Code" />
              <CustomField name="phone" label="Phone Number" />
              <CustomField name="amount" label="Amount" />
              <Grid item xs={12}>
                <Typography variant="h6">Billing Details</Typography>
              </Grid>
              <CustomField name="billingStreet" label="Billing Address" />
              <CustomField name="billingCity" label="Billing City" />
              <CustomField name="billingPostCode" label="Billing Postcode" />

              <Field name="billingCountry">
                {({ field, form, meta }) => (
                  <Autocomplete
                    options={countryList}
                    sx={{ width: 418, ml: 2, mt: 2 }}
                    getOptionLabel={(option) => `${option.country_name} (${option.country_code})`}
                    value={
                      countryList.find((country) => country.country_code === field.value) || null
                    } // Set selected value by country_name
                    onChange={(_, newValue) => {
                      form.setFieldValue(field.name, newValue ? newValue.country_code : ''); // Store country_name
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

              {/* Card details */}
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
              <CustomField name="cardExpMonth" label="Expiration Month" placeholder="MM" />
              <CustomField name="cardExpYear" label="Expiration Year" placeholder="YY" />
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
                  Next
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
      <PaymentStatusMonremModal
        open={openModal}
        success={paymentSuccess}
        onClose={() => {
          setOpenModal(false);
          setTransactionId(null);
          setTransactionStatus(null);
          setTransactionMessage(null);
          if (transactionIdFromQuery && statusFromQuery) {
            navigate(`/dashboard/transactions`);
            // navigate transaction page if verify response is 36
          }
        }}
        transactionMessage={transactionMessage}
        transactionId={transactionId}
        transactionStatus={transactionStatus}
      />
    </Container>
  );
}
