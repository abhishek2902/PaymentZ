import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Card, Grid, Stack, Button, Divider, Typography, CardContent } from '@mui/material';

import AdminStat from 'src/components/overview/AdminStat';
import AdminTable from 'src/components/overview/AdminTable';
import { useQuery } from '@tanstack/react-query';
import { listAdmin } from 'src/api/admins';

export default function AdminManagementOverview({ dashboardFetchDataResponse }) {

  const data = dashboardFetchDataResponse?.data;

  const stats = [
    { icon: 'mdi:account-group', color: 'primary', value: data?.totalAdmins === undefined ? "-" : `${data.totalAdmins}`, label: 'Total Admins' },
    { icon: 'mdi:account-check', color: 'success', value: data?.totalActiveAdmins === undefined ? "-" : `${data.totalActiveAdmins}`, label: 'Active Admins' },
    { icon: 'mdi:crown', color: 'secondary', value: data?.enterpriseAdmins === undefined ? "-" : `${data.enterpriseAdmins}`, label: 'Premium Plans' },
    { icon: 'mdi:currency-usd', color: 'warning', value: '$89.2K', label: 'Monthly Revenue' },
  ];

  const {
    data: adminResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'admin-list',
    ],
    queryFn: () =>
      listAdmin({
        page: 0,
        size: 3,
      }),
    keepPreviousData: true,
  });

  const rows = [
    {
      id: '1',
      name: `${adminResponse?adminResponse.data?.content[0]?.fullName: "Michael Chen"}`,
      email: `${adminResponse?adminResponse.data?.content[0]?.email: 'michael@techcorp.com'}`,
      avatar: 'https://i.pravatar.cc/100?img=32',
      plan: `${adminResponse?adminResponse.data?.content[0]?.subscriptionPlan: 'Premium'}`,
      volume: 2400000,
      commission: 0.025,
      status: `${adminResponse?adminResponse.data?.content[0]?.commonStatus: 'Unknown'}`,
    },
    {
      id: '2',
      name: `${adminResponse?adminResponse.data?.content[1]?.fullName: 'Sarah Johnson'}`,
      email: `${adminResponse?adminResponse.data?.content[1]?.email: 'sarah@ecommhub.com'}`,
      avatar: 'https://i.pravatar.cc/100?img=12',
      plan: `${adminResponse?adminResponse.data?.content[1]?.subscriptionPlan: 'Business'}`,
      volume: 1800000,
      commission: 0.022,
      status: `${adminResponse?adminResponse.data?.content[1]?.commonStatus: 'Unknown'}`,
    },
    {
      id: '3',
      name: `${adminResponse?adminResponse.data?.content[2]?.fullName: 'David Rodriguez'}`,
      email: `${adminResponse?adminResponse.data?.content[2]?.email: 'david@retailplus.com'}`,
      avatar: 'https://i.pravatar.cc/100?img=5',
      plan: `${adminResponse?adminResponse.data?.content[2]?.subscriptionPlan: 'Standard'}`,
      volume: 1200000,
      commission: 0.02,
      status: `${adminResponse?adminResponse.data?.content[2]?.commonStatus: 'Unknown'}`,
    },
  ];

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={800}>
            Admin Management Overview
          </Typography>
          {/* <Button
            variant="contained"
            startIcon={<Icon icon="mdi:plus" />}
            onClick={() => console.log('Add New Admin')}
          >
            Add New Admin
          </Button> */}
        </Stack>

        <Divider />

        {/* Stats Row */}
        <Box sx={{ p: 2.5 }}>
          <Grid container spacing={2}>
            {stats.map((s) => (
              <Grid key={s.label} item xs={12} sm={6} md={3}>
                <AdminStat {...s} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ mx: 0 }} />

        {/* Table */}
        <Box sx={{ p: 2.5, pt: 1 }}>
          <AdminTable
            rows={rows}
            onEdit={(r) => console.log('edit', r)}
            onMore={(r) => console.log('more', r)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
