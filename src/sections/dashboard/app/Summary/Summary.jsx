import { useTheme } from "@emotion/react";
import { Box, Grid } from "@mui/material";
import KpiTile from "src/components/overview/KpiTile";
import { AppWidgetSummary } from "../app-widget-summary";

export function Summary({ dashboardFetchDataResponse }) {
  
  const theme = useTheme();

  const safeValue = (val, suffix = "") => {
    if (val === undefined || val === null) return "-";
    return `${val}${suffix}`;
  };

  const safeNumber = (val) => {
    if (val === undefined || val === null) return "-";
    return val;
  };

  const safePercent = (val) => {
    if (val === undefined || val === null) return "-";
    return `${val}%`;
  };

  const data = dashboardFetchDataResponse?.data;

  return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiTile
            icon="mdi:credit-card-outline"
            iconColor="primary"
            value={
              data?.totalRevenueLast24Hours === undefined
                ? "-"
                : `$${data.totalRevenueLast24Hours.toFixed(2)}`
            }
            label="Total Revenue (24h)"
            trend={safeNumber(data?.totalRevenueGrowthPercentage)}
            progress={data?.totalRevenueLast24Hours ? 68 : 0}
            progressColor="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KpiTile
            icon="mdi:transfer"
            iconColor="success"
            value={safeValue(data?.transactionsLast24Hours)}
            label="Transactions (24h)"
            trend={safeNumber(data?.transactionsGrowthPercentage)}
            progress={data?.transactionsLast24Hours ? 82 : 0}
            progressColor="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KpiTile
            icon="mdi:percent-outline"
            iconColor="secondary"
            value={safeValue(data?.successRateLast24Hours, "%")}
            label="Success Rate"
            trend={safeNumber(data?.successRateGrowthPercentage)}
            progress={data?.successRateLast24Hours ?? 0}
            progressColor="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KpiTile
            icon="mdi:shield-alert-outline"
            iconColor="#f57c00" // custom hex also works
            value="23"
            label="Fraud Alerts (24h)"
            trend={0} // hidden by corner badge below
            cornerIcon="mdi:alert-outline"
            cornerText="Alert"
            progress={22}
            progressColor="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Successful Transactions"
            total={safeNumber(data?.successfulTransactionsLast7Days)}
            percent={safeNumber(data?.successfulTransactionsGrowthPercentage)}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Failed Transactions"
            total={safeNumber(data?.failedTransactionsLast7Days)}
            percent={safeNumber(data?.failedTransactionsGrowthPercentage)}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Daily Processing Volume"
            total={safeNumber(data?.dailyTransactionVolumeLast7Days)}
            percent={safeNumber(data?.dailyTransactionGrowthPercentage)}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Average Trans. Value"
            total={
              data?.averageTransactionValueLast7Days ??
              null   // null means "no data"
            }
            percent={safeNumber(data?.averageTransactionGrowthPercentage)}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Daily Declined Volume"
            total={safeNumber(data?.dailyDeclineVolumeLast7Days)}
            percent={safeNumber(data?.dailyDeclineGrowthPercentage)}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Active Admins"
            // total={safeNumber(data?.activeAdminsLast7Days)}
            total={safeNumber(data?.totalActiveAdmins)}
            percent={safeNumber(data?.activeAdminsGrowthPercentage)}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>
      </Grid>
  );
}