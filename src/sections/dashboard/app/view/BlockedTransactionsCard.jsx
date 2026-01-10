import * as React from 'react';
import { Icon } from '@iconify/react';

import { Box, Card, Stack, CardHeader, Typography, CardContent } from '@mui/material';

// Small row component
function Row({ label, value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.75 }}>
      <Typography variant="body1">{label}</Typography>
      <Typography variant="body1" sx={{ ml: 'auto', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
    </Box>
  );
}

/**
 * Props:
 * - title?: string
 * - total?: number|string
 * - subtitle?: string
 * - items?: {label: string, value: number|string}[]
 * - icon?: string (Iconify icon name)  e.g. "mdi:shield-outline"
 * - iconSize?: number
 */
export default function BlockedTransactionsCard({
  title = 'Blocked Transactions',
  total = 0,
  subtitle = 'Blocked in last 24h',
  items = [],
  icon = 'mdi:shield-outline', // <- Iconify icon name
  iconSize = 22,
}) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        action={
          <Box sx={{ color: 'text.secondary' }}>
            <Icon
              icon={icon}
              width={iconSize}
              height={iconSize}
              style={{ color: 'currentColor' }}
            />
          </Box>
        }
        sx={{
          pb: 0.5,
          '& .MuiCardHeader-title': { fontSize: 20, fontWeight: 600 },
        }}
      />

      <CardContent sx={{ pt: 1.5 }}>
        <Typography variant="h4" sx={{ lineHeight: 1.2 }}>
          {total}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          {subtitle}
        </Typography>

        <Stack spacing={0.25}>
          {items.map((it) => (
            <Row key={it.label} label={it.label} value={it.value} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
