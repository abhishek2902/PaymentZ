import { Icon } from '@iconify/react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSearchParams } from 'react-router-dom'

export default function ThankYouPage() {
  // 1. Use useSearchParams to read the query parameters
  const [searchParams] = useSearchParams();
  const activeStep = searchParams.get('activeStep');

  // Determine if we should show Phase 2 content
  const isPhase2 = activeStep === '2';

  // 2. Define the content variants
  const phase1BodyContent = (
    <>
      After submitting <strong>Phase 1</strong>, our team will review your application within 24–48
      hours. If approved, you’ll receive an email with instructions for the <strong>Phase 2</strong> portal.
    </>
  );

  const phase2BodyContent = (
    <>
      After submitting <strong>Phase 2</strong>, our team will review your application within 24–48
      hours. If approved, you’ll receive an email with instructions for the <strong>portal</strong>.
    </>
  );

  const currentBodyContent = isPhase2 ? phase2BodyContent : phase1BodyContent;


  return (
    <Container maxWidth="sm" sx={{ mt: 24, mb: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Thank you for submitting your information!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your application has been received and is under review.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={(t) => ({
              p: 2,
              borderRadius: 2,
              // Using theme palette variables safely
              bgcolor: t.palette.mode === 'light' ? t.palette.info.lighter : t.palette.action.hover,
              border: `1px solid ${t.palette.info.light}`,
            })}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: 'info.main',
                bgcolor: 'common.white',
                boxShadow: 1,
                mt: '2px',
                flexShrink: 0,
              }}
            >
              <Icon icon="mdi:lightbulb-on-outline" width={16} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                What happens next?
              </Typography>
              {/* 3. Render the conditional content */}
              <Typography variant="body2" color="text.secondary">
                {currentBodyContent}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}