import React from 'react';
import { Icon } from '@iconify/react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Typography, CardContent } from '@mui/material';

export default function FeatureCard({ icon, title, description, color = 'primary' }) {
  const theme = useTheme();
  const clr = theme.palette[color]?.main || theme.palette.primary.main;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', '&:hover': { boxShadow: 4 } }}>
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            mx: 'auto',
            mb: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(clr, 0.15),
            color: clr,
          }}
        >
          <Icon icon={icon} width={28} height={28} />
        </Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
