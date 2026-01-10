import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSetState } from 'src/hooks/use-set-state';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { listSite } from 'src/api/sites';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { SiteToolbar } from './SiteToolbar';
import { SiteTableRow } from './SiteTableRow';

import { SiteModal } from './SiteModal';

const TABLE_HEAD = [
  { id: 'businessName', label: 'Merchant Name' },
  // { id: 'businessName', label: 'Business Name' },
  { id: 'siteUrl', label: 'Site URL' },
  { id: 'paymentGatewayName', label: 'Payment Gateway' },
  { id: 'createdDate', label: 'Date of Created' },
  {
    id: 'actions',
    label: 'Actions',
  },
];
export default function ListSite() {
  const filters = useSetState({
    payment_id: '',
    status: '',
    created_at: '',
    q: '',
    // startDate: '',
    // endDate: '',
  });
  const table = useTable();

  // Fetch site list using React Query
  const { data: tableData = [], isLoading } = useQuery({
    queryKey: ['sites', filters.state, table.page, table.rowsPerPage],
    queryFn: () =>
      listSite({
        currentPage: table.page + 1,
        itemsPerPage: table.rowsPerPage,
        startDate: filters.state.startDate,
        endDate: filters.state.endDate,
        // name: filters.state.name,
        status: filters.state.status,
        q: filters.state.q,
        order: 'desc',
        orderBy: 'createdDate',
      }).then((res) => res),
    // staleTime: 300000, // 5 minutes cache
  });

  const dataFiltered = applyFilter({
    inputData: tableData?.items || [],
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset =
    !!filters.state.payment_id || filters.state.status !== '' || filters.state.q !== '';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const siteModal = useBoolean();
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Sites"
          links={[{ name: 'Dashboard' }, { name: 'Sites' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
          // action={
          //   <Button
          //     component={RouterLink}
          //     onClick={siteModal.onTrue}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     Add Site
          //   </Button>
          // }
        />
        <Card>
          <SiteToolbar filters={filters} onResetPage={table.onResetPage} />
          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
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
                        <SiteTableRow key={row.payment_id} row={row} />
                      ))}
                      {/* <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  /> */}
                      <TableNoData notFound={notFound} />
                    </>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        </Card>
        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={tableData?.meta?.totalItems}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </DashboardContent>
      <SiteModal open={siteModal.value} onClose={siteModal.onFalse} />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { payment_id, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (payment_id) {
    inputData = inputData.filter(
      (user) => user.payment_id.toLowerCase().indexOf(payment_id.toLowerCase()) !== -1
    );
  }

  if (status !== '') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
