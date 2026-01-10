import { useState, useCallback, useEffect } from 'react';
import { CircularProgress, TableCell, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import { jsPDF as JsPDF } from 'jspdf';
import { useQuery } from '@tanstack/react-query';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { fCentstoDollerCurrency, fCurrency } from 'src/utils/format-number';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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

import { listTransaction } from 'src/api/transaction';

import { fDateTime, fIsAfter } from 'src/utils/format-time';
import { capitalizeWords } from 'src/utils/helper';
import { TransactionTableRow } from './TransactionTableRow';
import { TransactionToolbar } from './TransactionToolbar';
import { TransactionTableFiltersResult } from './TransactionTableFiltersResult';
import { ReportTransactionModal } from './ReportTransactionModal';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
  { value: 'refunded', label: 'Refunded' },
];

const TABLE_HEAD = [
  { id: 'paymentId', label: 'Payment ID' },
  { id: 'paymentGatewayName', label: 'Gateway' },
  { id: 'customer', label: 'Customer' },
  { id: 'business', label: 'Business' },
  { id: 'amount', label: 'Amount' },
  { id: 'createdDate', label: 'Date  (UTC)' },
  { id: 'status', label: 'Status' },
  {
    id: 'cardDetails',
    label: (
      <>
        <Box
          component="img"
          src="/assets/icons/cards/credit-card.png"
          alt="Card icon"
          sx={{ width: 22, height: 22, marginRight: 1 }}
        />
        Details
      </>
    ),
  },
  { id: 'action', label: 'Action' },
  // { id: 'ledger', label: 'Ledger' },
];

