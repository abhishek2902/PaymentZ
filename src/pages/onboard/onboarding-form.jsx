import { z } from 'zod';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import apiClient from 'src/utils/apiClient';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'src/components/snackbar';

import { Box, Grid, Container, Typography } from '@mui/material';

import FooterBar from 'src/components/onboarding/FooterBar';
import FeatureCard from 'src/components/onboarding/feature-card';
import PhaseHeaderCard from 'src/components/onboarding/PhaseHeaderCard';
import SupportHelpCard from 'src/components/onboarding/SupportHelpCard';
import OnboardingSteps from 'src/components/onboarding/onboarding-steps';
import OnboardingHeader from 'src/components/onboarding/onboarding-header';
import Step1AllSectionsCard from 'src/components/onboarding/Step1AllSectionsCard';
import Step3PaymentInfoCard from 'src/components/onboarding/Step3PaymentInfoCard';
import { formatToastError } from 'src/utils/formatToastError';

// -------------------- ZOD SCHEMA --------------------
const personalSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(6, 'Required'),
  position: z.string().min(1, 'Required'),
  linkedin: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

const companySchema = z.object({
  companyName: z.string().min(1, 'Required'),
  registrationNo: z.string().optional().or(z.literal('')),
  industry: z.string().min(1, 'Required'),
  industryOther: z.string().optional().or(z.literal('')),
  website: z.string().url('Enter a valid URL'),
  companySize: z.string().min(1, 'Company size is required'),
  yearsInBusiness: z.string().min(1, 'Years in business is required'),
  addressLine1: z.string().min(1, 'Required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zipcode: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
});

const processingSchema = z.object({
  annualVolume: z.string().min(1, 'Required'),
  // avgTxn: z.preprocess(
  //   (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v),
  //   z.number({ invalid_type_error: 'Enter a number' }).optional().positive('Must be > 0')
  // ),
  avgTxn: z.string().optional().or(z.literal('')),
  banksCount: z.string().min(1, 'Required'),
  plan: z.string().optional().or(z.literal('')),
  banksDetails: z.string().optional().or(z.literal('')),
  currentProcessors: z.string().optional().or(z.literal('')),
});

const extraSchema = z.object({
  heardFrom: z.string().min(1, 'Required'),
  notes: z.string().optional().or(z.literal('')),
  agreeTos: z.literal(true, { errorMap: () => ({ message: 'You must accept Terms' }) }),
  confirmAccuracy: z.literal(true, { errorMap: () => ({ message: 'Confirmation required' }) }),
  optIn: z.boolean().optional(),
});

const step1Schema = z.object({
  personal: personalSchema,
  company: companySchema,
  processing: processingSchema,
  extra: extraSchema,
});

// helper – convert zod issues into section-wise error/touched maps
function buildSectionErrors(issues) {
  const E = { personal: {}, company: {}, processing: {}, extra: {} };
  const T = { personal: {}, company: {}, processing: {}, extra: {} };
  issues.forEach(({ path, message }) => {
    const [section, field] = path;
    if (E[section]) {
      E[section][field] = message;
      T[section][field] = true;
    }
  });
  return { errors: E, touched: T };
}
// ----------------------------------------------------

// ---------- ZOD (Step 2 — KYC Upload) ----------
const MAX_MB = 2;
const fileReq = z
  .instanceof(File, { message: 'Required' })
  .refine((f) => f.size <= MAX_MB * 1048576, { message: `Max ${MAX_MB}MB` });

const fileOpt = z
  .union([z.instanceof(File), z.null()])
  .optional()
  .refine((v) => v == null || (v instanceof File && v.size <= MAX_MB * 1048576), {
    message: `Max ${MAX_MB}MB`,
  });

export const step2Schema = z.object({
  // Identity
  idDoc: fileReq,
  proofAddress: fileReq,
  selfie: fileOpt, // optional

  // Business
  regCert: fileReq,
  taxIdDoc: fileReq,
  businessLicense: fileOpt,
  incorporationDocs: fileReq,

  // Financial
  bankStatements: z.array(fileReq).min(1, 'Upload at least one statement'),
  financialStatement: fileOpt,

  // Additional
  processingHistory: fileOpt,
  otherSupporting: fileOpt,

  // Checklist (informational)
  checklist: z
    .object({
      id: z.boolean().optional(),
      address: z.boolean().optional(),
      selfie: z.boolean().optional(),
      bank: z.boolean().optional(),
      registration: z.boolean().optional(),
      readable: z.boolean().optional(),
    })
    .optional(),
});

// Map Zod issues to your error/touched shape
function buildStep2Errors(issues) {
  const E = {
    idDoc: undefined,
    proofAddress: undefined,
    selfie: undefined,
    regCert: undefined,
    taxIdDoc: undefined,
    businessLicense: undefined,
    incorporationDocs: undefined,
    bankStatements: undefined,
    financialStatement: undefined,
    processingHistory: undefined,
    otherSupporting: undefined,
    checklist: undefined,
  };
  const T = { ...E };

  issues?.forEach(({ path, message }) => {
    const k = path[0];
    // For arrays (bankStatements), collapse per-index messages to field-level
    if (k === 'bankStatements') {
      E.bankStatements = E.bankStatements || message;
      T.bankStatements = true;
    } else if (k in E) {
      E[k] = message;
      T[k] = true;
    }
  });

  return { errors: E, touched: T };
}

// ---------- ZOD (Step 3 — Payment Information) ----------
const bankCore = z.object({
  bankName: z.string().min(1, 'Required'),
  holderName: z.string().min(1, 'Required'),
  accountNumber: z
    .string()
    .min(8, 'Must be at least 8 digits')
    .max(16, 'Must be at most 16 digits')
    .regex(/^\d+$/, 'Account number must contain only digits'),
  routingNumber: z
    .string()
    .regex(/^\d{9}$/, 'Routing number must be exactly 9 digits'),
  accountType: z.string().min(1, 'Required'),
  currency: z.string().min(1, 'Required'),
  swift: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || /^[A-Z0-9]{8,11}$/.test(val),
      'SWIFT/BIC must be 8–11 characters (A–Z, 0–9)'
    ),
  address: z.string().min(1, 'Required'),
});

