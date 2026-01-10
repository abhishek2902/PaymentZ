import { useState, useCallback, useMemo } from 'react';
import { varAlpha } from 'src/theme/styles';
import { useSetState } from 'src/hooks/use-set-state';
import { useBoolean } from 'src/hooks/use-boolean';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { listAdmin } from 'src/api/admins';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';
import { UserModal } from '../UserModal';
import { AdminEditModal } from '../AdminEditModal';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 220 },
  { id: 'business', label: 'Business', width: 220 },
  // { id: 'roles', label: 'Roles', width: 150 },
  { id: 'connectors', label: 'Connectors', width: 150 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'actions', label: 'Actions', width: 88 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const userModal = useBoolean();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const editModal = useBoolean();

  // 🔍 Filters state
  const filters = useSetState({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
    role: [],
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  // 🧭 Query with API params
  const {
    data: adminResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'admin-list',
      table.page,
      table.rowsPerPage,
      currentFilters.status,
      currentFilters.search,
      currentFilters.startDate,
      currentFilters.endDate,
    ],
    queryFn: () =>
      listAdmin({
        page: table.page,
        size: table.rowsPerPage,
        ...(currentFilters.status !== 'all' && { status: currentFilters.status.toUpperCase() }),
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.startDate && { startDate: currentFilters.startDate }),
        ...(currentFilters.endDate && { endDate: currentFilters.endDate }),
      }),
    keepPreviousData: true,
  });

  // 🧩 Process API data
  const tableData = useMemo(
    () =>
      adminResponse?.data?.content?.map((admin) => ({
        id: admin.id,
        subscriptionId:admin.subscription.id,
        name: `${admin.firstName} ${admin.lastName}`,
        firstName: `${admin.firstName}`,
        lastName: `${admin.lastName}`,
        business: admin.companies?.[0]?.name || '-',
        // connectors: admin.companies?.length || 0,
        status: admin.commonStatus || 'ARCHIVED',
        email: admin.email || '-',
        phone: admin.phoneNumber || '-',
        connectors: admin.connectors || [],
        // connectors: [
        //               { id: '7', name: 'Datafast'},
        //               { id: '8', name: 'Paylink' },
        //               { id: '9', name: 'QuickPay'},
        //             ]
      })) || [],
    [adminResponse]
  );

  const totalElements = adminResponse?.data?.totalElements || 0;
  const notFound = !isLoading && tableData.length === 0;

  // ----------------------------------------------------------------------

  const handleDeleteRow = useCallback((id) => {
    toast.success(`Deleted admin ID: ${id}`);
  }, []);

  const handleDeleteRows = useCallback(() => {
    toast.success('Bulk delete success!');
  }, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const handleSearch = useCallback(
    (value) => {
      table.onResetPage();
      updateFilters({ search: value });
    },
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong>{table.selected.length}</strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  // ----------------------------------------------------------------------

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Admins"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Admins', href: paths.dashboard.users },
            { name: currentFilters.status.charAt(0).toUpperCase() + currentFilters.status.slice(1) },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* Tabs for status filter */}
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: { md: 2.5 },
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(
                  theme.vars.palette.grey['500Channel'],
                  0.08
                )}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                // icon={
                //   <Label
                //     variant={
                //       ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                //       'soft'
                //     }
                //     color={
                //       (tab.value === 'active' && 'success') ||
                //       (tab.value === 'archived' && 'error') ||
                //       'default'
                //     }
                //   >
                //     {['active', 'archived'].includes(tab.value)
                //       ? tableData.filter((user) => user.status === tab.value).length
                //       : tableData.length}
                //   </Label>
                // }
              />
            ))}
          </Tabs>

          {/* Search bar */}
          <UserTableToolbar
            filters={filters}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e.target.value);
              }
            }}
            onResetPage={table.onResetPage}
            options={{ roles: [] }}
          />

          {/* Active filters display */}
          {/* {Object.values(currentFilters).some(Boolean) && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={totalElements}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          {/* Table */}
          <Box sx={{ position: 'relative' }}>
            {isLoading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 5 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <>
                <TableSelectedAction
                  dense={table.dense}
                  numSelected={table.selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  action={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={confirmDialog.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  }
                />

                <Scrollbar>
                  <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headCells={TABLE_HEAD}
                      rowCount={tableData.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      // onSelectAllRows={(checked) =>
                      //   table.onSelectAllRows(
                      //     checked,
                      //     tableData.map((row) => row.id)
                      //   )
                      // }
                      headLabel={TABLE_HEAD}
                    />

                    <TableBody>
                      {tableData.map((row) => (
                        <UserTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          // onDeleteRow={() => handleDeleteRow(row.id)}
                          editHref={paths.dashboard.users}
                          setSelectedAdmin={setSelectedAdmin}
                          editModal={editModal}
                        />
                      ))}
                      <TableNoData notFound={notFound} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </>
            )}
          </Box>

          {/* Server-side pagination */}
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={totalElements}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <UserModal open={userModal.value} onClose={userModal.onFalse} />
      <AdminEditModal
        open={editModal.value}
        onClose={editModal.onFalse}
        currentAdmin={selectedAdmin}
      />
      {renderConfirmDialog()}
    </>
  );
}
