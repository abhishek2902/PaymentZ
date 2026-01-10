import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Divider,
  TextField,
  Typography,
  CardContent,
} from '@mui/material';

import UploadBox from './UploadBox';
import OwnerIdUploader from './OwnerIdUploader';

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

export default function Step2DocumentUploadCard({
  data,
  onChange, // (key, value) => void
  onOwnerChange, // (idx, key, value, msg?) => void
  onOwnerRemove, // (idx) => void
  onAddOwner, // () => void
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
        {/* Top info */}
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
            Document Guidelines
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload clear, readable scans (PDF, PNG, JPG). Max 10MB each. If documents are
            multi-page, combine into one PDF.
          </Typography>
        </Stack>

        {/* Company docs */}
        <SectionHeader icon="mdi:office-building" color="primary" title="Company Documents" />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <UploadBox
              label="Incorporation / Registration Certificate"
              hint="PDF, PNG or JPG"
              value={data.regCert || null}
              onChange={(f, msg) => onChange('regCert', f, msg)}
              error={errors?.regCert}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadBox
              label="Proof of Company Address"
              hint="Utility bill or lease (last 3 months)"
              value={data.proofAddress || null}
              onChange={(f, msg) => onChange('proofAddress', f, msg)}
              error={errors?.proofAddress}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Owners */}
        <SectionHeader icon="mdi:account-badge" color="success" title="Owners / Directors KYC" />
        <Stack spacing={2}>
          {(data.owners || []).map((o, idx) => (
            <OwnerIdUploader
              key={idx}
              index={idx}
              owner={o}
              onChange={onOwnerChange}
              onRemove={onOwnerRemove}
              errors={errors?.owners?.[idx] || {}}
              touched={touched?.owners?.[idx] || {}}
            />
          ))}
          <Button variant="outlined" onClick={onAddOwner} startIcon={<Icon icon="mdi:plus" />}>
            Add Owner / Director
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Financial */}
        <SectionHeader icon="mdi:bank" color="secondary" title="Financial Document" />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <UploadBox
              label="Recent Bank Statement (last 3 months)"
              value={data.bankStatement || null}
              onChange={(f, msg) => onChange('bankStatement', f, msg)}
              error={errors?.bankStatement}
            />
          </Grid>
          <Grid item xs={12} md={6} />
        </Grid>

        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Notes (optional)"
              fullWidth
              multiline
              minRows={3}
              value={data.notes || ''}
              onChange={(e) => onChange('notes', e.target.value)}
              error={err('notes')}
              helperText={help('notes')}
            />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" mt={2}>
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
            {submitting ? 'Submitting…' : 'Submit Phase 2 Application'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