const cryptoDetails = z.object({
  network: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
});

export const step3PaymentSchema = z
  .object({
    bank: bankCore,
    backupEnabled: z.boolean().default(false),
    // backupBank: bankCore.partial(), // required only if enabled
    cryptoEnabled: z.boolean().default(false),
    crypto: z.union([cryptoDetails, z.object({}).passthrough()]),
    prefs: z.object({
      primaryMethod: z.enum(['Bank', 'Crypto'], { required_error: 'Required' }),
      frequency: z.enum(['Daily', 'Weekly', 'Biweekly', 'Monthly'], { required_error: 'Required' }),
      timeZone: z.string().min(1, 'Required'),
      minThreshold: z.preprocess(
        (v) => (v === undefined || v === '' ? 0 : Number(v)),
        z.number({ invalid_type_error: 'Enter a number' }).min(0, 'Must be ≥ 0')
      ),
      notifyEmail: z.boolean().optional(),
      notifySmsLarge: z.boolean().optional(),
      weeklySummary: z.boolean().optional(),
      backupEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
      emergencyPhone: z.string().optional().or(z.literal('')),
    }),
    terms: z.object({
      ownership: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
      wallet: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
      accuracy: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
      tos: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
      test: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
      compliance: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
    })
  })
  .refine((d) => (d.backupEnabled ? bankCore.safeParse(d.backupBank).success : true), {
    path: ['backupBank'],
    message: 'Fill backup account details',
  })
  .refine((d) => (d.cryptoEnabled ? cryptoDetails.safeParse(d.crypto).success : true), {
    path: ['crypto'],
    message: 'Provide crypto details',
  });

export function buildStep3PaymentErrors(issues) {
  const E = { bank: {}, backupBank: {}, crypto: {}, prefs: {}, terms: {} };
  const T = { bank: {}, backupBank: {}, crypto: {}, prefs: {}, terms: {} };
  issues.forEach(({ path, message }) => {
    const [root, k] = path;
    if (root in E) {
      if (typeof k === 'string') {
        E[root][k] = message;
        T[root][k] = true;
      } else {
        // whole-object path like ['backupBank']
        E[root]._ = message;
        T[root]._ = true;
      }
    } else {
      E[root] = message;
      T[root] = true;
    }
  });
  return { errors: E, touched: T };
}

// helper: make a live updater for a section
function makeLiveUpdater(schema, setState, setErrors, setTouched) {
  return (key, value) => {
    // mark touched now
    setTouched((t) => ({ ...t, [key]: true }));

    // update state and validate only this field with the new snapshot
    setState((prev) => {
      const next = { ...prev, [key]: value };
      const parsed = schema.safeParse(next);

      let message;
      if (!parsed.success) {
        const issue = parsed.error.issues.find((i) => i.path[0] === key);
        message = issue?.message;
      }

      // set / clear the error for this field only
      setErrors((e) => ({ ...e, [key]: message }));

      return next;
    });
  };
}

