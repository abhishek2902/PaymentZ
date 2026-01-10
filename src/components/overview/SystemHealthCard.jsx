import React from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Divider, Typography, CardContent, LinearProgress } from '@mui/material';

function HealthBar({ label, value = 0, color = 'success' }) {
  const theme = useTheme();
  const clr = theme.palette[color]?.main || theme.palette.primary.main;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight={700} sx={{ color: clr }}>
          {value.toFixed(1)}%
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 999,
          bgcolor: alpha(clr, 0.15),
          '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: clr },
        }}
      />
    </Box>
  );
}

function ServiceRow({ name, status = 'Online', color = 'success' }) {
  const theme = useTheme();
  const dot = theme.palette[color]?.main || theme.palette.text.secondary;
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: dot }} />
        <Typography variant="body2">{name}</Typography>
      </Stack>
      <Typography variant="body2" color={color === 'warning' ? 'warning.main' : 'text.secondary'}>
        {status}
      </Typography>
    </Stack>
  );
}

export default function SystemHealthCard({
  title = 'System Health',
  metrics = [
    { label: 'API Uptime', value: 99.9, color: 'success' },
    { label: 'Database Health', value: 98.7, color: 'success' },
    { label: 'Payment Gateways', value: 95.2, color: 'warning' },
  ],
  services = [
    { name: 'Stripe Gateway', status: 'Online', color: 'success' },
    { name: 'PayPal Gateway', status: 'Online', color: 'success' },
    { name: 'Bank Direct', status: 'Degraded', color: 'warning' },
    { name: 'Fraud Detection', status: 'Online', color: 'success' },
  ],
}) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={800} mb={1.5}>
          {title}
        </Typography>

        <Stack spacing={2}>
          {metrics.map((m) => (
            <HealthBar key={m.label} label={m.label} value={m.value} color={m.color} />
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight={800} mb={1}>
          Active Services
        </Typography>
        <Stack spacing={1.25}>
          {services.map((s) => (
            <ServiceRow key={s.name} name={s.name} status={s.status} color={s.color} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
