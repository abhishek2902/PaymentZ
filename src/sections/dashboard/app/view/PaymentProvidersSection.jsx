import React from 'react';
import { Icon } from '@iconify/react';

import { Card, Grid, Stack, Button, Divider, Typography, CardContent } from '@mui/material';

import ProviderCard from 'src/components/overview/ProviderCard';

export default function PaymentProvidersSection({
  onSync = () => console.log('sync'),
  onAdd = () => console.log('add'),
}) {
  const providers = [
    {
      name: 'Stripe',
      role: 'Primary Gateway',
      logo: 'logos:stripe',
      logoBg: '#eaf1ff',
      status: 'online',
      successRate: 99.2,
      volume24h: 1800000,
      avgResponseMs: 245,
      currency: 'USD',
    },
    {
      name: 'PayPal',
      role: 'Secondary Gateway',
      logo: 'logos:paypal',
      logoBg: '#e9f0ff',
      status: 'online',
      successRate: 97.8,
      volume24h: 456000,
      avgResponseMs: 312,
      currency: 'USD',
    },
    {
      name: 'Bank Direct',
      role: 'Enterprise Gateway',
      logo: 'mdi:bank-outline',
      logoBg: '#fff4e0',
      status: 'degraded',
      successRate: 94.5,
      volume24h: 189000,
      avgResponseMs: 1200,
      currency: 'USD',
    },
  ];

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={800}>
            Payment Providers &amp; Banks
          </Typography>
          {/* <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<Icon icon="mdi:sync" />} onClick={onSync}>
              Sync Status
            </Button>
            <Button variant="contained" startIcon={<Icon icon="mdi:plus" />} onClick={onAdd}>
              Add Provider
            </Button>
          </Stack> */}
        </Stack>

        <Divider />

        {/* Cards */}
        <Grid container spacing={2} sx={{ p: 2.5 }}>
          {providers.map((p) => (
            <Grid key={p.name} item xs={12} md={4}>
              <ProviderCard {...p} onCtaClick={() => console.log(`${p.name} CTA clicked`)} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
