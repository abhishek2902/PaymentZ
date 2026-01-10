import React from 'react';
import { Icon } from '@iconify/react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Chip, Stack, Typography } from '@mui/material';

export default function SectionHeader({ step = 1, title, subtitle }) {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Chip
          icon={<Icon icon="mdi:information-outline" />}
          label={`Phase ${step}: ${title}`}
          variant="outlined"
          sx={{
            fontWeight: 700,
            borderColor: alpha(theme.palette.primary.main, 0.24),
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            '& .MuiChip-icon': { fontSize: 18 },
          }}
        />
      </Stack>
      {subtitle ? (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
