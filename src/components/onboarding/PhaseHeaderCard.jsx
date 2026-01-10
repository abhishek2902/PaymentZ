import React from 'react';

import { Box, Card, Stack, Divider, Typography, CardContent } from '@mui/material';

/**
 * PhaseHeaderCard
 * Screenshot-style big phase title with number badge + subtitle
 */
export default function PhaseHeaderCard({
  phase = 1,
  title = 'Basic Information',
  subtitle = 'Tell us about yourself and your business',
  sx,
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        ...sx,
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              color: 'common.white',
              fontWeight: 800,
              fontSize: 18,
              backgroundImage: (t) =>
                `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
              boxShadow: (t) => `0 6px 14px ${t.palette.primary.main}40`,
              flexShrink: 0,
            }}
          >
            {phase}
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={800} lineHeight={1.2}>
              {`Phase ${phase}: ${title}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      {/* faint divider exactly like the screenshot */}
      <Divider />
    </Card>
  );
}
