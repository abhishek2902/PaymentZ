import React from 'react';

import { Box, Card, List, ListItem, CardHeader, Typography, CardContent } from '@mui/material';

// Row: icon + label on the left, percent on the right
function PaymentMethodRow({ icon, label, percent }) {
  return (
    <ListItem disableGutters sx={{ py: 1.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box
          sx={{
            width: 28,
            height: 20,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="body1">{label}</Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, ml: 'auto' }}>
        {percent}%
      </Typography>
    </ListItem>
  );
}

export default function PaymentMethodsCard({ title = 'Payment Methods', items = [] }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        sx={{
          pb: 0,
          '& .MuiCardHeader-title': { fontSize: 20, fontWeight: 600 },
        }}
      />
      <CardContent sx={{ pt: 1.5 }}>
        <List sx={{ px: 0 }}>
          {items.map((it) => (
            <PaymentMethodRow key={it.label} icon={it.icon} label={it.label} percent={it.percent} />
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
