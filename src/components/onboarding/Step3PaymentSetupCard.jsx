import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Grid,
  Stack,
  Radio,
  Button,
  Divider,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  RadioGroup,
  CardContent,
  FormControlLabel,
} from '@mui/material';

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

function BankRow({ index, acc, onChange, onRemove, errors = {}, touched = {} }) {
  const err = (k) => Boolean(touched?.[k] && errors?.[k]);
  const help = (k) => (touched?.[k] && errors?.[k]) || ' ';

  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" fontWeight={800}>
          Bank Account #{index + 1}
        </Typography>
        <Tooltip title="Remove">
          <IconButton size="small" onClick={() => onRemove?.(index)}>
            <Icon icon="mdi:trash-can-outline" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Account Holder Name"
            fullWidth
            value={acc.holder || ''}
            onChange={(e) => onChange(index, 'holder', e.target.value)}
            error={err('holder')}
            helperText={help('holder')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Bank Name"
            fullWidth
            value={acc.bank || ''}
            onChange={(e) => onChange(index, 'bank', e.target.value)}
            error={err('bank')}
            helperText={help('bank')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Account Number / IBAN"
            fullWidth
            value={acc.account || ''}
            onChange={(e) => onChange(index, 'account', e.target.value)}
            error={err('account')}
            helperText={help('account')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Routing / SWIFT / IFSC"
            fullWidth
            value={acc.routing || ''}
            onChange={(e) => onChange(index, 'routing', e.target.value)}
            error={err('routing')}
            helperText={help('routing')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Country"
            fullWidth
            value={acc.country || ''}
            onChange={(e) => onChange(index, 'country', e.target.value)}
            error={err('country')}
            helperText={help('country')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Currency"
            select
            fullWidth
            value={acc.currency || ''}
            onChange={(e) => onChange(index, 'currency', e.target.value)}
            error={err('currency')}
            helperText={help('currency')}
          >
            {['USD', 'EUR', 'GBP', 'INR', 'AED', 'AUD', 'CAD', 'SGD'].map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function Step3PaymentSetupCard({
  data,
  onChange, // (key, value) => void
  onBankChange, // (idx, key, value) => void
  onBankRemove, // (idx) => void
  onAddBank, // () => void
  errors = {},
  touched = {},
  onSubmit,
  submitting = false,
  sx,
}) {
  const err = (k) => Boolean(touched?.[k] && errors?.[k]);
  const help = (k) => (touched?.[k] && errors?.[k]) || ' ';

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, ...sx }}>
      <CardContent sx={{ p: 3 }}>
        {/* Info */}
        <Stack
          spacing={1}
          sx={(t) => ({
            p: 2,
            borderRadius: 2,
            mb: 2,
            bgcolor: t.palette.info.lighter || t.palette.action.hover,
            border: `1px solid ${t.palette.info.light}`,
          })}
        >
          <Typography variant="subtitle1" fontWeight={800}>
            Settlement Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose how you’d like to receive payouts and provide accurate beneficiary details to
            avoid delays.
          </Typography>
        </Stack>

        {/* Method & schedule */}
        <SectionHeader icon="mdi:cash-sync" color="secondary" title="Payout Method & Schedule" />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <RadioGroup
              row
              value={data.method || 'Bank'}
              onChange={(e) => onChange('method', e.target.value)}
            >
              <FormControlLabel value="Bank" control={<Radio />} label="Bank Transfer" />
              <FormControlLabel value="Crypto" control={<Radio />} label="Crypto" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Payout Currency"
              select
              fullWidth
              value={data.payoutCurrency || ''}
              onChange={(e) => onChange('payoutCurrency', e.target.value)}
              error={err('payoutCurrency')}
              helperText={help('payoutCurrency')}
            >
              {['USD', 'EUR', 'GBP', 'INR', 'AED', 'AUD', 'CAD', 'SGD', 'USDT'].map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Settlement Schedule"
              select
              fullWidth
              value={data.schedule || ''}
              onChange={(e) => onChange('schedule', e.target.value)}
              error={err('schedule')}
              helperText={help('schedule')}
            >
              {['Daily', 'Weekly', 'Biweekly', 'Monthly'].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Beneficiary Address (optional)"
              fullWidth
              value={data.beneficiaryAddress || ''}
              onChange={(e) => onChange('beneficiaryAddress', e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bank Accounts */}
        {data.method === 'Bank' && (
          <>
            <SectionHeader icon="mdi:bank-transfer" color="primary" title="Bank Accounts" />
            <Stack spacing={2}>
              {(data.bankAccounts || []).map((acc, i) => (
                <BankRow
                  key={i}
                  index={i}
                  acc={acc}
                  onChange={onBankChange}
                  onRemove={onBankRemove}
                  errors={errors?.bankAccounts?.[i] || {}}
                  touched={touched?.bankAccounts?.[i] || {}}
                />
              ))}
              <Button variant="outlined" onClick={onAddBank} startIcon={<Icon icon="mdi:plus" />}>
                Add Bank Account
              </Button>
            </Stack>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Crypto */}
        {data.method === 'Crypto' && (
          <>
            <SectionHeader icon="mdi:currency-eth" color="warning" title="Crypto Settlement" />
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Network"
                  select
                  fullWidth
                  value={data.crypto?.network || ''}
                  onChange={(e) =>
                    onChange('crypto', { ...(data.crypto || {}), network: e.target.value })
                  }
                  error={Boolean(errors?.crypto?.network)}
                  helperText={errors?.crypto?.network || ' '}
                >
                  {['USDT-TRC20', 'USDT-ERC20', 'BTC', 'ETH', 'SOL'].map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Wallet Address"
                  fullWidth
                  value={data.crypto?.address || ''}
                  onChange={(e) =>
                    onChange('crypto', { ...(data.crypto || {}), address: e.target.value })
                  }
                  error={Boolean(errors?.crypto?.address)}
                  helperText={errors?.crypto?.address || ' '}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Notes */}
        <SectionHeader icon="mdi:notebook-edit-outline" color="success" title="Notes (optional)" />
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={data.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
        />

        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            size="large"
            endIcon={<Icon icon="mdi:check-circle" />}
            onClick={onSubmit}
            disabled={submitting}
          >
            Finish & Submit
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
