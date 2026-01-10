import { Box, Button, Card, Tab, Table, TableBody, Tabs } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import React, { useCallback, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { listCustomers } from 'src/api/customer';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { applyFilter } from 'src/components/phone-input/utils';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { useSetState } from 'src/hooks/use-set-state';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';
import { useQuery } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { fCurrency } from 'src/utils/format-number';
import { useBoolean } from 'src/hooks/use-boolean';
import { CustomerTableRow } from './CustomerTableRow';
import { CustomerToolBar } from './CustomerToolBar';
import { CustomerModal } from './CustomerModal';

// this stores tabs
const TAB_OPTIONS = [
  { label: 'All', value: 'all' },
  { value: 'top_customers', label: 'Top customers' },
  //   { value: 'first_time_customers', label: 'First-time customers' },
  //   {
  //     value: 'repeat_customers',
  //     label: 'Repeat customers',
  //   },
  {
    value: 'refunds',
    label: 'Refunds',
  },
  {
    value: 'disputes',
    label: 'Disputes',
  },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Customer Name' },
  { id: 'email', label: 'Email' },
  { id: 'default_payment_method', label: 'Payment Method' },
  { id: 'total_spend', label: 'Total spend' },
  { id: 'payments', label: 'Payments' },
  // { id: 'refunds', label: 'Refunds' },
  { id: 'last_payment', label: 'Created Date' },
];

function ListCustomer() {
  const table = useTable();
  const filters = useSetState({ status: 'all' });
  const customerModal = useBoolean();

  // Fetch payment gateways using React Query
  const { data: tableData = [], isLoading } = useQuery({
    queryKey: ['customers', filters.state, table.rowsPerPage, table.page],
    queryFn: () =>
      listCustomers({
        currentPage: table.page + 1,
        itemsPerPage: table.rowsPerPage,
        status: filters.state.status,
        q: filters.state.q,
        order: 'desc',
        orderBy: 'createdDate',
      }).then((res) => res),
    staleTime: 300000, // 5 minutes cache
  });

  // apply filter
  const dataFiltered = applyFilter({
    inputData: tableData?.items || [],
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  // hanle filter status
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const canReset = filters.state.status !== '';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // export to pdf
  const exportToPDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    doc.text('Customer List', 15, 10);

    autoTable(doc, {
      head: [TABLE_HEAD.map((head) => head.label)],
      body: dataFiltered.map((row) => [
        row.name,
        row.email,
        `${row.cardType}${row.card_number}`,
        fCurrency(row.payments),
        fCurrency(row.refunds),
        row.last_payment,
      ]),
    });
    doc.save(getFormattedFileName('customer', 'pdf'));
  };

  // export to csv
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataFiltered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, getFormattedFileName('customers', 'csv'));
  };
  // pdf and csv export
  const handleExport = (format) => {
    if (format === 'pdf') {
      exportToPDF();
    } else {
      exportToCSV();
    }
  };

  const getFormattedFileName = (prefix, extension) => {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now);

    return `${prefix} ${formattedDate.replace(',', '')}.${extension}`;
  };

  return (
    <div>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Customers"
          links={[{ name: 'Dashboard' }, { name: 'Customers' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          {/* <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {TAB_OPTIONS.map((tab) => (
              <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
            ))}
          </Tabs> */}

          {/* // customer tool bar */}
          <CustomerToolBar filters={filters} onExport={handleExport} />

          {/* filter table */}
          {/* {canReset && (
            <CustomerTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

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
                  {dataFiltered.map((row) => (
                    <CustomerTableRow key={row.payment_id} row={row} />
                  ))}
                  {/* <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  /> */}
                  <TableNoData notFound={notFound} />
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
      <CustomerModal open={customerModal.value} onClose={customerModal.onFalse} />
    </div>
  );
}

export default ListCustomer;
