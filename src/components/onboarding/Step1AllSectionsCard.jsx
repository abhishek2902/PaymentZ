// import React, { useState } from 'react';
import React, { useState, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
// import { Country, State, City } from 'country-state-city';
import { useQuery } from '@tanstack/react-query';
import apiClient from 'src/utils/apiClient';

import {
  Box,
  Card,
  Grid,
  Link,
  Stack,
  Button,
  Divider,
  Tooltip,
  Checkbox,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  CardContent,
  FormControl,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

/**
 * Step1AllSectionsCard
 * One card containing:
 *  - Personal Information
 *  - Company Information
 *  - Processing Requirements
 *  - Additional Information (incl. info box, checkboxes, submit)
 *
 * Props (Formik/Hook-Form friendly):
 *  personal, company, processing, extra : objects
 *  onPersonalChange, onCompanyChange, onProcessingChange, onExtraChange : (key, value) => void
 *  errorsPersonal, touchedPersonal, errorsCompany, touchedCompany, errorsProcessing, touchedProcessing,
 *  errorsExtra, touchedExtra : objects
 *  onSubmit, submitting, termsHref, privacyHref
 */

export default function Step1AllSectionsCard({
  personal = {},
  company = {},
  processing = {},
  extra = {},
  onPersonalChange,
  onCompanyChange,
  onProcessingChange,
  onExtraChange,
  errorsPersonal = {},
  touchedPersonal = {},
  errorsCompany = {},
  touchedCompany = {},
  errorsProcessing = {},
  touchedProcessing = {},
  errorsExtra = {},
  touchedExtra = {},
  onSubmit,
  submitting = false,
  termsHref = '#',
  privacyHref = '#',
  sx,
  emailVerified,
  setEmailVerified,
  emailError,
  setEmailError,
}) {
  // helpers
  const setP = (k) => (e) => onPersonalChange?.(k, e.target.value);
  const setC = (k) => (e) => onCompanyChange?.(k, e.target.value);
  const setR = (k) => (e) => onProcessingChange?.(k, e.target.value);
  const setE = (k) => (e) =>
    onExtraChange?.(k, typeof e?.target?.checked === 'boolean' ? e.target.checked : e.target.value);

  const errP = (k) => Boolean(touchedPersonal?.[k] && errorsPersonal?.[k]);
  const helpP = (k) => (touchedPersonal?.[k] && errorsPersonal?.[k]) || ' ';

  const errC = (k) => Boolean(touchedCompany?.[k] && errorsCompany?.[k]);
  const helpC = (k) => (touchedCompany?.[k] && errorsCompany?.[k]) || ' ';

  const errR = (k) => Boolean(touchedProcessing?.[k] && errorsProcessing?.[k]);
  const helpR = (k) => (touchedProcessing?.[k] && errorsProcessing?.[k]) || ' ';

  const errE = (k) => Boolean(touchedExtra?.[k] && errorsExtra?.[k]);
  const helpE = (k) => (touchedExtra?.[k] && errorsExtra?.[k]) || ' ';

  const { data: allEnums = {}, isLoading } = useQuery({
    queryKey: ['all-enums'],
    queryFn: async () => {
      const res = await apiClient.get('/enums/all');
      return res.data;
    },
  });

  const positionData = allEnums.PositionTitle || [];
  const industryData = allEnums.IndustryType || [];
  const YEARS = allEnums.BusinessYears || [];
  const annualVolumeData = allEnums.MonthlyProcessingVolume || [];
  const companySearchSourceData = allEnums.CompanySearchSource || [];
  const COMPANY_SIZES = allEnums.CompanySize || [];
  const BANKS = allEnums.BanksYouBring || [];
  const PLANS = allEnums.SubscriptionPlan || [];

  const BANKS_EXAMPLE = [
    'Example:',
    'Chase Bank – Commercial Account',
    'Bank of America – Business Checking',
    'Wells Fargo – Merchant Services',
  ].join('\n');

  const pasteExample = () => onProcessingChange?.('banksDetails', BANKS_EXAMPLE);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  
  // const [selectedCountry, setSelectedCountry] = useState(company.country || '');
  // const [selectedState, setSelectedState] = useState(company.state || '');

  // const countries = Country.getAllCountries();
  // const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  // const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

  // ✅ country-state-city lazy loader
  const [cscModule, setCscModule] = useState(null);
  const [loadingCsc, setLoadingCsc] = useState(false);

  const loadCsc = useCallback(async () => {
    if (cscModule) return cscModule;

    try {
      setLoadingCsc(true);
      const mod = await import('country-state-city');
      setCscModule(mod);
      return mod;
    } finally {
      setLoadingCsc(false);
    }
  }, [cscModule]);

  // derive selected values from company (Formik values)
  const selectedCountry = company.country || '';
  const selectedState = company.state || '';

  const countries = useMemo(() => {
    if (!cscModule) return [];
    return cscModule.Country.getAllCountries();
  }, [cscModule]);

  const states = useMemo(() => {
    if (!cscModule || !selectedCountry) return [];
    return cscModule.State.getStatesOfCountry(selectedCountry);
  }, [cscModule, selectedCountry]);

  const cities = useMemo(() => {
    if (!cscModule || !selectedCountry || !selectedState) return [];
    return cscModule.City.getCitiesOfState(selectedCountry, selectedState);
  }, [cscModule, selectedCountry, selectedState]);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, ...sx }}>
      <CardContent sx={{ p: 3 }}>
        {/* ---------------- Personal Information ---------------- */}
        <SectionHeader icon="mdi:account" color="primary" title="Personal Information" />
        <Grid container spacing={2.5}>

          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              placeholder="John"
              required
              fullWidth
              value={personal.firstName || ''}
              onChange={setP('firstName')}
              error={errP('firstName')}
              helperText={helpP('firstName')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              placeholder="Doe"
              required
              fullWidth
              value={personal.lastName || ''}
              onChange={setP('lastName')}
              error={errP('lastName')}
              helperText={helpP('lastName')}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
            <TextField
              label="Email Address"
              placeholder="john@company.com"
              type="email"
              required
              fullWidth
              value={personal.email || ''}
              onChange={(e) => {
                setP('email')(e);
                setEmailVerified(false); // reset verification if user edits email
                setOtp("");
              }}
              error={!!errP('email') || !!(!emailVerified && emailError)}
              helperText={
                (!emailVerified && emailError ? emailError : '')
              }
            />

            {/* ✅ Tick mark if verified */}
            {emailVerified && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)',
                  color: 'success.main',
                }}
              >
                <Icon icon="mdi:check-circle" width={24} />
              </Box>
            )}

            {/* Small verify button */}
            {!emailVerified && (
              <Button
                size="small"
                variant="outlined"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)',
                }}
                onClick={async () => {
                  if (!personal.email || errP('email')) return;

                  try {
                    setOtpError('');
                    setSendingOtp(true);
                    setOtpModalOpen(true);
                    // Call OTP generate API
                    const res = await apiClient.post(`/otp/generate?email=${encodeURIComponent(personal.email)}`, {
                      email: personal.email,
                    });
                  } catch (err) {
                    setOtpError('Failed to send OTP. Try again.');
                  } finally {
                    setSendingOtp(false);
                  }
                }}
                disabled={!personal.email || !!errP('email') || sendingOtp}
              >
                Verify
              </Button>
            )}
          </Grid>

          <Dialog open={otpModalOpen} onClose={() => setOtpModalOpen(false)}>
            <DialogTitle>Verify Email</DialogTitle>
            <DialogContent>
              <Typography mb={2}>Enter the 6-digit OTP sent to {personal.email}</Typography>
              <TextField
                fullWidth
                placeholder="OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError(''); // clear error on typing
                }}
                error={!!otpError}
                helperText={otpError} // show "Wrong OTP" here
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={async () => {
                  if (!personal.email) return;
                  try {
                    setOtpError('');
                    setSendingOtp(true);
                    const res = await apiClient.post(`/otp/generate?email=${encodeURIComponent(personal.email)}`, {
                      email: personal.email,
                    });
                  } catch (err) {
                    setOtpError('Failed to send OTP. Try again.');
                  } finally {
                    setSendingOtp(false);
                  }
                }}
                disabled={sendingOtp}
              >
                Resend
              </Button>

              <Button onClick={() => setOtpModalOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={async () => {
                  if (!otp || !personal.email) return;

                  try {
                    setVerifyingOtp(true);

                    const res = await apiClient.post(
                      `/otp/verify?email=${encodeURIComponent(personal.email)}&otp=${otp}`
                    );

                    if (res.data?.isValid || res.data?.success) {
                      setEmailVerified(true);
                      setOtpModalOpen(false);
                      setOtp('');
                      setOtpError('');
                    } else {
                      setEmailVerified(false);
                      setOtpError(res.data?.message || 'Invalid OTP');
                    }
                  } catch (err) {
                    setOtpError('Failed to verify OTP. Try again.');
                  } finally {
                    setVerifyingOtp(false);
                  }
                }}
                disabled={verifyingOtp || !otp}
              >
                Verify
              </Button>
            </DialogActions>
          </Dialog>

          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              required
              fullWidth
              value={personal.phone || ''}
              onChange={setP('phone')}
              error={errP('phone')}
              helperText={helpP('phone')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Position/Title *"
              placeholder="Select your position"
              select
              fullWidth
              value={personal.position || ''}
              onChange={setP('position')}
              error={errP('position')}
              helperText={helpP('position')}
            >
              {positionData.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}  md={6}>
            <TextField
              label="LinkedIn Profile (Optional)"
              placeholder="https://linkedin.com/in/johndoe"
              fullWidth
              value={personal.linkedin || ''}
              onChange={setP('linkedin')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* ---------------- Company Information ---------------- */}
        <SectionHeader icon="mdi:domain" color="success" title="Company Information" />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Company Name"
              placeholder="PayTech Solutions Inc."
              required
              fullWidth
              value={company.companyName || ''}
              onChange={setC('companyName')}
              error={errC('companyName')}
              helperText={helpC('companyName')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Business Registration Number (Optional)"
              placeholder="REG123456789"
              fullWidth
              value={company.registrationNo || ''}
              onChange={setC('registrationNo')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Industry/Business Type"
              placeholder="Select your industry"
              required
              select
              fullWidth
              value={company.industry || ''}
              onChange={setC('industry')}
              error={errC('industry')}
              helperText={helpC('industry')}
            >
              {industryData.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Company Website"
              placeholder="https://company.com"
              required
              fullWidth
              value={company.website || ''}
              onChange={setC('website')}
              error={errC('website')}
              helperText={helpC('website')}
            />
          </Grid>
          {company.industry === 'Other' && (
            <Grid item xs={12}>
              <TextField
                label="Please specify your industry"
                fullWidth
                value={company.industryOther || ''}
                onChange={setC('industryOther')}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              label="Company Size *"
              placeholder="Select company size"
              select
              fullWidth
              value={company.companySize || ''}
              onChange={setC('companySize')}
              error={errC('companySize')}
              helperText={helpC('companySize')}
            >
              {COMPANY_SIZES.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Years in Business *"
              placeholder="Select experience"
              select
              fullWidth
              value={company.yearsInBusiness || ''}
              onChange={setC('yearsInBusiness')}
              error={errC('yearsInBusiness')}
              helperText={helpC('yearsInBusiness')}
            >
              {YEARS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={12} sx={{ mt: { xs: 2, md: 3 } }}>
            <TextField
              label="Address Line 1"
              placeholder="123 Main St"
              required
              fullWidth
              value={company.addressLine1 || ''}
              onChange={setC('addressLine1')}
              error={errC('addressLine1')}
              helperText={helpC('addressLine1')}
            />
          </Grid>
          <Grid item xs={12} md={12} mb={3}>
            <TextField
              label="Address Line 2 (Optional)"
              placeholder="Suite, Floor, etc."
              fullWidth
              value={company.addressLine2 || ''}
              onChange={setC('addressLine2')}
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              select
              label="Country"
              fullWidth
              required
              value={selectedCountry}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCountry(value);
                setSelectedState('');
                setC('country')({ target: { value } });
              }}
              error={errC('country')}
              helperText={helpC('country')}
            >
              {countries.map((country) => (
                <MenuItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="State"
              fullWidth
              required
              value={selectedState}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedState(value);
                setC('state')({ target: { value } });
              }}
              error={errC('state')}
              helperText={helpC('state')}
              disabled={!selectedCountry}
            >
              {states.map((state) => (
                <MenuItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="City"
              fullWidth
              required
              value={company.city || ''}
              onChange={setC('city')}
              error={errC('city')}
              helperText={helpC('city')}
              disabled={!selectedState}
            >
              {cities.map((city) => (
                <MenuItem key={city.name} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}
<Grid item xs={12} md={6}>
  <TextField
    select
    label="Country"
    fullWidth
    required
    value={selectedCountry}
    onOpen={loadCsc} // ✅ load library only when dropdown opens
    onFocus={loadCsc} // ✅ iOS friendly
    onChange={(e) => {
      const value = e.target.value;

      // set company.country
      setC('country')({ target: { value } });

      // reset dependent fields
      setC('state')({ target: { value: '' } });
      setC('city')({ target: { value: '' } });
    }}
    error={errC('country')}
    helperText={helpC('country')}
  >
    {loadingCsc && (
      <MenuItem disabled value="">
        Loading countries...
      </MenuItem>
    )}

    {countries.map((country) => (
      <MenuItem key={country.isoCode} value={country.isoCode}>
        {country.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

<Grid item xs={12} md={6}>
  <TextField
    select
    label="State"
    fullWidth
    required
    value={selectedState}
    onOpen={loadCsc}
    onFocus={loadCsc}
    onChange={(e) => {
      const value = e.target.value;

      setC('state')({ target: { value } });

      // reset city when state changes
      setC('city')({ target: { value: '' } });
    }}
    error={errC('state')}
    helperText={helpC('state')}
    disabled={!selectedCountry || loadingCsc}
  >
    {loadingCsc && (
      <MenuItem disabled value="">
        Loading states...
      </MenuItem>
    )}

    {states.map((state) => (
      <MenuItem key={state.isoCode} value={state.isoCode}>
        {state.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

<Grid item xs={12} md={6}>
  <TextField
    select
    label="City"
    fullWidth
    required
    value={company.city || ''}
    onOpen={loadCsc}
    onFocus={loadCsc}
    onChange={setC('city')}
    error={errC('city')}
    helperText={helpC('city')}
    disabled={!selectedState || loadingCsc}
  >
    {loadingCsc && (
      <MenuItem disabled value="">
        Loading cities...
      </MenuItem>
    )}

    {cities.map((city) => (
      <MenuItem key={city.name} value={city.name}>
        {city.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>
          <Grid item xs={12} md={6} >
            <TextField
              label="Zipcode"
              placeholder="485001"
              required
              fullWidth
              value={company.zipcode || ''}
              onChange={setC('zipcode')}
              error={errC('zipcode')}
              helperText={helpC('zipcode')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Business Description"
              placeholder="Describe your business, products/services, and target market..."
              required
              fullWidth
              multiline
              minRows={3}
              value={company.description || ''}
              onChange={setC('description')}
              error={errC('description')}
              helperText={helpC('description')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* ---------------- Processing Requirements ---------------- */}
        <SectionHeader
          icon="mdi:clipboard-text-outline"
          color="secondary"
          title="Processing Requirements"
        />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Expected Monthly Processing Volume"
              select
              required
              fullWidth
              value={processing.annualVolume || ''}
              onChange={setR('annualVolume')}
              error={errR('annualVolume')}
              helperText={helpR('annualVolume')}
            >
              {annualVolumeData.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              label="Average Transaction Size"
              placeholder="50.00"
              required
              fullWidth
              value={processing.avgTxn || ''}
              onChange={setR('avgTxn')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputMode: 'decimal',
              }}
              error={errR('avgTxn')}
              helperText={helpR('avgTxn')}
            />
          </Grid> */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Number of Banks You're Bringing"
              select
              required
              fullWidth
              value={processing.banksCount || ''}
              onChange={setR('banksCount')}
              error={errR('banksCount')}
              helperText={helpR('banksCount')}
            >
              {BANKS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              label="Preferred Subscription Plan"
              select
              required
              fullWidth
              value={processing.plan || ''}
              onChange={setR('plan')}
              error={errR('plan')}
              helperText={helpR('plan')}
            >
              {PLANS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}

          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="Bank Names & Details"
                fullWidth
                multiline
                minRows={4}
                placeholder={BANKS_EXAMPLE}
                value={processing.banksDetails || ''}
                onChange={setR('banksDetails')}
                error={errR('banksDetails')}
                helperText={helpR('banksDetails')}
              />
              <Tooltip title="Insert example">
                <IconButton
                  size="small"
                  onClick={pasteExample}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    bgcolor: 'success.main',
                    color: 'common.white',
                    '&:hover': { bgcolor: 'success.dark' },
                  }}
                >
                  <Icon icon="mdi:content-paste" width={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Current Payment Processors (if any)"
              placeholder="List your current payment processors and any challenges you’re facing…"
              fullWidth
              multiline
              minRows={3}
              value={processing.currentProcessors || ''}
              onChange={setR('currentProcessors')}
              error={errR('currentProcessors')}
              helperText={helpR('currentProcessors')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* ---------------- Additional Information ---------------- */}
        <SectionHeader
          icon="mdi:information-outline"
          color="warning"
          title="Additional Information"
        />
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              label="How did you hear about Quiklie Payments? *"
              placeholder="Select source"
              select
              fullWidth
              value={extra.heardFrom || ''}
              onChange={setE('heardFrom')}
              error={errE('heardFrom')}
              helperText={helpE('heardFrom')}
            >
              {companySearchSourceData.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Special Requirements or Notes"
              placeholder="Any specific requirements, questions, or additional information you'd like to share..."
              fullWidth
              multiline
              minRows={4}
              value={extra.notes || ''}
              onChange={setE('notes')}
              error={errE('notes')}
              helperText={helpE('notes')}
            />
          </Grid>

          {/* Info box */}
          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
              sx={(t) => ({
                p: 2,
                borderRadius: 2,
                bgcolor: t.palette.info.lighter || t.palette.action.hover,
                border: `1px solid ${t.palette.info.light}`,
              })}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'info.main',
                  bgcolor: 'common.white',
                  boxShadow: 1,
                  mt: '2px',
                  flexShrink: 0,
                }}
              >
                <Icon icon="mdi:lightbulb-on-outline" width={16} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                  What happens next?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  After submitting Phase 1, our team will review your application within 24–48
                  hours. If approved, you’ll receive an email with instructions for Phase 2 portal.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Checkboxes */}
          <Grid item xs={12}>
            <FormControl error={errE('agreeTos')} sx={{ mb: 1 }}>
              <FormControlLabel
                control={<Checkbox checked={Boolean(extra.agreeTos)} onChange={setE('agreeTos')} />}
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link href={termsHref} target="_blank" rel="noopener">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href={privacyHref} target="_blank" rel="noopener">
                      Privacy Policy
                    </Link>{' '}
                    <Typography component="span" color="error.main">
                      *
                    </Typography>
                  </Typography>
                }
              />
              {errE('agreeTos') && <FormHelperText>{errorsExtra.agreeTos}</FormHelperText>}
            </FormControl>

            <FormControl error={errE('confirmAccuracy')} sx={{ mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(extra.confirmAccuracy)}
                    onChange={setE('confirmAccuracy')}
                  />
                }
                label={
                  <Typography variant="body2">
                    I confirm that all information provided is accurate and complete{' '}
                    <Typography component="span" color="error.main">
                      *
                    </Typography>
                  </Typography>
                }
              />
              {errE('confirmAccuracy') && (
                <FormHelperText>{errorsExtra.confirmAccuracy}</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormControlLabel
                control={<Checkbox checked={Boolean(extra.optIn)} onChange={setE('optIn')} />}
                label={
                  <Typography variant="body2">
                    I would like to receive updates about Quiklie Payments services and industry
                    insights
                  </Typography>
                }
              />
            </FormControl>
          </Grid>

          {/* Security note + Submit */}
          <Grid item xs={12}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon icon="mdi:shield-check-outline" width={18} style={{ color: '#2e7d32' }} />
                <Typography variant="body2" color="text.secondary">
                  Your information is encrypted and secure
                </Typography>
              </Stack>

              <Button
                variant="contained"
                size="large"
                endIcon={<Icon icon="mdi:arrow-right" />}
                onClick={onSubmit}
                disabled={submitting}
                sx={{
                  px: 2.5,
                  backgroundImage: (t) =>
                    `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                }}
              >
                {submitting ? 'Submitting…' : 'Submit Phase 1 Application'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

/** small internal section header used above */
function SectionHeader({ icon, color = 'primary', title }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          color: `${color}.main`,
          bgcolor: (t) => t.palette?.[color]?.lighter || t.palette.action.hover,
        }}
      >
        <Icon icon={icon} width={16} />
      </Box>
      <Typography variant="h6" fontWeight={800}>
        {title}
      </Typography>
    </Stack>
  );
}
