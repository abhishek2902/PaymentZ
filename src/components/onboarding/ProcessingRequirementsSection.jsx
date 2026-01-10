import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Grid,
  Stack,
  Tooltip,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  CardContent,
  InputAdornment,
} from '@mui/material';

/**
 * ProcessingRequirementsSection
 * Matches the screenshot: selects on top row, big multiline with example + a paste button,
 * and an extra textarea for current payment processors.
 *
 * Props (Formik/Hook-Form friendly):
 *  - data: { annualVolume, avgTxn, banksCount, plan, banksDetails, currentProcessors }
 *  - onChange: (key, value) => void
 *  - errors, touched (optional) -> show red error states
 */
export default function ProcessingRequirementsSection({
  data = {},
  onChange,
  errors = {},
  touched = {},
  sx,
}) {
  const setField = (k) => (e) => onChange?.(k, e.target.value);
  const err = (k) => Boolean(touched?.[k] && errors?.[k]);
  const help = (k) => (touched?.[k] && errors?.[k]) || ' ';

  const volumeRanges = [
    '< $100k',
    '$100k – $500k',
    '$500k – $1M',
    '$1M – $5M',
    '$5M – $10M',
    '$10M+',
  ];
  const bankCounts = ['0', '1', '2', '3', '4', '5+'];
  const plans = ['Starter', 'Growth', 'Enterprise'];

  const exampleBanks = [
    'Example:',
    'Chase Bank – Commercial Account',
    'Bank of America – Business Checking',
    'Wells Fargo – Merchant Services',
  ].join('\n');

  const pasteExample = () => onChange?.('banksDetails', exampleBanks);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, ...sx }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              color: 'secondary.main',
              bgcolor: (t) => t.palette?.secondary?.lighter || t.palette.action.hover,
              flexShrink: 0,
            }}
          >
            <Icon icon="mdi:clipboard-text-outline" width={16} />
          </Box>
          <Typography variant="h6" fontWeight={800}>
            Processing Requirements
          </Typography>
        </Stack>

        {/* Top row selects */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Expected Annual Processing Volume"
              select
              required
              fullWidth
              value={data.annualVolume || ''}
              onChange={setField('annualVolume')}
              error={err('annualVolume')}
              helperText={help('annualVolume')}
            >
              {volumeRanges.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Average Transaction Size"
              required
              fullWidth
              value={data.avgTxn || ''}
              onChange={setField('avgTxn')}
              placeholder="50.00"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputMode: 'decimal',
              }}
              error={err('avgTxn')}
              helperText={help('avgTxn')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Number of Banks You're Bringing"
              select
              required
              fullWidth
              value={data.banksCount || ''}
              onChange={setField('banksCount')}
              error={err('banksCount')}
              helperText={help('banksCount')}
            >
              {bankCounts.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Preferred Subscription Plan"
              select
              required
              fullWidth
              value={data.plan || ''}
              onChange={setField('plan')}
              error={err('plan')}
              helperText={help('plan')}
            >
              {plans.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Bank names with example + paste button in corner */}
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="Bank Names & Details"
                fullWidth
                multiline
                minRows={4}
                value={data.banksDetails || ''}
                onChange={setField('banksDetails')}
                placeholder={exampleBanks}
                error={err('banksDetails')}
                helperText={help('banksDetails')}
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

          {/* Current processors */}
          <Grid item xs={12}>
            <TextField
              label="Current Payment Processors (if any)"
              fullWidth
              multiline
              minRows={3}
              value={data.currentProcessors || ''}
              onChange={setField('currentProcessors')}
              placeholder="List your current payment processors and any challenges you’re facing…"
              error={err('currentProcessors')}
              helperText={help('currentProcessors')}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
