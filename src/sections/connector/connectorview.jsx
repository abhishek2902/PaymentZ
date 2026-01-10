// src/sections/connector/ConnectorView.jsx

import { useEffect, useState, useCallback } from 'react';
import { useSetState } from 'src/hooks/use-set-state';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';

import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listConnector, toggleConnector } from 'src/api/connector';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import axios from 'axios';

import { confirmDialog2 } from 'src/components/custom-dialog/confirmDialog2';
import { ConnectorStats } from './ConnectorStats';
import { ConnectorTable } from './ConnectorTable';
import { ConnectorAssignments } from './ConnectorAssignments';
import { ConnectorHealth } from './ConnectorHealth';
import ConnectorQuickActions from './ConnectorQuickActions';

// ----------------------------------------------------------------------

export function ConnectorView() {
  const confirmDialog = useBoolean();

  // Query params
  const [query, setQuery] = useState({
    page: 0,
    size: 5,
    sortField: 'id',
    sortDirection: 'asc',
    status: '',
    search: '',
  });

  // Fetch connectors from API
  const {
    data: connectorData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['connectors', query],
    queryFn: () =>
      listConnector({
        page: query.page,
        size: query.size,
        sortField: query.sortField,
        sortDirection: query.sortDirection,
        ...(query.status && query.status !== 'all' && { status: query.status.toUpperCase() }),
        ...(query.search && { search: query.search }),
      }),
    keepPreviousData: true,
  });

   // 3️⃣ Response mapping
  const connectors = connectorData?.content || [];
  const totalPages = connectorData?.totalPages || 1;
  const totalElements = connectorData?.totalElements || 0;

  const {
    data: AllConnectorData,
  } = useQuery({
    queryKey: ['allConnectors'],
    queryFn: () =>
      listConnector(),
    keepPreviousData: true,
  });

   // 3️⃣ Response mapping
  const allConnectors = AllConnectorData?.content || [];

  // Pagination
  const handlePageChange = (event, value) => {
    setQuery((prev) => ({ ...prev, page: value - 1 }));
  };

  // ✅ Search handler (resets to page 1 but keeps everything else)
  const handleSearchChange = (value) => {
    setQuery((prev) => ({ ...prev, search: value, page: 0 }));
  };

  // ✅ Status filter handler (resets to page 1 but keeps search/sort)
  const handleStatusFilterChange = (value) => {
    setQuery((prev) => ({ ...prev, status: value, page: 0 }));
  };

  // ✅ Sorting handler (keeps page, search, status, etc.)
  const handleSortChange = (field, direction) => {
    setQuery((prev) => ({ ...prev, sortField: field, sortDirection: direction }));
  };

  // Mock handlers for UI interactions
  const handleEdit = (id) => toast.info(`Edit connector ID: ${id}`);

  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: ({ id, status, name }) => toggleConnector(id, status),
    onSuccess: (data,variables) => {
      // toast.success("Status updated");
      toast.success(`${variables.name} ${variables.status === "ACTIVE" ? 'activated' : 'archived'} successfully`);  
      setClosingConnectorId(variables.id);
      queryClient.invalidateQueries({ queryKey: ['connectors'] });
      setTimeout(() => {
        setClosingConnectorId(null);
      }, 1000);    },
    onError: () => {
      toast.error("Failed to update status");
      setClosingConnectorId(null);
    },
  });

  const [closingConnectorId, setClosingConnectorId] = useState(null);

  const handlePowerToggle = async (row) => {
    const newStatus = row.commonStatus === "ACTIVE" ? "ARCHIVED" : "ACTIVE";

    const confirmed = await confirmDialog2({
      title: 'Confirm Status Change',
      description: `Are you sure you want to ${
        newStatus === 'ACTIVE' ? 'activate' : 'archive'
      } this Connector?`,
      confirmText: 'Yes, Continue',
      variant: newStatus === 'ACTIVE' ? 'success' : 'danger',
    });

    if (!confirmed) return;
  
    toggleMutation.mutate({ id: row.id , status: newStatus, name: row.name});
  };

  const handleSettings = (id) => toast.info(`Settings for connector ID: ${id}`);
  const handleMoreFilters = () => toast.info('More filters clicked');
  const handleExport = () => toast.info('WIP');

  const stats = [
    {
      title: 'Total Connectors',
      value: allConnectors.length,
      icon: 'mdi:account-group-outline',
      change: '+3 this month',
      changeColor: 'success.main',
      iconBg: 'primary.lighter',
    },
    {
      title: 'Active Connectors',
      value: allConnectors.filter(item => item.commonStatus === "ACTIVE").length,
      icon: 'mdi:check-circle-outline',
      change: '91.7% uptime',
      changeColor: 'success.main',
      iconBg: 'success.lighter',
    },
    {
      title: 'Failover Events',
      value: 7,
      icon: 'mdi:alert-circle-outline',
      change: 'Last 24 hours',
      changeColor: 'warning.main',
      iconBg: 'warning.lighter',
    },
    {
      title: 'Response Time',
      value: '1.2s',
      icon: 'mdi:clock-outline',
      change: '-0.3s improved',
      changeColor: 'success.main',
      iconBg: 'purple.lighter',
    },
  ];

  const providerColors = { 'Chase Bank': 'success', Stripe: 'success' };

  const responseData = [
    { time: '00:00', 'Chase Bank': 0.8, Stripe: 0.6 },
    { time: '04:00', 'Chase Bank': 0.9, Stripe: 0.7 },
  ];

  const providersStatus = [
    { name: 'Chase Bank', status: 'active', time: '0.8s' },
    { name: 'Stripe', status: 'active', time: '0.6s' },
  ];

  const quickActions = [
    { icon: 'mdi:plus-circle-outline', title: 'Add Connector', description: 'Connect new connecter', path: '/dashboard/connector/new' },
    { icon: 'mdi:cog-outline', title: 'Manage Settings', description: 'Adjust configuration', path: '/dashboard/sites' },
  ];

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete selected items?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            toast.success('Deleted successfully');
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Connector"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Connector', href: paths.dashboard.connector },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ConnectorStats stats={stats} />

        <Box sx={{ mt: 3 }}>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 5 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <ConnectorTable
              providers={connectors}
              page={query.page + 1}
              rowsPerPage={query.size}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onSearchChange={handleSearchChange}
              onStatusFilterChange={handleStatusFilterChange}
              onEdit={handleEdit}
              onPowerToggle={handlePowerToggle}
              onSettings={handleSettings}
              onMoreFilters={handleMoreFilters}
              onExport={handleExport}
              currentStatus={query.status}
              currentSearch={query.search}
              closingConnectorId={closingConnectorId}
            />
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <ConnectorAssignments allConnectors={allConnectors} />
        </Box>

        <Box sx={{ mt: 3 }}>
          <ConnectorHealth responseData={responseData} providersStatus={providersStatus} />
        </Box>

        <Box sx={{ mt: 3 }}>
          <ConnectorQuickActions actions={quickActions} />
        </Box>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}
