import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Grid,
  Stack,
  MenuItem,
  TextField,
  Typography,
  CardContent,
} from '@mui/material';

/**
 * PersonalInformationSection
 * 2-column responsive form (Full Name, Email, Phone, Position, LinkedIn)
 * Accepts optional errors/touched for validation (Formik-friendly)
 */
export default function PersonalInformationSection({
  data = {},
  onChange,
  errors = {},
  touched = {},
  sx,
}) {
  const setField = (key) => (e) => onChange?.(key, e.target.value);

  const positions = [
    'Founder / Owner',
    'CEO',
    'CTO',
    'CFO',
    'COO',
    'Head of Payments',
    'Product Manager',
    'Other',
  ];

  const err = (k) => Boolean(touched?.[k] && errors?.[k]);
  const help = (k) => (touched?.[k] && errors?.[k]) || ' ';

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, ...sx }}>
      <CardContent sx={{ p: 3 }}>
        {/* Section heading with icon (left) like screenshot */}
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              color: 'primary.main',
              bgcolor: 'primary.lighter',
              // fallback for themes without `lighter`
              backgroundColor: (t) => t.palette?.primary?.lighter || t.palette.action.hover,
              flexShrink: 0,
            }}
          >
            <Icon icon="mdi:account" width={16} />
          </Box>
          <Typography variant="h6" fontWeight={800}>
            Personal Information
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name"
              placeholder="John Doe"
              required
              fullWidth
              value={data.fullName || ''}
              onChange={setField('fullName')}
              error={err('fullName')}
              helperText={help('fullName')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Email Address"
              placeholder="john@company.com"
              type="email"
              required
              fullWidth
              value={data.email || ''}
              onChange={setField('email')}
              error={err('email')}
              helperText={help('email')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              required
              fullWidth
              value={data.phone || ''}
              onChange={setField('phone')}
              error={err('phone')}
              helperText={help('phone')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Position/Title"
              placeholder="Select your position"
              select
              fullWidth
              value={data.position || ''}
              onChange={setField('position')}
              error={err('position')}
              helperText={help('position')}
            >
              {positions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="LinkedIn Profile (Optional)"
              placeholder="https://linkedin.com/in/johndoe"
              fullWidth
              value={data.linkedin || ''}
              onChange={setField('linkedin')}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
