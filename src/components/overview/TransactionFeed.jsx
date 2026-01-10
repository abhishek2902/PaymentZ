import React from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Divider, Typography, CardContent } from '@mui/material';

import TransactionFeedItem from './TransactionFeedItem';

function LiveDot() {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: theme.palette.success.main,
          boxShadow: `0 0 0 4px ${alpha(theme.palette.success.main, 0.15)}`,
        }}
      />
      <Typography variant="body2" color="text.secondary">
        Live
      </Typography>
    </Box>
  );
}

export default function TransactionFeed({ title = 'Real-Time Transaction Feed', items = [] }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
          <LiveDot />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.25}>
          {items.map((it) => (
            <TransactionFeedItem key={it.txnId} {...it} />
          ))}
          {/* optional tail shimmer/progress can be placed here */}
          <Box
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: (t) => alpha(t.palette.success.main, 0.12),
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
