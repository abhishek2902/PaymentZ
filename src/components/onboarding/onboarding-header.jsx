import React from 'react';
import { Icon } from '@iconify/react';

import { alpha } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';

export default function OnboardingHeader({
  brand = { title: 'Quiklie Payments', subtitle: 'Admin Onboarding Portal' },
  eta = '~15 minutes',
  logoSrc = '/Levanta-favicon.png',
  rightSlot = null,
}) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: (t) => `1px solid ${alpha(t.palette.grey[500], 0.24)}`,
        bgcolor: 'background.paper',
        p: 2,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center" minWidth={0}>
          <Box
            component="img"
            src={logoSrc}
            alt="Logo"
            sx={{ width: 40, height: 40, borderRadius: 1 }}
          />
          <Box minWidth={0}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {brand.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {brand.subtitle}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          {rightSlot}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
            }}
          >
            <Icon icon="mdi:clock-outline" width={16} />
            <Typography variant="body2">{eta}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
