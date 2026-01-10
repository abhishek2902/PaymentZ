import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Divider,
  Checkbox,
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
          width: 20,
          height: 20,
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

/**
 * Step2KycUploadCard
 * Props:
 *  data: {
 *    idDoc, proofAddress, selfie,
 *    regCert, taxIdDoc, businessLicense, incorporationDocs,
 *    bankStatements (File[]), financialStatement,
 *    processingHistory, otherSupporting,
 *    checklist: { id, address, selfie, bank, registration, readable }
 *  }
 *  onChange(key, value)  // value: File|null or File[]
 *  onChecklist(key, boolean)
 *  errors, touched
 *  onSubmit()
 */
export default function Step2KycUploadCard({
  data = {},
  onChange,
  onChecklist,
  errors = {},
  touched = {},
  onSubmit,
  submitting = false,
  sx,
}) {
  const err = (k) => (touched?.[k] && errors?.[k]) || undefined;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, ...sx }}>
      <CardContent sx={{ p: 3 }}>
        {/* Top heading (optional – your PhaseHeaderCard can be outside) */}
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
              caption="PNG, JPG, PDF up to 10MB"
              value={data.idDoc || null}
              onChange={(v, m) => onChange?.('idDoc', v, m)}
              error={err('idDoc')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Proof of Address *"
              caption="Utility bill, bank statement • PNG, JPG, PDF up to 10MB"
              value={data.proofAddress || null}
              onChange={(v, m) => onChange?.('proofAddress', v, m)}
              error={err('proofAddress')}
            />
          </Grid>
          <Grid item xs={12}>
            <UploadTile
              label="Selfie Verification"
              caption="Take a clear selfie holding your ID • PNG, JPG up to 10MB"
              value={data.selfie || null}
              onChange={(v, m) => onChange?.('selfie', v, m)}
              error={err('selfie')}
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
              caption="Company incorporation/registration • PNG, JPG, PDF up to 10MB"
              value={data.regCert || null}
              onChange={(v, m) => onChange?.('regCert', v, m)}
              error={err('regCert')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Tax Identification Document"
              caption="EIN / VAT / GST etc. • PNG, JPG, PDF up to 10MB"
              value={data.taxIdDoc || null}
              onChange={(v, m) => onChange?.('taxIdDoc', v, m)}
              error={err('taxIdDoc')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Business License (if applicable)"
              caption="Professional/Trade license • PNG, JPG, PDF up to 10MB"
              value={data.businessLicense || null}
              onChange={(v, m) => onChange?.('businessLicense', v, m)}
              error={err('businessLicense')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Articles of Incorporation"
              caption="Corporate formation documents • PNG, JPG, PDF up to 10MB"
              value={data.incorporationDocs || null}
              onChange={(v, m) => onChange?.('incorporationDocs', v, m)}
              error={err('incorporationDocs')}
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
              caption="Upload multiple files if needed • PNG, JPG, PDF up to 10MB each"
              value={data.bankStatements || []}
              onChange={(v, m) => onChange?.('bankStatements', v, m)}
              error={err('bankStatements')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Financial Statement (Optional)"
              caption="P&L, Balance Sheet etc. • PNG, JPG, PDF up to 10MB"
              value={data.financialStatement || null}
              onChange={(v, m) => onChange?.('financialStatement', v, m)}
              error={err('financialStatement')}
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
              caption="Previous processor statements • PNG, JPG, PDF up to 10MB"
              value={data.processingHistory || null}
              onChange={(v, m) => onChange?.('processingHistory', v, m)}
              error={err('processingHistory')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadTile
              label="Other Supporting Documents"
              caption="Any additional relevant documents • PNG, JPG, PDF up to 10MB"
              value={data.otherSupporting || null}
              onChange={(v, m) => onChange?.('otherSupporting', v, m)}
              error={err('otherSupporting')}
            />
          </Grid>
        </Grid>

        {/* Checklist */}
        <Box
          sx={(t) => ({
            mt: 2.5,
            p: 2,
            borderRadius: 2,
            bgcolor: t.palette.success.lighter,
            border: `1px solid ${t.palette.success.light}`,
          })}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Icon icon="mdi:clipboard-check-outline" />
            <Typography variant="subtitle2" fontWeight={800}>
              Document Upload Checklist
            </Typography>
          </Stack>
          <Grid container spacing={1}>
            {[
              ['id', 'Government ID/Passport'],
              ['address', 'Proof of Address'],
              ['selfie', 'Selfie with ID'],
              ['bank', 'Bank Statements (3 months)'],
              ['registration', 'Business Registration'],
              ['readable', 'All documents clear & readable'],
            ].map(([key, label]) => (
              <Grid key={key} item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(data.checklist?.[key])}
                      onChange={(e) => onChecklist?.(key, e.target.checked)}
                    />
                  }
                  label={label}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Security + Submit */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mt: 2.5 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon icon="mdi:shield-check-outline" width={18} style={{ color: '#2e7d32' }} />
            <Typography variant="body2" color="text.secondary">
              Documents are encrypted and securely stored
            </Typography>
          </Stack>

          <Button
            variant="contained"
            size="large"
            endIcon={<Icon icon="mdi:arrow-right" />}
            onClick={onSubmit}
            disabled={submitting}
          >
            Submit Documents For Review
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