export default function OnboardingForm() {
  const navigate = useNavigate();
  const { onboardingId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  // Step state to drive <OnboardingSteps />
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [personal, setPersonal] = useState({});
  const [company, setCompany] = useState({});
  const [processing, setProcessing] = useState({});
  // add Step 2 state
  const [docs, setDocs] = useState({
    // Identity
    idDoc: null,
    proofAddress: null,
    selfie: null,

    // Business
    regCert: null,
    taxIdDoc: null,
    businessLicense: null,
    incorporationDocs: null,

    // Financial
    bankStatements: [], // <- array
    financialStatement: null,

    // Additional
    processingHistory: null,
    otherSupporting: null,

    // Checklist (optional info)
    checklist: {
      id: false,
      address: false,
      selfie: false,
      bank: false,
      registration: false,
      readable: false,
    },
  });

  const [docsErrors, setDocsErrors] = useState({});
  const [docsTouched, setDocsTouched] = useState({});
  const [extra, setExtra] = useState({
    heardFrom: '',
    agreeTos: false,
    confirmAccuracy: false,
    optIn: false,
  });

  // Step 3 state
  const [payV2, setPayV2] = useState({
    bank: {
      bankName: '',
      holderName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: '',
      currency: 'USD',
      swift: '',
      address: '',
    },
    backupEnabled: false,
    backupBank: {
      bankName: '',
      holderName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: '',
      currency: 'USD',
      swift: '',
      address: '',
    },
    cryptoEnabled: false,
    crypto: { network: '', address: '' },
    prefs: {
      primaryMethod: 'Bank',
      frequency: 'Weekly',
      timeZone: 'UTC+00:00 (UTC)',
      minThreshold: 0,
      notifyEmail: true,
      weeklySummary: true,
      backupEmail: '',
      emergencyPhone: '',
    },
    terms: {
      ownership: false,
      wallet: false,
      accuracy: false,
      tos: false,
      test: false,
      compliance: false,
    },
  });
  const [payV2Errors, setPayV2Errors] = useState({});
  const [payV2Touched, setPayV2Touched] = useState({});

  const [payment, setPayment] = useState({
    method: 'Bank',
    payoutCurrency: 'USD',
    schedule: 'Weekly',
    beneficiaryAddress: '',
    bankAccounts: [
      { holder: '', bank: '', account: '', routing: '', country: '', currency: 'USD' },
    ],
    crypto: { network: '', address: '' },
    notes: '',
  });
  const [payErrors, setPayErrors] = useState({});
  const [payTouched, setPayTouched] = useState({});

  // error/touched stores for Step1AllSectionsCard
  const [errorsPersonal, setErrorsPersonal] = useState({});
  const [touchedPersonal, setTouchedPersonal] = useState({});
  const [errorsCompany, setErrorsCompany] = useState({});
  const [touchedCompany, setTouchedCompany] = useState({});
  const [errorsProcessing, setErrorsProcessing] = useState({});
  const [touchedProcessing, setTouchedProcessing] = useState({});
  const [errorsExtra, setErrorsExtra] = useState({});
  const [touchedExtra, setTouchedExtra] = useState({});
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');

  const onPersonalChange = makeLiveUpdater(
    personalSchema,
    setPersonal,
    setErrorsPersonal,
    setTouchedPersonal
  );

  const onCompanyChange = makeLiveUpdater(
    companySchema,
    setCompany,
    setErrorsCompany,
    setTouchedCompany
  );

  const onProcessingChange = makeLiveUpdater(
    processingSchema,
    setProcessing,
    setErrorsProcessing,
    setTouchedProcessing
  );

  const onExtraChange = makeLiveUpdater(extraSchema, setExtra, setErrorsExtra, setTouchedExtra);

  // Live validator for Step 2 fields
  function changeDocKyc(key, value, msg) {
    // mark touched
    setDocsTouched((t) => ({ ...t, [key]: true }));

    // apply local file-size/type message coming from UploadTile (if any)
    if (msg) {
      setDocsErrors((e) => ({ ...e, [key]: msg }));
    }

    // update value then validate this field against the full schema
    setDocs((prev) => {
      const next = { ...prev, [key]: value };
      const parsed = step2Schema.safeParse(next);

      // compute field-level message (collapse array index errors)
      let fieldMsg;
      if (!parsed.success) {
        const issue =
          parsed.error.issues.find((i) => i.path[0] === key) ||
          parsed.error.issues.find((i) => i.path[0] === key && typeof i.path[1] === 'number');
        fieldMsg = issue?.message;
      }

      setDocsErrors((e) => ({ ...e, [key]: fieldMsg })); // undefined clears the error
      return next;
    });
  }

  // live updaters
  const changePayV2Root = (key, value) => {
    setPayV2((s) => ({ ...s, [key]: value }));
    setPayV2Touched((t) => ({ ...t, [key]: true }));
    setPayV2Errors((e) => ({
      ...e,
      bank: { ...(e.bank || {}), [key]: undefined }, //  clears error when user edits
    }));
  };

  const changeBankPrimary = (k, v) => {
    setPayV2((s) => ({ ...s, bank: { ...s.bank, [k]: v } }));
    setPayV2Touched((t) => ({ ...t, bank: { ...(t.bank || {}), [k]: true } }));
    setPayV2Errors((e) => ({
      ...e,
      bank: { ...(e.bank || {}), [k]: undefined }, //  clears error when user edits
    }));
  };

  const changeBankBackup = (k, v) => {
    setPayV2((s) => ({ ...s, backupBank: { ...s.backupBank, [k]: v } }));
    setPayV2Touched((t) => ({ ...t, backupBank: { ...(t.backupBank || {}), [k]: true } }));
    setPayV2Errors((e) => ({
      ...e,
      backupBank: { ...(e.backupBank || {}), [k]: undefined }, //  clears error when user edits
    }));
  };

  const changeCrypto = (k, v) => {
    setPayV2((s) => ({ ...s, crypto: { ...s.crypto, [k]: v } }));
    setPayV2Touched((t) => ({ ...t, crypto: { ...(t.crypto || {}), [k]: true } }));
    setPayV2Errors((e) => ({
      ...e,
      crypto: { ...(e.crypto || {}), [k]: undefined }, // clears error when user edits
    }));
  };

  const handleSubmitStep2 = async () => {

    const Bankres = step3PaymentSchema.safeParse(payV2);
    const Docres = step2Schema.safeParse(docs);

    if (!Bankres.success) {
      toast.error(formatToastError(Bankres));
    }

    if (!Docres.success) {
      toast.error(formatToastError(Docres));
    }

    if (Bankres.success && Docres.success) {
      try {
        setSubmitting(true);
        const formData = new FormData();

        // 🏦 Primary Bank Details
        formData.append('accountHolderName', payV2.bank.holderName || '');
        formData.append('primaryPaymentMethod', payV2.prefs.primaryMethod || '');
        formData.append('bankName', payV2.bank.bankName || '');
        formData.append('accountType', payV2.bank.accountType || '');
        formData.append('swiftBic', payV2.bank.swift || '');
        formData.append('network', payV2.crypto?.network || '');
        formData.append('routingNumber', payV2.bank.routingNumber || '');
        formData.append('currency', payV2.bank.currency || '');
        formData.append('paymentFrequency', payV2.prefs.frequency || '');
        formData.append('accountNumber', payV2.bank.accountNumber || '');
        formData.append('bankAddress', payV2.bank.address || '');
        formData.append('timeZone', payV2.prefs.timeZone || '');
        formData.append('backupEmail', payV2.prefs.backupEmail || '');
        formData.append('walletAddress', payV2.crypto?.address || '');
        formData.append('emergencyPhone', payV2.prefs.emergencyPhone || '');

        // 🧾 Attach files (from docs state)
        if (docs.idDoc) formData.append('govtIdOrPassport', docs.idDoc);
        if (docs.proofAddress) formData.append('proofOfAddress', docs.proofAddress);
        if (docs.regCert) formData.append('businessRegCertificate', docs.regCert);
        if (docs.taxIdDoc) formData.append('taxIdentificationDocument', docs.taxIdDoc);
        if (docs.businessLicense) formData.append('businessLicense', docs.businessLicense);
        if (docs.incorporationDocs) formData.append('articlesOfInc', docs.incorporationDocs);
        if (docs.financialStatement) formData.append('financialStatement', docs.financialStatement);
        if (docs.processingHistory) formData.append('processingHistory', docs.processingHistory);

        // 🧾 Append multiple bank statements (if array)
        if (Array.isArray(docs.bankStatements)) {
          docs.bankStatements.forEach((file) => {
            formData.append('bankStatements', file);
          });
        }

        const res = await apiClient.post(`/onboarding/second-stage/admin/${onboardingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        navigate('/admin/onboarding/thank-you?activeStep=2');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('❌ Step 2 submission failed:', err);
        alert(err.response?.data?.message || 'Something went wrong during Step 2 submission.');
      } finally {
        setSubmitting(false); // 🔑 ALWAYS reset
      }
    }

    const { errors, touched } = buildStep3PaymentErrors(Bankres.error?.issues);
    setPayV2Errors(errors);
    setPayV2Touched(touched);

    const { errors: Docerrors, touched: Doctouched } = buildStep2Errors(Docres.error?.issues);
    setDocsErrors(Docerrors);
    setDocsTouched(Doctouched);
  };

  const features = [
    {
      icon: 'mdi:chart-bar',
      title: 'Advanced Analytics',
      description: 'Real-time insights and comprehensive reporting for all your transactions.',
      color: 'success',
    },
    {
      icon: 'mdi:shield-check',
      title: 'Enterprise Security',
      description: 'Bank-grade security with PCI DSS compliance and fraud protection.',
      color: 'primary',
    },
    {
      icon: 'mdi:headset',
      title: 'Dedicated Support',
      description: '24/7 technical support and dedicated account management.',
      color: 'secondary',
    },
  ];

  const steps = [
    { title: 'Basic Information', subtitle: 'Company & Contact Details' },
    // { title: 'Document Upload', subtitle: 'KYC & Compliance' },
    { title: 'Payment Setup', subtitle: 'Bank & Crypto Addresses' },
  ];

  const handleSubmit = async () => {
    const result = step1Schema.safeParse({ personal, company, processing, extra });

    if (!result.success) {
      toast.error(formatToastError(result));
    }

    if (!emailVerified) {
      setEmailError('Please verify your email before continuing');
      toast.error('Please verify your email before continuing');
    }

    if (result.success && emailVerified) {
      setSubmitting(true);
      try {
        // --- Prepare payload as expected by /Quiklie/onboarding/submit ---
        const payload = {
          firstName: personal.firstName,
          lastName: personal.lastName,
          email: personal.email,
          phoneNumber: personal.phone,
          linkedinUrl: personal.linkedin || '',
          positionTitle: personal.position,
          password: '', // leave empty or capture from UI if required
          name: company.companyName,
          businessRegNumber: company.registrationNo || '',
          industryType: company.industry,
          website: company.website,
          companySize: company.companySize,
          businessYears: company.yearsInBusiness,
          description: company.description,
          companySearchSource: extra.heardFrom,
          created_by:"22",
          street1: company.addressLine1,
          street2: company.addressLine2 || '',
          suburb: '',
          town: 'abc',
          city: company.city,
          state: company.state,
          country: company.country,
          postcode: company.zipcode,
          annualProcessingVolume: processing.annualVolume,
          avgTransactionSize: Number(processing.avgTxn) || 0,
          bankYouBring: processing.banksCount,
          bankNamesDetails: processing.banksDetails,
          currentPaymentProcessors: processing.currentProcessors,
        };

        // --- POST API call ---
        const res = await apiClient.post('/onboarding/admin', payload);

        // clear errors
        setErrorsPersonal({});
        setErrorsCompany({});
        setErrorsProcessing({});
        setErrorsExtra({});
        setTouchedPersonal({});
        setTouchedCompany({});
        setTouchedProcessing({});
        setTouchedExtra({});

        navigate('/admin/onboarding/thank-you');

        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (err) {
        console.error('❌ Onboarding submission failed:', err);
        alert(err.response?.data?.message || 'Something went wrong during onboarding submission.');
      } finally {
        setSubmitting(false); // 🔑 ALWAYS reset
      }
      return;
    }

    // --- Validation errors ---
    const { errors, touched } = buildSectionErrors(result.error.issues);
    setErrorsPersonal(errors.personal);
    setErrorsCompany(errors.company);
    setErrorsProcessing(errors.processing);
    setErrorsExtra(errors.extra);
    setTouchedPersonal((s) => ({ ...s, ...touched.personal }));
    setTouchedCompany((s) => ({ ...s, ...touched.company }));
    setTouchedProcessing((s) => ({ ...s, ...touched.processing }));
    setTouchedExtra((s) => ({ ...s, ...touched.extra }));
  };

  // Sync with ?activeStep= in URL
  useEffect(() => {
    const stepFromUrl = parseInt(searchParams.get('activeStep'), 10);
    if (!Number.isNaN(stepFromUrl)) {
      setActiveStep(stepFromUrl);
    }
  }, [searchParams]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        background: 'linear-gradient(90deg, #F5F8FF 0%, #FFFFFF 45%, #F7F4FF 100%)',
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <OnboardingHeader />

        {/* Hero */}
        <Box textAlign="center" mt={8} mb={6}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              mx: 'auto',
              mb: 2,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              backgroundImage: (t) =>
                `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
            }}
          >
            <Icon icon="mdi:account-plus" width={28} />
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Welcome to Quiklie Payments Admin Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Join our network of payment processing partners and unlock powerful tools to manage your
            merchant portfolio with industry-leading technology.
          </Typography>
        </Box>

        {/* Features */}
        <Grid container spacing={3} mb={6}>
          {features.map((f) => (
            <Grid key={f.title} item xs={12} md={4}>
              <FeatureCard {...f} />
            </Grid>
          ))}
        </Grid>

        {/* Steps – now controlled */}
        <OnboardingSteps steps={steps} activeIndex={activeStep} />

        {/* Step content */}
        <Box sx={{ mt: 6 }}>
          {activeStep === 0 ? (
            <>
              <PhaseHeaderCard
                phase={1}
                title="Basic Information"
                subtitle="Tell us about yourself and your business"
                sx={{ mb: 2 }}
              />
              <Step1AllSectionsCard
                personal={personal}
                company={company}
                processing={processing}
                extra={extra}
                onSubmit={handleSubmit}
                onPersonalChange={onPersonalChange}
                onCompanyChange={onCompanyChange}
                onProcessingChange={onProcessingChange}
                onExtraChange={onExtraChange}
                // pass errors/touched so red borders show
                errorsPersonal={errorsPersonal}
                touchedPersonal={touchedPersonal}
                errorsCompany={errorsCompany}
                touchedCompany={touchedCompany}
                errorsProcessing={errorsProcessing}
                touchedProcessing={touchedProcessing}
                errorsExtra={errorsExtra}
                touchedExtra={touchedExtra}
                emailVerified={emailVerified}
                setEmailVerified={setEmailVerified}
                emailError={emailError}
                setEmailError={setEmailError}
                submitting={submitting}
              />
            </>
          // ) : activeStep === 1 ? (
          //   <>
          //     <PhaseHeaderCard
          //       phase={2}
          //       title="Document Upload"
          //       subtitle="KYC & Compliance"
          //       sx={{ mb: 2 }}
          //     />
          //     <Step2KycUploadCard
          //       data={docs}
          //       onChange={(k, v, m) => changeDocKyc(k, v, m)} //  live validation + UploadTile msg
          //       onChecklist={(k, v) =>
          //         setDocs((s) => ({ ...s, checklist: { ...(s.checklist || {}), [k]: v } }))
          //       }
          //       errors={docsErrors}
          //       touched={docsTouched}
          //       onSubmit={handleSubmitStep2}
          //     />
          //   </>
          ) : activeStep === 2 ? (
            <>
              <PhaseHeaderCard
                phase={2}
                title="Banking Information and Document Upload"
                subtitle="Bank account details, crypto wallets & payout preferences"
                sx={{ mb: 2 }}
              />
              <Step3PaymentInfoCard
                data={payV2}
                onChange={changePayV2Root}
                onBankChange={changeBankPrimary}
                onBackupChange={changeBankBackup}
                onCryptoChange={changeCrypto}
                errors={payV2Errors}
                touched={payV2Touched}
                onSubmit={handleSubmitStep2}

                Docdata={docs}
                onDocChange={(k, v, m) => changeDocKyc(k, v, m)}
                onDocChecklist={(k, v) =>
                  setDocs((s) => ({ ...s, checklist: { ...(s.checklist || {}), [k]: v } }))
                }
                Docerrors={docsErrors}
                Doctouched={docsTouched}
                submitting={submitting}
              />
            </>
          ) : null}
        </Box>
        <SupportHelpCard sx={{ mt: 3 }} />
        <FooterBar
          logo="/Levanta-favicon.png"
          links={[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Support', href: '/support' },
          ]}
          sx={{ mt: 4 }}
        />
      </Container>
    </Box>
  );
}
