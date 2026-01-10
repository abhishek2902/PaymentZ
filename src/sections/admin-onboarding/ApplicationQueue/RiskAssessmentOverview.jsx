// src/sections/onboarding/RiskAssessmentOverview.jsx
import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { Icon as IconifyIcon } from "@iconify/react";

const riskBreakdown = [
  { label: "Low Risk", percentage: 67, color: "success.main" },
  { label: "Medium Risk", percentage: 28, color: "warning.main" },
  { label: "High Risk", percentage: 5, color: "error.main" },
];

export default function RiskAssessmentOverview() {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, p: 2, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Risk Assessment Overview
        </Typography>
        <Stack spacing={1}>
          {riskBreakdown.map((item, index) => (
            <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconifyIcon icon="mdi:circle" color={item.color} style={{ fontSize: 8 }} />
                <Typography variant="body2">{item.label}</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={600}>{`${item.percentage}%`}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}