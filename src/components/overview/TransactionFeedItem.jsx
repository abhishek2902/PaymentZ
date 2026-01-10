import React from 'react';
import { Icon } from '@iconify/react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Chip, Stack, Typography } from '@mui/material';

export default function TransactionFeedItem({
  amount = '$0.00',
  brand = 'Visa',
  last4 = '0000',
  merchant = 'Merchant',
  txnId = 'TXN000000',
  status = 'SUCCESS', // SUCCESS | DECLINED | PENDING
  timeAgo = 'just now',
}) {
  const theme = useTheme();
  const s = status.toUpperCase();

  const cfg = {
    SUCCESS: {
      color: theme.palette.success.main,
      bg: alpha(theme.palette.success.main, 0.1),
      iconBg: alpha(theme.palette.success.main, 0.15),
      icon: 'mdi:check',
      chipColor: 'success',
      leftRail: theme.palette.success.main,
    },
    DECLINED: {
      color: theme.palette.error.main,
      bg: alpha(theme.palette.error.main, 0.1),
      iconBg: alpha(theme.palette.error.main, 0.15),
      icon: 'mdi:close',
      chipColor: 'error',
      leftRail: theme.palette.error.main,
    },
    PENDING: {
      color: theme.palette.warning.main,
      bg: alpha(theme.palette.warning.main, 0.18),
      iconBg: alpha(theme.palette.warning.main, 0.25),
      icon: 'mdi:clock-outline',
      chipColor: 'warning',
      leftRail: theme.palette.warning.main,
    },
  }[s] || {
    color: theme.palette.text.secondary,
    bg: alpha(theme.palette.grey[500], 0.08),
    iconBg: alpha(theme.palette.grey[500], 0.12),
    icon: 'mdi:information-outline',
    chipColor: 'default',
    leftRail: theme.palette.divider,
  };

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        bgcolor: cfg.bg,
        px: 2,
        py: 1.5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: alpha(cfg.color, 0.18),
      }}
    >
      {/* Left status rail */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          bgcolor: cfg.leftRail,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        }}
      />

      <Stack direction="row" alignItems="center" spacing={1.5}>
        {/* Status icon bubble */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: cfg.iconBg,
            color: cfg.color,
            flexShrink: 0,
          }}
        >
          <Icon icon={cfg.icon} width={18} height={18} />
        </Box>

        {/* Main text */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {amount} — {brand} ••••{last4}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Merchant: {merchant} &nbsp; | &nbsp; ID: {txnId}
          </Typography>
        </Box>

        {/* Right status + time */}
        <Stack alignItems="flex-end" spacing={0.25} sx={{ minWidth: 120 }}>
          <Chip
            size="small"
            label={s}
            color={cfg.chipColor}
            variant="filled"
            sx={{ fontWeight: 700, letterSpacing: 0.3 }}
          />
          <Typography variant="caption" color="text.secondary">
            {timeAgo}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
