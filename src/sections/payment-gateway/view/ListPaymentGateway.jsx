import { useState, useCallback, useEffect } from 'react';
import { CircularProgress, TableCell, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { archivePaymentGateway, listPaymentGateways } from 'src/api/payment-gateway';

import { PaymentGatewayTableRow } from '../PaymentGatewayTableRow';
import { PaymentGatewayToolbar } from '../PaymentGatewayToolbar';
import { PaymentGatewayTableFiltersResult } from '../PaymentGatewayTableFiltersResult';
import { PaymentGatewayModal } from '../PaymentGatewayModal';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ARCHIVE', label: 'Archive' },
  { label: 'All', value: '' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
  // { id: 'action', label: 'Action', width: 88 },
];

export function ListPaymentGateway() {
  const table = useTable();
  const queryClient = useQueryClient();
  const router = useRouter();

  const confirm = useBoolean();

  const filters = useSetState({ q: '', name: '', status: 'ACTIVE' });

  // Fetch payment gateways using React Query
  const { data: tableData = [], isLoading } = useQuery({
    queryKey: ['paymentGateways', filters.state, table.rowsPerPage, table.page],
    queryFn: () =>
      listPaymentGateways({
        currentPage: table.page + 1,
        itemsPerPage: table.rowsPerPage,
        status: filters.state.status,
        q: filters.state.q,
        order: 'desc',
        orderBy: 'createdDate',
      }).then((res) => res),
    // staleTime: 300000, // 5 minutes cache
  });

  // useEffect(() => {
  //   queryClient.invalidateQueries(['paymentGateways']);
  // }, [filters.state, queryClient]);

  const dataFiltered = applyFilter({
    inputData: tableData?.items || [],
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.state.name || filters.state.status !== '' || filters.state.q !== '';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const deleteMutation = useMutation({
    mutationFn: archivePaymentGateway,
    onSuccess: () => {
      toast.success('Payment gateway deleted successfully!');
      queryClient.invalidateQueries(['paymentGateways']); // Refetch the data
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update payment gateway');
    },
  });

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteMutation.mutateAsync({ id, body: { status: 'ARCHIVE' } });

        // confirm.onFalse(); // Close the confirmation dialog
        // console.log('modal close');
        toast.success('Delete success!');
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error) {
        toast.error('Failed to update payment gateway');
        console.error(error);
      }
    },
    [deleteMutation, dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    confirm.onFalse();
    toast.success('Delete success!');
    // setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData, confirm]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const paymentGatewayModal = useBoolean();

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Payment Gateway"
          links={[{ name: 'Dashboard' }, { name: 'Payment Gateway' }]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     onClick={paymentGatewayModal.onTrue}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     New Payment Gateway
          //   </Button>
          // }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
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
                //       ((tab.value === '' || tab.value === filters.state.status) && 'filled') ||
                //       'soft'
                //     }
                //     color={
                //       (tab.value === 'active' && 'success') ||
                //       (tab.value === 'inactive' && 'error') ||
                //       'default'
                //     }
                //   >
                //     {['active', 'inactive'].includes(tab.value)
                //       ? tableData.filter((gateway) => gateway.status.toLowerCase() === tab.value)
                //           .length
                //       : tableData.length}
                //   </Label>
                // }
              />
            ))}
          </Tabs>

          <PaymentGatewayToolbar filters={filters} onResetPage={table.onResetPage} />

          {/* {canReset && (
            <PaymentGatewayTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <Box sx={{ position: 'relative' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     dataFiltered.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {dataFiltered.map((row) => (
                        <PaymentGatewayTableRow
                          key={row.id}
                          row={row}
                          // selected={table.selected.includes(row.id)}
                          // onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                        />
                      ))}

                      <TableNoData notFound={notFound} />
                    </>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={tableData?.meta?.totalItems}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {/* PaymentGatewayModal */}
      <PaymentGatewayModal open={paymentGatewayModal.value} onClose={paymentGatewayModal.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData.filter(
  //     (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
  //   );
  // }

  if (status !== '') {
    inputData = inputData.filter((user) => user.status.toLowerCase() === status.toLowerCase());
  }

  return inputData;
}
