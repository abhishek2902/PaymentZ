import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Grid, Stack, Tooltip, TextField, IconButton, Typography } from '@mui/material';

import UploadBox from './UploadBox';

export default function OwnerIdUploader({
  index,
  owner,
  onChange, // (idx, key, value) => void
  onRemove, // (idx) => void
  errors = {},
  touched = {},
}) {
  const err = (k) => Boolean(touched?.[k] && errors?.[k]);
  const help = (k) => (touched?.[k] && errors?.[k]) || ' ';

  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" fontWeight={800}>
          Owner / Director #{index + 1}
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
            label="Full Name"
            fullWidth
            value={owner.fullName || ''}
            onChange={(e) => onChange(index, 'fullName', e.target.value)}
            error={err('fullName')}
            helperText={help('fullName')}
          />
        </Grid>
        <Grid item xs={12} md={6} />

        <Grid item xs={12} md={6}>
          <UploadBox
            label="Government ID (Front)"
            value={owner.idFront || null}
            onChange={(f, msg) => onChange(index, 'idFront', f, msg)}
            error={errors?.idFront}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UploadBox
            label="Government ID (Back)"
            value={owner.idBack || null}
            onChange={(f, msg) => onChange(index, 'idBack', f, msg)}
            error={errors?.idBack}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
