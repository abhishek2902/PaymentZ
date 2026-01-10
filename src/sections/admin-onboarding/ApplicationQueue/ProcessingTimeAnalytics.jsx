// src/sections/onboarding/ProcessingTimeAnalytics.jsx
import React from "react";
import { Card, CardContent, Typography, Box, Stack, LinearProgress } from "@mui/material";
import { Icon as IconifyIcon } from "@iconify/react";

const processingSteps = [
  { name: "Document Review", time: "1.2 days", progress: 1.2 / 2.4, color: "success.main" },
  { name: "Risk Assessment", time: "0.8 days", progress: 0.8 / 2.4, color: "warning.main" },
  { name: "Final Approval", time: "0.4 days", progress: 0.4 / 2.4, color: "secondary.main" },
];

export default function ProcessingTimeAnalytics() {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, p: 2, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Processing Time Analytics
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={600}>
                Average Processing Time
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                2.4 days
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{ height: 8, borderRadius: 4, bgcolor: "grey.300", mt: 0.5 }}
            />
          </Box>
          {processingSteps.map((step, index) => (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{step.name}</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {step.time}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={step.progress * 100}
                sx={{ height: 6, borderRadius: 4, bgcolor: "grey.300", mt: 0.5 }}
                color="inherit"
                style={{ color: step.color }}
              />
            </Box>
          ))}
        </Stack>

        {/* Performance Target Box */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: "primary.lighter",
            borderColor: "primary.main",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <IconifyIcon icon="mdi:target" color="primary.main" style={{ fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600} color="primary.main">
              Performance Target
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Target: Complete processing within 3 days
          </Typography>
          <Typography variant="body2" color="success.main" fontWeight={600}>
            Current: 2.4 days (20% ahead of target)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}