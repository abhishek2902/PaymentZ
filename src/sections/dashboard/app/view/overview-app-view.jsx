import React from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useSetState } from 'src/hooks/use-set-state';
import { analyticMonthly, analyticPie, dashboardFetchData } from 'src/api/dashboard';
import { useQuery } from '@tanstack/react-query';

import { _appRelated, _appInvoices } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import KpiTile from 'src/components/overview/KpiTile';

import TopCountriesCard from './TopCountriesCard';
import { AppTopRelated } from '../app-top-related';
import BankApiHealthCard from './BankApiHealthCard';
import { AppNewInvoices } from '../app-new-invoices';
import PaymentMethodsCard from './PaymentMethodsCard';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppAreaInstalled } from '../app-area-installed';
import { apiHealth, breakdown, topCountries } from './data';
import { AppCurrentDownload } from '../app-current-download';
import BlockedTransactionsCard from './BlockedTransactionsCard';
import AdminManagementOverview from './AdminManagementOverview';
import PaymentProvidersSection from './PaymentProvidersSection';
import RealtimeAndHealthSection from './RealtimeAndHealthSection';
import { Summary } from '../Summary/Summary';
import { BusinessInsights } from '../Analytic/BusinessInsights';
import { TransactionAnalytic } from '../Analytic/TransactionAnalysis';

// ----------------------------------------------------------------------

const methods = [
  { label: 'Visa', percent: 45.2, icon: <Icon icon="logos:visa" width={28} /> },
  { label: 'Mastercard', percent: 32.8, icon: <Icon icon="logos:mastercard" width={28} /> },
  {
    label: 'American Express',
    percent: 12.1,
    icon: <Icon icon="fontisto:american-express" width={28} />,
  },
  { label: 'PayPal', percent: 9.9, icon: <Icon icon="logos:paypal" width={28} /> },
];

// Simple section wrapper (title + divider + spacing)
function Section({ title, subtitle, children, mt = 3 }) {
  return (
    <Box mt={mt}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );
}

export function OverviewAppView() {

  const {
    data: dashboardFetchDataResponse,
    isLoading: isLoadingReport,
    isError: isErrorReport,
    refetch: refetchReport,
  } = useQuery({
    queryKey: ['dashboardFetchDataResponse'],
    queryFn: () =>
      dashboardFetchData(),
    keepPreviousData: true,
  });

  return (
    <DashboardContent maxWidth="xl">
      {/* SECTION: Filters */}

      {/* SECTION: KPIs */}
      <Section title="KPIs" subtitle="High-level metrics at a glance">
        <Summary dashboardFetchDataResponse={dashboardFetchDataResponse}/>
      </Section>

      {/* Realtime and Health */}
      <Section title="Realtime & Health" subtitle="Real-time transaction feed and system health">
        <RealtimeAndHealthSection />
      </Section>

      {/* Admin Management */}
      <Section title="Admin Management" subtitle="Manage your admin accounts">
        <AdminManagementOverview dashboardFetchDataResponse={dashboardFetchDataResponse}/>
      </Section>

      {/* Payment Providers */}
      <Section title="Payment Providers" subtitle="Manage your payment providers">
        <PaymentProvidersSection />
      </Section>

      {/* SECTION: Analytics */}
      <Section title="Analytics" subtitle="Trends and distribution">
        <Grid container spacing={3} direction={{ xs: 'column', md: 'row' }}>
          <Grid item xs={12} sm={6} md={5}>
            <TransactionAnalytic/>
          </Grid>
          <Grid item xs={12} sm={6} md={6.5}>
            <BusinessInsights />
          </Grid>
        </Grid>
      </Section>

      {/* SECTION: Rankings  */}
      <Section title="Rankings " subtitle="Top performers">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AppNewInvoices
              title="Top Performing Businesses"
              tableData={_appInvoices}
              headCells={[
                { id: 'id', label: 'Business ID' },
                { id: 'name', label: 'Business Name' },
                { id: 'volume', label: 'Volume' },
                { id: 'successrate', label: 'Success Rate' },
                { id: '' },
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppTopRelated title="Top Performing Gateways" list={_appRelated} />
          </Grid>
        </Grid>
      </Section>

      {/* SECTION: Risk & Geo */}
      <Section title="Risk & Geo" subtitle="Blocks, geographies, and trends">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <BlockedTransactionsCard
              total={23}
              subtitle="Blocked in last 24h"
              items={breakdown}
              icon="mdi:shield-outline"
              iconSize={22}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TopCountriesCard currency="USD" iconSet="circle-flags" items={topCountries} />
          </Grid>
        </Grid>
      </Section>

      {/* SECTION: Infrastructure Health */}
      <Section
        title="Infrastructure Health & Payment Methods"
        subtitle="API status and response quality"
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <BankApiHealthCard items={apiHealth} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <PaymentMethodsCard title="Payment Methods" items={methods} />
          </Grid>
        </Grid>
      </Section>
    </DashboardContent>
  );
}
