import { useState, useCallback, useEffect } from 'react';
import { CircularProgress, Stack, TableCell, TableRow } from '@mui/material';
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

import { Iconify } from 'src/components/iconify';

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

import { adminsTransaction, listTransaction } from 'src/api/transaction';

import { fDateTime, fIsAfter } from 'src/utils/format-time';
import { capitalizeWords } from 'src/utils/helper';
import TransactionFilters from './TransactionFilters';
import TransactionHistory from './TransactionHistory';
import ErrorCodeAnalysis from './ErrorCodeAnalysis';
import RevenueAndTopMerchants from './RevenueAndTopMerchants';

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

export function TransactionView() {
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
      adminsTransaction({
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
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
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


















  const [filtersNew, setFiltersNew] = useState({
    dateRange: 'last24hours',
    status: 'all statuses',
    currency: 'all currencies',
    admin: 'all',
    region: 'all',
    provider: 'all',
    amountMin: '',
    amountMax: '',
    paymentMethod: 'all',
    merchant: '',
    transactionId: '',
  });

  const handleFilterChange = (newFilters) => {
    setFiltersNew((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetPage = () => {
    console.log('Resetting page or fetching new data...');
  };

  const handleExportNew = (format) => {
    console.log('Exporting data as', format);
  };

  const transactions = [
    {
      id: '#TXN-2024-001847',
      type: 'Credit Card',
      date: 'Jan 15, 2024 14:23:45 UTC',
      merchant: 'TechStore Inc.',
      merchantId: 'MERCH-001',
      amount: '$2,450.00',
      currency: 'USD',
      status: 'Successful',
      provider: 'Chase Bank',
      admin: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      region: 'North America, USA',
      icon: 'ic:baseline-credit-card',
    },
    {
      id: '#TXN-2024-001846',
      type: 'Digital Wallet',
      date: 'Jan 15, 2024 14:18:22 UTC',
      merchant: 'Fashion Hub',
      merchantId: 'MERCH-002',
      amount: '€890.50',
      currency: 'EUR',
      status: 'Successful',
      provider: 'Stripe',
      admin: {
        name: 'Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      region: 'Europe, Germany',
      icon: 'ic:baseline-shopping-bag',
    },
    {
      id: '#TXN-2024-001845',
      type: 'Bank Transfer',
      date: 'Jan 15, 2024 14:15:18 UTC',
      merchant: 'GameWorld',
      merchantId: 'MERCH-003',
      amount: '£1,250.75',
      currency: 'GBP',
      status: 'Failed',
      provider: 'Wells Fargo',
      admin: {
        name: 'Emma Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      },
      region: 'Europe, United Kingdom',
      icon: 'ic:baseline-account-balance',
    },
    {
      id: '#TXN-2024-001844',
      type: 'Debit Card',
      date: 'Jan 15, 2024 14:12:35 UTC',
      merchant: 'FoodDelight',
      merchantId: 'MERCH-004',
      amount: '$89.25',
      currency: 'USD',
      status: 'Pending',
      provider: 'PayPal',
      admin: {
        name: 'David Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
      region: 'North America, Canada',
      icon: 'ic:baseline-restaurant',
    },
    {
      id: '#TXN-2024-001843',
      type: 'Cryptocurrency',
      date: 'Jan 15, 2024 14:08:12 UTC',
      merchant: 'TechGear Pro',
      merchantId: 'MERCH-005',
      amount: '¥156,780',
      currency: 'JPY',
      status: 'Successful',
      provider: 'Bank of America',
      admin: {
        name: 'Lisa Anderson',
        avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      },
      region: 'Asia Pacific, Japan',
      icon: 'ic:baseline-computer',
    },
  ];

  const transactionMockData = [
    {
      id: 1,
      successAmount: 12500.50,
      successCount: 145,
      failedAmount: 1200.00,
      failedCount: 12,
      successRate: "92.36%",
      failedRate: "7.64%",
      merchantName: "Global Retailers", // For context
    },
    {
      id: 2,
      successAmount: 4500.00,
      successCount: 50,
      failedAmount: 4500.00,
      failedCount: 50,
      successRate: "50.00%",
      failedRate: "50.00%",
      merchantName: "Test Account A",
    },
    {
      id: 3,
      successAmount: 890.75,
      successCount: 12,
      failedAmount: 210.30,
      failedCount: 3,
      successRate: "80.00%",
      failedRate: "20.00%",
      merchantName: "Small Shop Ltd",
    },
    {
      id: 4,
      successAmount: 0.00,
      successCount: 0,
      failedAmount: 550.00,
      failedCount: 5,
      successRate: "0.00%",
      failedRate: "100.00%",
      merchantName: "New Vendor",
    },
    {
      id: 5,
      successAmount: 54200.00,
      successCount: 1200,
      failedAmount: 450.25,
      failedCount: 8,
      successRate: "99.34%",
      failedRate: "0.66%",
      merchantName: "Prime Services",
    },
    {
      id: 6,
      successAmount: 7230.40,
      successCount: 88,
      failedAmount: 1100.00,
      failedCount: 15,
      successRate: "85.44%",
      failedRate: "14.56%",
      merchantName: "Digital Goods Inc",
    },
    {
      id: 7,
      successAmount: 1560.00,
      successCount: 22,
      failedAmount: 0.00,
      failedCount: 0,
      successRate: "100.00%",
      failedRate: "0.00%",
      merchantName: "Solo Creator",
    },
    {
      id: 8,
      successAmount: 340.50,
      successCount: 4,
      failedAmount: 680.00,
      failedCount: 8,
      successRate: "33.33%",
      failedRate: "66.67%",
      merchantName: "Experimental MID",
    },
    {
      id: 9,
      successAmount: 9800.00,
      successCount: 105,
      failedAmount: 420.00,
      failedCount: 4,
      successRate: "96.33%",
      failedRate: "3.67%",
      merchantName: "Main Street Hub",
    },
    {
      id: 10,
      successAmount: 2150.25,
      successCount: 34,
      failedAmount: 150.00,
      failedCount: 2,
      successRate: "94.44%",
      failedRate: "5.56%",
      merchantName: "Metro Payments",
    }
  ];

  const errorData = [
    {
      code: 'E001',
      count: 847,
      description: 'Insufficient Funds',
      percentage: 45,
      color: 'error.main',
      icon: 'eva:close-circle-fill',
    },
    {
      code: 'E002',
      count: 523,
      description: 'Card Declined',
      percentage: 28,
      color: 'warning.main',
      icon: 'eva:alert-triangle-fill',
    },
    {
      code: 'E003',
      count: 312,
      description: 'Timeout Error',
      percentage: 17,
      color: 'warning.dark',
      icon: 'eva:clock-fill',
    },
    {
      code: 'E004',
      count: 189,
      description: 'Security Check Failed',
      percentage: 10,
      color: 'primary.main',
      icon: 'eva:shield-fill',
    },
  ];

  // Filter transactions based on filtersNew
const filteredTransactions = transactions.filter((txn) => {
  // Filter by status
  if (filtersNew.status !== 'all statuses' && txn.status.toLowerCase() !== filtersNew.status.toLowerCase()) {
    return false;
  }
  // Filter by currency
  if (filtersNew.currency !== 'all currencies' && txn.currency.toLowerCase() !== filtersNew.currency.toLowerCase()) {
    return false;
  }
  // Filter by admin
  if (filtersNew.admin !== 'all' && txn.admin.name.toLowerCase() !== filtersNew.admin.toLowerCase()) {
    return false;
  }
  // Filter by region
  if (filtersNew.region !== 'all' && !txn.region.toLowerCase().includes(filtersNew.region.toLowerCase())) {
    return false;
  }
  // Filter by provider
  if (filtersNew.provider !== 'all' && txn.provider.toLowerCase() !== filtersNew.provider.toLowerCase()) {
    return false;
  }
  // Filter by amount range
  const amountValue = parseFloat(txn.amount.replace(/[^0-9.-]+/g,""));
  if (filtersNew.amountMin && amountValue < parseFloat(filtersNew.amountMin)) {
    return false;
  }
  if (filtersNew.amountMax && amountValue > parseFloat(filtersNew.amountMax)) {
    return false;
  }
  // Filter by payment method
  if (filtersNew.paymentMethod !== 'all' && txn.type.toLowerCase() !== filtersNew.paymentMethod.toLowerCase()) {
    return false;
  }
  // Filter by merchant name
  if (filtersNew.merchant && !txn.merchant.toLowerCase().includes(filtersNew.merchant.toLowerCase())) {
    return false;
  }
  // Filter by transaction ID
  if (filtersNew.transactionId && !txn.id.toLowerCase().includes(filtersNew.transactionId.toLowerCase())) {
    return false;
  }
  return true;
});


  return (
    <>
      <DashboardContent>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: { xs: 3, md: 5 } }}>

        <CustomBreadcrumbs
          heading="Transactions"
          links={[{ name: 'Dashboard' }, { name: 'Transaction' }]}
        />

        {/* <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, sm: 0 } }}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:download-outline" width={20} height={20} />}
            onClick={handleExport}
            color="info"
          >
            Export Report
          </Button>

          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" width={20} height={20} />}
            onClick={reportModal.onTrue}
            color="success"
          >
            Create Report
          </Button>
        </Stack> */}
      </Box>

      {/* <TransactionFilters
        filters={filtersNew}
        setFilters={handleFilterChange}
        onResetPage={handleResetPage}
        onExport={handleExportNew}
        parent="TransactionView"
      /> */}

      <TransactionHistory transactions={tableData}/>

      <Box sx={{ mt: 3 }}>
        <ErrorCodeAnalysis errorData={errorData}/>
      </Box>

      <Box sx={{ mt: 3 }}>
        <RevenueAndTopMerchants/>
      </Box>

      </DashboardContent>
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
