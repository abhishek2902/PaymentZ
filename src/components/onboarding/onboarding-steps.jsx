import React from 'react';

import { Box, Card, Stack, Divider, Typography, CardContent } from '@mui/material';

export function StepItem({ index, title, subtitle, active = false }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 160 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          mx: 'auto',
          mb: 1,
          display: 'grid',
          placeItems: 'center',
          bgcolor: active ? 'primary.main' : 'grey.300',
          color: active ? 'primary.contrastText' : 'text.secondary',
          fontWeight: 700,
        }}
      >
        {index}
      </Box>
      <Typography variant="subtitle2" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}

export default function OnboardingSteps({ steps, activeIndex = 0, title = 'Onboarding Process' }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} mb={3}>
          {title}
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={<Divider flexItem orientation="vertical" />}
          spacing={3}
          alignItems="center"
          justifyContent="space-around"
        >
          {steps.map((s, i) => (
            <StepItem
              key={s.title}
              index={i + 1}
              title={s.title}
              subtitle={s.subtitle}
              active={i === activeIndex}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
