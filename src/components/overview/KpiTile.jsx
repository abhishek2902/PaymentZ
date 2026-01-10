import React from 'react';
import { Icon } from '@iconify/react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Typography, CardContent, LinearProgress } from '@mui/material';

export default function KpiTile({
  icon = 'mdi:credit-card-outline',
  iconColor = 'primary', // MUI palette key or hex
  iconBgAlpha = 0.12, // softness of the icon background
  value = '—', // big number text (e.g., "$2.4M")
  label = 'Metric (24h)', // subtitle
  trend = 0, // positive/negative number (e.g., 12.5 or -2.1)
  trendLabel, // optional custom label instead of % (e.g., 'Alert')
  progress = 0, // 0..100
  progressColor = 'primary', // MUI palette key
  cornerIcon, // optional top-right icon (e.g., 'mdi:alert-outline')
  cornerText, // optional top-right text (e.g., 'Alert')
}) {
  const theme = useTheme();

  // resolve palette or hex for icon color
  const iconMain = theme.palette[iconColor]?.main || iconColor || theme.palette.primary.main;

  const up = trend > 0;
  const down = trend < 0;
  const trendColor = up
    ? theme.palette.success.main
    : down
      ? theme.palette.error.main
      : theme.palette.text.secondary;
  const trendIcon = up ? 'mdi:arrow-up' : down ? 'mdi:arrow-down' : 'mdi:minus';

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 3,
        p: 0,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Top row: icon on left, trend or alert on right */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(iconMain, iconBgAlpha),
              color: iconMain,
            }}
          >
            <Icon icon={icon} width={24} height={24} />
          </Box>

          {cornerText || cornerIcon ? (
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ color: theme.palette.warning.main }}
            >
              {cornerIcon ? <Icon icon={cornerIcon} /> : null}
              {cornerText ? (
                <Typography variant="body2" fontWeight={700}>
                  {cornerText}
                </Typography>
              ) : null}
            </Stack>
          ) : (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: trendColor }}>
              <Icon icon={trendIcon} />
              <Typography variant="body2" fontWeight={700}>
                {trendLabel ?? `${Math.abs(trend).toFixed(1)}%`}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Value + label */}
        <Typography variant="h4" fontWeight={800} lineHeight={1.1}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1.25}>
          {label}
        </Typography>

        {/* Progress */}
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progressColor}
          sx={{
            height: 8,
            borderRadius: 999,
            [`& .MuiLinearProgress-bar`]: { borderRadius: 999 },
            bgcolor: alpha(theme.palette.grey[300], 0.5),
          }}
        />
      </CardContent>
    </Card>
  );
}
