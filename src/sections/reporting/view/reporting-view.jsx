import { Box, Card, CircularProgress, Table, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import ExportTransactions from 'src/layouts/components/export-transactions';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { useSetState } from 'src/hooks/use-set-state';
import { getComparator, TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { Scrollbar } from 'src/components/scrollbar';
import { applyFilter } from 'src/components/phone-input/utils';
import { ReportingToolbar } from '../ReportingToolbar';
import { ReportingTableRow } from '../ReportingTableRow';
import ReportingCard from '../ReportingCard';

const TABLE_HEAD = [
  { id: 'report', label: 'Report Name' },

  { id: 'Date', label: 'Date  (UTC)' },
  { id: 'requestedby', label: 'Requested By' },
  // { id: 'status', label: 'Status' },

  { id: 'action', label: 'Action' },
  // { id: 'ledger', label: 'Ledger' },
];

export function ReportingView() {
  const [dateError, setDateError] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const table = useTable();
  const filters = useSetState({
    startDate: '',
    endDate: '',
    merchantId: null,
    gatewayId: null,
    status: 'all',
    cardType: 'all',
  });

  const dataFiltered = applyFilter({
    inputData: tableData?.items || [],
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset =
    !!filters.state.payment_id ||
    filters.state.status !== 'all' ||
    filters.state.field !== '' ||
    filters.state.q !== '';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // handle sort
  const handleSort = useCallback(
    (id) => {
      const isAsc = filters.state.orderBy === id && filters.state.order === 'asc';
      const newOrder = isAsc ? 'desc' : 'asc';
      filters.setState({
        order: newOrder,
        orderBy: id,
      });
    },
    [filters]
  );
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Reporting"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Reporting' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ReportingCard />
          <ReportingToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
            // onExport={handleExport}
          />
          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={filters.state.order}
                  orderBy={filters.state.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  // onSort={table.onSort}
                  onSort={handleSort}
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
                        <ReportingTableRow key={row.payment_id} row={row} />
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
      </DashboardContent>
    </>
  );
}
