import React from 'react';
import { Grid } from '@mui/material';
import ApplicationQueueTable from './ApplicationQueueTable';
import RiskAssessmentOverview from './RiskAssessmentOverview';
import ProcessingTimeAnalytics from './ProcessingTimeAnalytics';

export default function OnboardingDashboard({data, isLoading, isError, filters, setFilters}) {
  return (
    <Grid container spacing={3}>
      {/* Left Column (Application Queue Table) */}
      <Grid item xs={12} md={8}>
        <ApplicationQueueTable
        data={data} 
        isLoading={isLoading} 
        isError={isError}
        filters={filters}
        setFilters={setFilters}
        />
      </Grid>

      {/* Right Column (Analytics Panel) */}
      <Grid item xs={12} md={4}>
        <Grid container spacing={3}>
          {/* Top Right Card */}
          <Grid item xs={12}>
            <RiskAssessmentOverview />
          </Grid>
          {/* Bottom Right Card */}
          <Grid item xs={12}>
            <ProcessingTimeAnalytics />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}