import React from 'react';
import { Icon } from '@iconify/react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Typography, CardContent } from '@mui/material';

export default function AdminStat({
  icon = 'mdi:account-group',
  color = 'primary', // MUI palette key or hex
  value = '0',
  label = 'Metric',
}) {
  const theme = useTheme();
  const clr = theme.palette[color]?.main || color || theme.palette.primary.main;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        bgcolor: alpha(clr, 0.08),
        borderColor: alpha(clr, 0.25),
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack alignItems="center" spacing={1.25}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(clr, 0.18),
              color: clr,
            }}
          >
            <Icon icon={icon} width={28} height={28} />
          </Box>

          <Typography variant="h5" fontWeight={800}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
