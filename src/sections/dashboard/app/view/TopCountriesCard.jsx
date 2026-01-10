import * as React from 'react';
import { Icon } from '@iconify/react';

import { Box, Card, Stack, Paper, CardHeader, Typography, CardContent } from '@mui/material';

/** Format helpers */
const fCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const fNumber = (value) => new Intl.NumberFormat().format(value);

/** One country row (outlined pill) */
function CountryRow({
  code,
  name,
  amount,
  transactions,
  currency = 'USD',
  iconSet = 'circle-flags',
}) {
  const iconId = `${iconSet}:${code}`; // e.g. circle-flags:us, circle-flags:gb
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderRadius: 1,
      }}
    >
      {/* Flag + name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
        <Box
          sx={{
            width: 28,
            height: 20,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 0.5,
            bgcolor: 'action.hover',
          }}
        >
          <Icon icon={iconId} width={24} height={24} />
        </Box>
        <Typography variant="body1" noWrap>
          {name}
        </Typography>
      </Box>

      {/* Amount + transactions (right) */}
      <Box sx={{ ml: 'auto', textAlign: 'right' }}>
        <Typography variant="h6" sx={{ lineHeight: 1 }}>
          {fCurrency(amount, currency)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {fNumber(transactions)} transactions
        </Typography>
      </Box>
    </Paper>
  );
}

/**
 * Top Countries Card
 * props:
 *  - title?: string
 *  - currency?: string (e.g., "USD", "EUR")
 *  - iconSet?: "circle-flags" | "flagpack" | any Iconify flag set
 *  - items: Array<{ code: string; name: string; amount: number; transactions: number }>
 */
export default function TopCountriesCard({
  title = 'Top Countries',
  currency = 'USD',
  iconSet = 'circle-flags',
  items = [],
}) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        sx={{ pb: 1, '& .MuiCardHeader-title': { fontSize: 20, fontWeight: 600 } }}
      />
      <CardContent>
        <Stack spacing={2}>
          {items.map((it) => (
            <CountryRow
              key={it.code}
              code={it.code}
              name={it.name}
              amount={it.amount}
              transactions={it.transactions}
              currency={currency}
              iconSet={iconSet}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
