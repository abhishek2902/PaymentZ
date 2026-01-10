// components/onboarding/Step3PaymentInfoCard.jsx
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

import { alpha } from '@mui/material/styles';
import { onboadingFormMdr } from 'src/api/onboarding';
import { useParams } from 'react-router-dom';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Switch,
  Divider,
  Tooltip,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  CardContent,
  FormControlLabel,
} from '@mui/material';
import UploadTile from './step2/UploadTile';

function SectionHeader({ icon, color = 'primary', title, mb = 1.5 }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" mb={mb}>
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: (t) => t.palette?.[color]?.lighter || t.palette.action.hover,
          color: `${color}.main`,
          flexShrink: 0,
        }}
      >
        <Icon icon={icon} width={14} />
      </Box>
      <Typography variant="subtitle1" fontWeight={800}>
        {title}
      </Typography>
    </Stack>
  );
}

const ACCOUNT_TYPES2 = ['checking', 'savings', 'current'];
const ACCOUNT_TYPES = [
  { label: 'Checking', value: 'checking' },
  { label: 'Savings', value: 'savings' },
  { label: 'Current', value: 'current' }
];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'AUD', 'CAD', 'SGD'];
const FREQUENCIES = ['Weekly', 'Biweekly', 'Monthly'];
const METHODS = ['Bank', 'Crypto'];
export const TIMEZONES = [
  'UTC+00:00 (UTC)',
  'UTC-12:00 (Baker Island)',
  'UTC-11:00 (Niue)',
  'UTC-10:00 (Hawaii-Aleutian Time)',
  'UTC-09:30 (Marquesas Islands)',
  'UTC-09:00 (Alaska Time)',
  'UTC-08:00 (Pacific Time)',
  'UTC-07:00 (Mountain Time)',
  'UTC-06:00 (Central Time)',
  'UTC-05:00 (Eastern Time)',
  'UTC-04:00 (Atlantic Time)',
  'UTC-03:30 (Newfoundland)',
  'UTC-03:00 (Argentina/Brazil)',
  'UTC-02:00 (South Georgia)',
  'UTC-01:00 (Azores)',
  'UTC+00:00 (UTC / Greenwich Mean Time)',
  'UTC+01:00 (Central European Time)',
  'UTC+02:00 (Eastern European Time)',
  'UTC+03:00 (Moscow / East Africa Time)',
  'UTC+03:30 (Iran Time)',
  'UTC+04:00 (Gulf Standard Time)',
  'UTC+04:30 (Afghanistan Time)',
  'UTC+05:00 (Pakistan Standard Time)',
  'UTC+05:30 (India Standard Time)',
  'UTC+05:45 (Nepal Time)',
  'UTC+06:00 (Bangladesh Time)',
  'UTC+06:30 (Myanmar Time)',
  'UTC+07:00 (Indochina Time)',
  'UTC+08:00 (China / Singapore / Perth)',
  'UTC+08:45 (SE Western Australia)',
  'UTC+09:00 (Japan / Korea Time)',
  'UTC+09:30 (Central Australia)',
  'UTC+10:00 (Eastern Australia / Guam)',
  'UTC+10:30 (Lord Howe Island)',
  'UTC+11:00 (Solomon Islands / New Caledonia)',
  'UTC+12:00 (New Zealand / Fiji)',
  'UTC+12:45 (Chatham Islands)',
  'UTC+13:00 (Tonga / Phoenix Islands)',
  'UTC+14:00 (Line Islands)',
];
const NETWORKS = ['USDT-TRC20', 'USDT-ERC20', 'BTC', 'ETH', 'SOL'];

