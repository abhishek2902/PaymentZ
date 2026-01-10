import React from 'react';

import Grid from '@mui/material/Grid';

import TransactionFeed from 'src/components/overview/TransactionFeed';
import SystemHealthCard from 'src/components/overview/SystemHealthCard';

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function RealtimeAndHealthSection() {
  const items = [
    {
      amount: fmt(1245.67),
      brand: 'Visa',
      last4: '4532',
      merchant: 'TechStore Inc',
      txnId: 'TXN789123',
      status: 'SUCCESS',
      timeAgo: '2 seconds ago',
    },
    {
      amount: fmt(892.34),
      brand: 'MasterCard',
      last4: '7891',
      merchant: 'Fashion Hub',
      txnId: 'TXN789124',
      status: 'DECLINED',
      timeAgo: '5 seconds ago',
    },
    {
      amount: fmt(456.78),
      brand: 'Amex',
      last4: '1234',
      merchant: 'BookWorld',
      txnId: 'TXN789125',
      status: 'SUCCESS',
      timeAgo: '8 seconds ago',
    },
    {
      amount: fmt(2156.9),
      brand: 'Visa',
      last4: '9876',
      merchant: 'ElectroMax',
      txnId: 'TXN789126',
      status: 'PENDING',
      timeAgo: '12 seconds ago',
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <TransactionFeed items={items} />
      </Grid>
      <Grid item xs={12} md={4}>
        <SystemHealthCard />
      </Grid>
    </Grid>
  );
}
