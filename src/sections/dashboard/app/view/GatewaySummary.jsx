import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AppWidgetSummary } from '../app-widget-summary';

export default function GatewaySummary({
  totalAmountProcessed = 0,
  totalDeclinedAmounts = 0,
  refundAmounts = 0,
  transactionCounts = 0,
  totalDeclinedCounts = 0,
  totalRefundCounts = 0,
}) {
  const theme = useTheme();
  return (
    <Grid container sx={{ marginY: '8px' }} spacing={1}>
      <Grid item xs={12} sm={6} md={3}>
        {/* Amount Processed */}
        <AppWidgetSummary
          title="Amount Processed"
          percent={0.2}
          currencySign="$"
          total={totalAmountProcessed}
          chart={{
            colors: [theme.palette.info.main],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [20, 41, 63, 33, 28, 35, 50, 46],
          }}
        />
      </Grid>
      {/* Declined Amounts */}
      <Grid item xs={12} sm={6} md={3}>
        <AppWidgetSummary
          title="Declined Amounts"
          percent={0.2}
          currencySign="$"
          total={totalDeclinedAmounts}
          chart={{
            colors: [theme.palette.info.main],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [20, 41, 63, 33, 28, 35, 50, 46],
          }}
        />
      </Grid>
      {/* Refund Amounts */}
      <Grid item xs={12} sm={6} md={3}>
        <AppWidgetSummary
          title="Refunded Amounts"
          percent={0.2}
          currencySign="$"
          total={refundAmounts}
          chart={{
            colors: [theme.palette.info.main],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [20, 41, 63, 33, 28, 35, 50, 46],
          }}
        />
      </Grid>
      {/* Transaction count */}
      <Grid item xs={12} sm={6} md={3}>
        <AppWidgetSummary
          title="Success Transactions"
          percent={-0.1}
          total={transactionCounts}
          chart={{
            colors: [theme.palette.error.main],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [18, 19, 31, 8, 16, 37, 12, 33],
          }}
        />
      </Grid>
      {/* Declined count */}
      <Grid item xs={12} sm={6} md={3}>
        <AppWidgetSummary
          title="Declined Transactions"
          percent={-0.1}
          total={totalDeclinedCounts}
          chart={{
            colors: [theme.palette.error.main],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [18, 19, 31, 8, 16, 37, 12, 33],
          }}
        />
      </Grid>
      {/* Refund count */}
      <Grid item xs={12} sm={6} md={3}>
        <AppWidgetSummary
          title="Refunded Transactions"
          percent={-0.1}
          total={totalRefundCounts}
          chart={{
            colors: [theme.palette.error.main],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [18, 19, 31, 8, 16, 37, 12, 33],
          }}
        />
      </Grid>
    </Grid>
  );
}