export function ListTransaction() {
  const table = useTable();

  const router = useRouter();

  const reportModal = useBoolean();

  const filters = useSetState({
    payment_id: '',
    status: 'all',
    created_at: '',
    field: '',
    q: '',
    order: 'desc',
    orderBy: 'createdDate',
    merchantId: null,
    gatewayId: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  // Fetch payment gateways using React Query
  const { data: tableData = [], isLoading } = useQuery({
    queryKey: ['transaction', filters.state, table.rowsPerPage, table.page],
    queryFn: () =>
      listTransaction({
        currentPage: table.page + 1,
        itemsPerPage: table.rowsPerPage,
        field: filters.state.field,
        startDate: filters.state.startDate,
        endDate: filters.state.endDate,
        status: filters.state.status,
        q: filters.state.q,
        order: filters.state.order,
        orderBy: filters.state.orderBy,
        merchantId: filters.state.merchantId,
        gatewayId: filters.state.gatewayId,
      }).then((res) => res),
    // staleTime: 300000, // 5 minutes cache
  });

  const dataFiltered = applyFilter({
    inputData: tableData?.items || [],
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  // const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.payment_id ||
    filters.state.status !== 'all' ||
    filters.state.field !== '' ||
    filters.state.q !== '';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  // export
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

  // export to pdf
  const exportToPDF = () => {
    const doc = new JsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

    // Set Title
    doc.setFontSize(16);
    doc.text('Transaction List', 14, 15);

    // Define Table Headers & Styles
    autoTable(doc, {
      startY: 25, // Position table below the title
      headStyles: {
        fillColor: [41, 128, 185], // Blue header
        textColor: [255, 255, 255], // White text
        fontSize: 10,
      },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray alternate row background
      margin: { top: 20 },
      columnStyles: {
        0: { cellWidth: 20 }, // ID column
        1: { cellWidth: 20 }, // Payment ID
        2: { cellWidth: 20 }, // Customer Name
        3: { cellWidth: 20 }, // Merchant
        4: { cellWidth: 20 }, // Amount
        5: { cellWidth: 20 }, // Date
        6: { cellWidth: 20 }, // Status
        7: { cellWidth: 20 }, // Message
        8: { cellWidth: 20 }, // Card Number
      },
      head: [
        [
          'Payment ID',
          'Payment Gateway',
          'Customer',
          'Merchant',
          'Amount',
          'Date',
          'Status',
          'Message',
          'Card Number',
        ],
      ],
      body: dataFiltered.map((row) => [
        row?.paymentId,
        row?.paymentGatewayName,
        row?.customer?.customerName ||
          row?.paymentResponse?.card?.holder_name ||
          (row?.paymentResponse?.customer?.givenName ||
          row?.paymentResponse?.customer?.middleName ||
          row?.paymentResponse?.customer?.surname
            ? `${row?.paymentResponse?.customer?.givenName || ''} ${row?.paymentResponse?.customer?.middleName || ''} ${row?.paymentResponse?.customer?.surname || ''}`
            : 'N/A'),
        `${row?.merchantDetails?.businessName}`,
        row?.paymentGatewayName?.toLowerCase() === 'monrem'
          ? fCentstoDollerCurrency(row?.amount)
          : fCurrency(row.amount),
        fDateTime(row?.createdDate),
        row?.refund?.status?.toLowerCase() === 'refund-success'
          ? 'Refunded'
          : capitalizeWords(row?.status || row?.paymentStatus),
        row?.paymentResponse?.resultDetails?.ExtendedDescription ||
          row?.paymentResponse?.data?.transaction?.message ||
          row?.paymentResponse?.transaction?.message ||
          'N/A',
        row?.paymentResponse?.card?.last4Digits ||
          row?.paymentResponse?.card?.number ||
          row?.paymentResponse?.data?.card?.number ||
          'N/A',
      ]),
    });

    doc.save(getFormattedFileName('transaction', 'pdf'));
  };

  // export to csv
  const exportToCSV = () => {
    const csvData = dataFiltered.map((row) => ({
      'Payment ID': row?.paymentId,
      'Payment Gateway': row?.paymentGatewayName,
      Customer:
        row?.customer?.customerName ||
        row?.paymentResponse?.card?.holder_name ||
        (row?.paymentResponse?.customer?.givenName ||
        row?.paymentResponse?.customer?.middleName ||
        row?.paymentResponse?.customer?.surname
          ? `${row?.paymentResponse?.customer?.givenName || ''} ${row?.paymentResponse?.customer?.middleName || ''} ${row?.paymentResponse?.customer?.surname || ''}`
          : 'N/A'),
      Merchant: `${row?.merchantDetails?.businessName}`,
      Amount:
        row?.paymentGatewayName?.toLowerCase() === 'monrem'
          ? fCentstoDollerCurrency(row?.amount)
          : fCurrency(row.amount),
      Date: fDateTime(row?.createdDate),
      Status:
        row?.refund?.status?.toLowerCase() === 'refund-success'
          ? 'Refunded'
          : capitalizeWords(row?.status || row?.paymentStatus),
      Message:
        row?.paymentResponse?.resultDetails?.ExtendedDescription ||
        row?.paymentResponse?.data?.transaction?.message ||
        row?.paymentResponse?.transaction?.message,
      'Card Number':
        row?.paymentResponse?.card?.last4Digits ||
        row?.paymentResponse?.card?.number ||
        row?.paymentResponse?.data?.card?.number ||
        'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, getFormattedFileName('transaction', 'csv'));
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Transactions"
          links={[{ name: 'Dashboard' }, { name: 'Transaction' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
            <Button onClick={reportModal.onTrue} variant="contained" sx={{ mr: 1 }}>
              Report
            </Button>
          }
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
                //       (tab.value === 'SUCCESS' && 'success') ||
                //       (tab.value === 'FAILED' && 'error') ||
                //       'default'
                //     }
                //   >
                //     {['SUCCESS', 'FAILED'].includes(tab.value)
                //       ? dataFiltered?.filter((transaction) => transaction.status === tab.value)
                //           .length
                //       : dataFiltered?.length}
                //   </Label>
                // }
              />
            ))}
          </Tabs>

          <TransactionToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
            onExport={handleExport}
          />

          {canReset && (
            <TransactionTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

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
                        <TransactionTableRow key={row.payment_id} row={row} />
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

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={tableData?.meta?.totalItems}
            rowsPerPage={table.rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 500]}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
      <ReportTransactionModal open={reportModal.value} onClose={reportModal.onFalse} />
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

  return inputData;
}
