import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useState } from 'react';

export function ConnectorStatistics({ stats }) {

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom  mb={4}>
          Connector Statistics
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Transactions
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {stats.totalTransactions}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Success Rate
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="success.main">
              {stats.successRate}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Volume Processed
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {stats.volumeProcessed}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Avg Response Time
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {stats.avgResponseTime}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Assigned Admins
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {stats.assignedAdmins}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