export default function Step3PaymentInfoCard({
  data,
  onChange, // (key, value)
  onBankChange, // (key, value) for primary bank
  onBackupChange, // (key, value) for backup bank
  onCryptoChange, // (key, value)
  errors = {},
  touched = {},
  onSubmit,
  submitting = false,
  sx,

  Docdata = {},
  onDocChange,
  Docerrors = {},
  Doctouched = {},
}) {

  const err = (k, scope = '') => {
    const src =
      scope === 'bank'
        ? errors.bank
        : scope === 'backup'
          ? errors.backupBank
          : scope === 'crypto'
            ? errors.crypto
            : scope === 'prefs'
              ? errors.prefs
              : errors;

    const tch =
      scope === 'bank'
        ? touched.bank
        : scope === 'backup'
          ? touched.backupBank
          : scope === 'crypto'
            ? touched.crypto
            : scope === 'prefs'
              ? touched.prefs
              : touched;

    return Boolean(tch?.[k] && src?.[k]);
  };

  const help = (k, scope = '') => {
    const src =
      scope === 'bank'
        ? errors.bank
        : scope === 'backup'
          ? errors.backupBank
          : scope === 'crypto'
            ? errors.crypto
            : scope === 'prefs'
              ? errors.prefs
              : errors;

    const tch =
      scope === 'bank'
        ? touched.bank
        : scope === 'backup'
          ? touched.backupBank
          : scope === 'crypto'
            ? touched.crypto
            : scope === 'prefs'
              ? touched.prefs
              : touched;

    return (tch?.[k] && src?.[k]) || ' ';
  };

  const Docerr = (k) => (Doctouched?.[k] && Docerrors?.[k]) || undefined;

  const { onboardingId } = useParams();

  const InfoNote = (
    <Stack
      spacing={0.75}
      sx={(t) => ({
        p: 2,
        borderRadius: 2,
        mb: 2,
        bgcolor: alpha(t.palette.warning.main, 0.08),
        border: `1px solid ${alpha(t.palette.warning.main, 0.35)}`,
      })}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Icon icon="mdi:alert-decagram-outline" />
        <Typography variant="subtitle2" fontWeight={800}>
          Important Banking Requirements
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        • Account holder name must match your business registration. <br />
        • Domestic checking accounts are preferred for faster processing. <br />
        • International payouts may require SWIFT/BIC and bank address. <br />• We verify all
        account changes with a limited deposit.
      </Typography>
    </Stack>
  );
    // reusable style
  const readonlyFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f5f5f5",
      "& fieldset": { borderColor: "#ddd" },
      "&:hover fieldset, &.Mui-focused fieldset": { borderColor: "#ddd" },
    },
    "& .MuiInputLabel-root": { color: "text.secondary" },
  };

  const initialPricingState = { 
    mdrRateDomestic: 'N/A',
    mdrRateInternational: 'N/A',
    successFeePerTransaction: 'N/A',
    rollingReserveRate: 'N/A',
    settlementFee: 'N/A',
    payoutTerms: 'N/A',
    chargebackFee: 'N/A',
    refundFee: 'N/A',
  };

  // State to hold the pricing data
  const [pricingData, setPricingData] = useState({ pricing: initialPricingState });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMdrPricingData() {
      if (!onboardingId) return; // Guard clause

      setIsLoading(true);
      setError(null);
      
      try {
        const res = await onboadingFormMdr(onboardingId, {});
        setPricingData({ pricing:res});
      } catch (erro) {
        console.error('Failed to fetch MDR pricing data:', erro);
        setError('Failed to load pricing details. Please try again.');
        setPricingData({ pricing: initialPricingState });
      } finally {
        setIsLoading(false);
      }
    }

    fetchMdrPricingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingId]);

  if (isLoading) {
    //  return <Typography style={{ color: 'red' }}>Error: {error}</Typography>;
    return <Typography>Loading MDR Pricing...</Typography>;
  }

  if (error) {
    return <Typography color="error" align='center'>Failed to load applications.</Typography>;
  }
  
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, ...sx }}>
      <CardContent sx={{ p: 3 }}>

        {/* Top banner */}
        {/* <Box
          sx={(t) => ({
            mb: 2,
            p: 2,
            borderRadius: 2,
            color: 'common.white',
            background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          })}
        >
          <Icon icon="mdi:credit-card-check-outline" />
          <Typography fontWeight={800}>Pricing & Fee Structure</Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <SectionHeader
            icon="mdi:cash-multiple"
            color="success"
            title="Pricing & Fee Structure"
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            <TextField
              name="mdrDomestic"
              label="MDR Rate (Domestic)"
              value={pricingData?.pricing?.mdrRateDomestic || ''}
              InputProps={{ readOnly: true }}
              sx={readonlyFieldSx}
            />
            <TextField
              name="mdrInternational"
              label="MDR Rate (International)"
              value={pricingData?.pricing?.mdrRateInternational || ''}
              InputProps={{ readOnly: true }}
              sx={readonlyFieldSx}
            />
            <TextField
              name="successFee"
              label="Success Fee (Per transaction)"
              value={pricingData?.pricing?.successFeePerTransaction || ''}
              InputProps={{ readOnly: true }}
              sx={readonlyFieldSx}
            />
            <TextField
              name="rollingReserve"
              label="Rolling Reserve Rate"
              value={pricingData?.pricing?.rollingReserveRate || ''}
              InputProps={{ readOnly: true }}
              sx={readonlyFieldSx}
            />
            <TextField
              name="settlementFee"
              label="Settlement Fee"
              value={pricingData?.pricing?.settlementFee || ''}
              InputProps={{ readOnly: true }}
              sx={readonlyFieldSx}
            />
            <TextField
              name="payoutTerms"
              label="Payout Terms"
              value={pricingData?.pricing?.payoutTerms || ''}
              InputProps={{ readOnly: true }}
              sx={readonlyFieldSx}
            />
            <TextField
              name="chargebackFee"
              label="Chargeback Fee"
              value={pricingData?.pricing?.chargebackFee || ''}
              InputProps={{ readOnly: true }}
              sx={readonlyFieldSx}
            />
            <TextField
              name="refundFee"
              label="Refund Fee"
              value={pricingData?.pricing?.refundFee || ''}
              InputProps={{ readOnly: true }}
              sx={readonlyFieldSx}
            />
          </Box>
        </Box> */}

        {/* Top banner */}
        <Box
          sx={(t) => ({
            mb: 2,
            p: 2,
            borderRadius: 2,
            color: 'common.white',
            background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          })}
        >
          <Icon icon="mdi:credit-card-check-outline" />
          <Typography fontWeight={800}>Final Step: Payment Information and Document Upload</Typography>
        </Box>

        {/* Bank account details */}
        <SectionHeader icon="mdi:bank" color="primary" title="Bank Account Details" />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Primary account for receiving commission payments and settlements
        </Typography>
        {InfoNote}

        {/* Primary bank */}
        <SectionHeader
          icon="mdi:bank-transfer"
          color="primary"
          title="Primary Bank Account"
          mb={1}
        />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Bank Name *"
              fullWidth
              value={data.bank.bankName || ''}
              onChange={(e) => onBankChange('bankName', e.target.value)}
              error={err('bankName', 'bank')}
              helperText={help('bankName', 'bank')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Account Holder Name *"
              fullWidth
              value={data.bank.holderName || ''}
              onChange={(e) => onBankChange('holderName', e.target.value)}
              error={err('holderName', 'bank')}
              helperText={help('holderName', 'bank')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Account Number *"
              fullWidth
              value={data.bank.accountNumber || ''}
              onChange={(e) => onBankChange('accountNumber', e.target.value)}
              error={err('accountNumber', 'bank')}
              helperText={help('accountNumber', 'bank')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Routing Number *"
              fullWidth
              value={data.bank.routingNumber || ''}
              onChange={(e) => onBankChange('routingNumber', e.target.value)}
              error={err('routingNumber', 'bank')}
              helperText={help('routingNumber', 'bank')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Account Type *"
              select
              fullWidth
              value={data.bank.accountType || ''}
              onChange={(e) => onBankChange('accountType', e.target.value)}
              error={err('accountType', 'bank')}
              helperText={help('accountType', 'bank')}
            >
              {ACCOUNT_TYPES.map((v) => (
                <MenuItem key={v.value} value={v.value}>
                  {v.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Currency *"
              select
              fullWidth
              value={data.bank.currency || ''}
              onChange={(e) => onBankChange('currency', e.target.value)}
              error={err('currency', 'bank')}
              helperText={help('currency', 'bank')}
            >
              {CURRENCIES.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="SWIFT/BIC"
              fullWidth
              value={data.bank.swift || ''}
              onChange={(e) => onBankChange('swift', e.target.value)}
              error={err('swift', 'bank')}
              helperText={help('swift', 'bank')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Bank Address *"
              fullWidth
              value={data.bank.address || ''}
              onChange={(e) => onBankChange('address', e.target.value)}
              error={err('address', 'bank')}
              helperText={help('address', 'bank')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Crypto wallets */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <SectionHeader
            icon="mdi:currency-eth"
            color="warning"
            title="Cryptocurrency Wallets"
            mb={0}
          />
          <Switch
            checked={Boolean(data.cryptoEnabled)}
            onChange={(e) => onChange('cryptoEnabled', e.target.checked)}
          />
          <Typography variant="caption" color="text.secondary">
            Enable crypto payments (optional)
          </Typography>
        </Stack>

        {data.cryptoEnabled && (
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Network *"
                select
                fullWidth
                value={data.crypto.network || ''}
                onChange={(e) => onCryptoChange('network', e.target.value)}
                error={err('network', 'crypto')}
                helperText={help('network', 'crypto')}
              >
                {NETWORKS.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Wallet Address *"
                fullWidth
                value={data.crypto.address || ''}
                onChange={(e) => onCryptoChange('address', e.target.value)}
                error={err('address', 'crypto')}
                helperText={help('address', 'crypto')}
              />
            </Grid>
          </Grid>
        )}

        <Divider sx={{ my: 2.5 }} />

        {/* Preferences & Settings */}
        <SectionHeader
          icon="mdi:equalizer-outline"
          color="secondary"
          title="Payment Preferences & Settings"
        />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Primary Payment Method *"
              select
              fullWidth
              value={data.prefs.primaryMethod || ''}
              onChange={(e) => onChange('prefs', { ...data.prefs, primaryMethod: e.target.value })}
              error={err('primaryMethod', 'prefs')}
              helperText={help('primaryMethod', 'prefs')}
            >
              {METHODS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Payment Frequency *"
              select
              fullWidth
              value={data.prefs.frequency || ''}
              onChange={(e) => onChange('prefs', { ...data.prefs, frequency: e.target.value })}
              error={err('frequency', 'prefs')}
              helperText={help('frequency', 'prefs')}
            >
              {FREQUENCIES.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              label="Time Zone *"
              select
              fullWidth
              value={data.prefs.timeZone || 'UTC+00:00 (UTC)'}
              onChange={(e) => onChange('prefs', { ...data.prefs, timeZone: e.target.value })}
              error={err('timeZone', 'prefs')}
              helperText={help('timeZone', 'prefs')}
            >
              {TIMEZONES.map((z) => (
                <MenuItem key={z} value={z}>
                  {z}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Notifications + contacts */}
          {/* <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
              Notification Preferences
            </Typography>
            <Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(data.prefs.notifyEmail)}
                    onChange={(e) =>
                      onChange('prefs', { ...data.prefs, notifyEmail: e.target.checked })
                    }
                  />
                }
                label="Email notifications for payments"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(data.prefs.notifySmsLarge)}
                    onChange={(e) =>
                      onChange('prefs', { ...data.prefs, notifySmsLarge: e.target.checked })
                    }
                  />
                }
                label="SMS alerts for large transactions"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(data.prefs.weeklySummary)}
                    onChange={(e) =>
                      onChange('prefs', { ...data.prefs, weeklySummary: e.target.checked })
                    }
                  />
                }
                label="Weekly payment summaries"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Backup Contact Email"
              fullWidth
              value={data.prefs.backupEmail || ''}
              onChange={(e) => onChange('prefs', { ...data.prefs, backupEmail: e.target.value })}
              error={err('backupEmail', 'prefs')}
              helperText={help('backupEmail', 'prefs')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Emergency Contact Phone"
              fullWidth
              // sx={{ mt: 2 }}
              value={data.prefs.emergencyPhone || ''}
              onChange={(e) => onChange('prefs', { ...data.prefs, emergencyPhone: e.target.value })}
              error={err('emergencyPhone', 'prefs')}
              helperText={help('emergencyPhone', 'prefs')}
            />
          </Grid> */}
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Backup Contact */}
        <SectionHeader
          icon="mdi:contacts-outline"
          color="secondary"
          title="Backup Contact"
        />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Backup Contact Email"
              fullWidth
              value={data.prefs.backupEmail || ''}
              onChange={(e) => onChange('prefs', { ...data.prefs, backupEmail: e.target.value })}
              error={err('backupEmail', 'prefs')}
              helperText={help('backupEmail', 'prefs')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Emergency Contact Phone"
              fullWidth
              // sx={{ mt: 2 }}
              value={data.prefs.emergencyPhone || ''}
              onChange={(e) => onChange('prefs', { ...data.prefs, emergencyPhone: e.target.value })}
              error={err('emergencyPhone', 'prefs')}
              helperText={help('emergencyPhone', 'prefs')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Identity */}
        <SectionHeader
          icon="mdi:account-badge-outline"
          color="primary"
          title="Identity Verification Documents"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Government Issued ID/Passport *"
              caption=" PDF up to 2MB"
              value={Docdata.idDoc || null}
              onChange={(v, m) => onDocChange?.('idDoc', v, m)}
              error={Docerr('idDoc')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Proof of Address *"
              caption="Utility bill, bank statement • PDF up to 2MB"
              value={Docdata.proofAddress || null}
              onChange={(v, m) => onDocChange?.('proofAddress', v, m)}
              error={Docerr('proofAddress')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Business */}
        <SectionHeader
          icon="mdi:briefcase-outline"
          color="success"
          title="Business Verification Documents"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Business Registration Certificate *"
              caption="Company incorporation/registration •  PDF up to 2MB"
              value={Docdata.regCert || null}
              onChange={(v, m) => onDocChange?.('regCert', v, m)}
              error={Docerr('regCert')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Tax Identification Document *"
              caption="EIN / VAT / GST etc. •  PDF up to 2MB"
              value={Docdata.taxIdDoc || null}
              onChange={(v, m) => onDocChange?.('taxIdDoc', v, m)}
              error={Docerr('taxIdDoc')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Business License (if applicable)"
              caption="Professional/Trade license •  PDF up to 2MB"
              value={Docdata.businessLicense || null}
              onChange={(v, m) => onDocChange?.('businessLicense', v, m)}
              error={Docerr('businessLicense')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Article of Incorporation *"
              caption="Corporate formation documents •  PDF up to 2MB"
              value={Docdata.incorporationDocs || null}
              onChange={(v, m) => onDocChange?.('incorporationDocs', v, m)}
              error={Docerr('incorporationDocs')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Financial */}
        <SectionHeader icon="mdi:cash-multiple" color="secondary" title="Financial Documents" />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <UploadTile
              multiple
              label="Bank Statements (last 3 months) *"
              caption="Upload multiple files if needed •  PDF up to 2MB each"
              value={Docdata.bankStatements || []}
              onChange={(v, m) => onDocChange?.('bankStatements', v, m)}
              error={Docerr('bankStatements')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Financial Statement (Optional)"
              caption="P&L, Balance Sheet etc. •  PDF up to 2MB"
              value={Docdata.financialStatement || null}
              onChange={(v, m) => onDocChange?.('financialStatement', v, m)}
              error={Docerr('financialStatement')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Additional */}
        <SectionHeader icon="mdi:paperclip" color="warning" title="Additional Documents" />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Processing History (if available)"
              caption="Previous processor statements •  PDF up to 2MB"
              value={Docdata.processingHistory || null}
              onChange={(v, m) => onDocChange?.('processingHistory', v, m)}
              error={Docerr('processingHistory')}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3.5 }} />

        {/* Final verification & terms */}
        <SectionHeader
          icon="mdi:shield-check-outline"
          color="success"
          title="Final Verification & Terms"
        />
        <Grid container spacing={1.25}>
          {[
            [
              'ownership',
              'Account Ownership: I confirm bank accounts are owned by the registered business.',
            ],
            ['wallet', 'Wallet Control: I control the crypto wallet(s) provided (if any).'],
            ['accuracy', 'Information Accuracy: details provided are true and correct.'],
            [
              'tos',
              'I have read and agree to Terms of Service, Privacy Policy, and Payout Agreement.',
            ],
            [
              'test',
              'Test Transactions: I authorize Quiklie Payments to initiate small verification deposits/withdrawals.',
            ],
            [
              'compliance',
              'Compliance: I consent to compliance checks and sanction screening (KYC/AML).',
            ],
          ].map(([k, label]) => (
            <Grid key={k} item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(data.terms?.[k])}
                    onChange={(e) =>
                      onChange('terms', { ...(data.terms || {}), [k]: e.target.checked })
                    }
                  />
                }
                label={label}
              />
              {errors?.terms?.[k] && (
                <Typography variant="caption" color="error">
                  {errors.terms[k]}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>


        <Stack direction="row" justifyContent="flex-end" alignItems="center" mt={2}>
          <Button
            variant="contained"
            size="large"
            endIcon={<Icon icon="mdi:rocket-launch" />}
            onClick={onSubmit}
            disabled={submitting}
          >
            Complete Onboarding
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
