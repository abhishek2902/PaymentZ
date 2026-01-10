import React from 'react';
import { Icon } from '@iconify/react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Link, Stack, Divider, Tooltip, Typography, CardContent } from '@mui/material';

function formatCurrency(n, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

function formatLatency(ms) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}

export default function ProviderCard({
  name = 'Provider',
  role = 'Gateway',
  logo = 'mdi:credit-card-outline', // iconify name or image URL
  logoBg = '#e9efff',
  status = 'online', // 'online' | 'degraded' | 'offline'
  successRate = 0, // as %
  volume24h = 0, // number
  avgResponseMs = 0, // milliseconds
  currency = 'USD',
  ctaLabel, // default: Configure Settings / Check Issues
  onCtaClick,
}) {
  const theme = useTheme();

  const statusCfg = {
    online: { color: theme.palette.success.main, label: 'Online' },
    degraded: { color: theme.palette.warning.main, label: 'Degraded' },
    offline: { color: theme.palette.error.main, label: 'Offline' },
  }[status] || { color: theme.palette.text.disabled, label: 'Unknown' };

  const showIcon = typeof logo === 'string' && !logo.startsWith('http');
  const callToAction =
    ctaLabel ??
    (status === 'degraded' || status === 'offline' ? 'Check Issues' : 'Configure Settings');
  const ctaColor = status === 'degraded' || status === 'offline' ? 'warning.main' : 'primary.main';

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: logoBg,
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
              }}
            >
              {showIcon ? (
                <Icon icon={logo} width={22} height={22} />
              ) : (
                <Box
                  component="img"
                  src={logo}
                  alt={`${name} logo`}
                  sx={{ width: 26, height: 26, objectFit: 'contain' }}
                />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} lineHeight={1.1}>
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {role}
              </Typography>
            </Box>
          </Stack>

          <Tooltip title={statusCfg.label}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: statusCfg.color,
                boxShadow: `0 0 0 6px ${alpha(statusCfg.color, 0.15)}`,
                flexShrink: 0,
              }}
            />
          </Tooltip>
        </Stack>

        {/* Metrics */}
        <Stack spacing={0.75} mt={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Success Rate
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {successRate.toFixed(1)}%
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Volume (24h)
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {formatCurrency(volume24h, currency)}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Avg Response
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {formatLatency(avgResponseMs)}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Link
          component="button"
          type="button"
          onClick={onCtaClick}
          underline="hover"
          sx={{ color: ctaColor, fontWeight: 600 }}
        >
          {callToAction}
        </Link>
      </CardContent>
    </Card>
  );
}
