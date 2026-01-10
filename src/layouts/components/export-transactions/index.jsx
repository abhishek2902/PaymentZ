import { Autocomplete, Box, Button, Menu, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useSetState } from 'src/hooks/use-set-state';
import { jsPDF as JsPDF } from 'jspdf';
import { useQuery } from '@tanstack/react-query';
import autoTable from 'jspdf-autotable';
import { FormProvider, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { fCentstoDollerCurrency, fCurrency } from 'src/utils/format-number';
import { listTransactionReport } from 'src/api/transaction';
import { fDateTime } from 'src/utils/format-time';
import { listMerchant } from 'src/api/merchant';
import { listPaymentGateways } from 'src/api/payment-gateway';
import { capitalizeWords } from 'src/utils/helper';

import utc from 'dayjs/plugin/utc'; // UTC plugin
import { DateTimePicker } from '@mui/x-date-pickers';
import { Field } from 'src/components/hook-form';

dayjs.extend(utc); // extend dayjs with UTC plugin

export default function ExportTransactions() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateError, setDateError] = useState(false);
  const filters = useSetState({
    startDate: '',
    endDate: '',
    merchantId: null,
    gatewayId: null,
    status: 'all',
    cardType: 'all',
  });

  const methods = useForm({
    defaultValues: {
      phoneNumber: '',
    },
  });

  const merchantFilters = useSetState({ q: '', name: '', status: '' });
  const gatewayFilters = useSetState({ q: '', name: '', status: '' });

  const isExportEnabled = Boolean(
    (filters.state.startDate && filters.state.endDate) ||
      filters.state.merchantId ||
      filters.state.gatewayId ||
      filters.state.status
  );

  console.log('filters', filters.state);

  const open = Boolean(anchorEl);

  // Fetch merchants
  const { data: merchantData = [], isLoading: isMerchantLoading } = useQuery({
    queryKey: ['merchants', merchantFilters.state],
    queryFn: () =>
      listMerchant({
        currentPage: 1,
        itemsPerPage: 50,
        q: merchantFilters.state.q,
        order: 'desc',
        orderBy: 'createdDate',
      }).then((res) => res.items || []),
  });

  // Fetch payment gateways
  const { data: gatewayData = [], isLoading: isGatewayLoading } = useQuery({
    queryKey: ['paymentGateways', gatewayFilters.state],
    queryFn: () =>
      listPaymentGateways({
        currentPage: 1,
        itemsPerPage: 50,
        q: gatewayFilters.state.q,
        order: 'desc',
        orderBy: 'createdDate',
      }).then((res) => res.items || []),
  });

  // Fetch transaction report
  const {
    data,
    isLoading: isTransactionReportLoading,
    error: transactionReportsError,
  } = useQuery({
    queryKey: ['transactionReport', filters],
    queryFn: () =>
      listTransactionReport({
        startDate: filters.state.startDate,
        endDate: filters.state.endDate,
        merchantId: filters.state.merchantId,
        gatewayId: filters.state.gatewayId,
        status: filters.state.status,
      }),
    enabled: isExportEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      body:
        data &&
        data.items &&
        data?.items?.map((row) => [
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
    const csvData =
      data &&
      data.items &&
      data?.items?.map((row) => ({
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
          row?.paymentResponse?.transaction?.message ||
          'N/A',
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

  const handleExport = (format) => {
    if (format === 'pdf') {
      exportToPDF();
    } else {
      exportToCSV();
    }

    handleMenuClose();
  };

  // Date change handler
  // const handleDateChange = (key, value) => {
  //   const formatted = value ? dayjs(value).format('MM-DD-YYYY') : '';
  //   if (
  //     key === 'endDate' &&
  //     filters.startDate &&
  //     formatted &&
  //     dayjs(formatted).isBefore(filters.startDate)
  //   ) {
  //     setDateError(true);
  //   } else {
  //     setDateError(false);
  //   }
  //   filters.setState({ [key]: formatted });
  // };

  const handleDateChange = (key, value) => {
    const formattedUTC = value ? dayjs(value).utc().format() : '';
    if (
      key === 'endDate' &&
      filters.state.startDate &&
      formattedUTC &&
      dayjs(formattedUTC).isBefore(dayjs(filters.state.startDate))
    ) {
      setDateError(true);
    } else {
      setDateError(false);
    }
    filters.setState({ [key]: formattedUTC });
  };

  return (
    <FormProvider {...methods}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 2,
          }}
        >
          {/* Date Pickers */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* <DatePicker
            label="Start Date"
            value={filters.startDate ? dayjs(filters.startDate) : null}
            onChange={(value) => handleDateChange('startDate', value)}
          />
          <DatePicker
            label="End Date"
            value={filters.endDate ? dayjs(filters.endDate) : null}
            onChange={(value) => handleDateChange('endDate', value)}
            slotProps={{
              textField: {
                error: dateError,
                helperText: dateError ? 'End date must be after start date' : '',
              },
            }}
          /> */}
            <DateTimePicker
              label="Start Date & Time (UTC)"
              value={filters.startDate ? dayjs.utc(filters.startDate) : null}
              onChange={(value) => handleDateChange('startDate', value)}
            />
            <DateTimePicker
              label="End Date & Time (UTC)"
              value={filters.endDate ? dayjs.utc(filters.endDate) : null}
              onChange={(value) => handleDateChange('endDate', value)}
              slotProps={{
                textField: {
                  error: dateError,
                  helperText: dateError ? 'End date must be after start date' : '',
                },
              }}
            />
          </Box>

          {/* Dropdown Filters */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Autocomplete
              loading={isMerchantLoading}
              options={merchantData}
              getOptionLabel={(option) => option.businessName || ''}
              value={filters.merchant}
              onChange={(_, value) => filters.setState({ merchantId: value?.id })}
              onInputChange={(_, value) => merchantFilters.setState({ q: value })}
              renderInput={(params) => <TextField {...params} label="Select Merchant" />}
              sx={{ minWidth: 250 }}
            />

            <Autocomplete
              loading={isGatewayLoading}
              options={gatewayData}
              getOptionLabel={(option) => option.name || ''}
              value={filters.gateway}
              onChange={(_, value) => filters.setState({ gatewayId: value?.id })}
              onInputChange={(_, value) => gatewayFilters.setState({ q: value })}
              renderInput={(params) => <TextField {...params} label="Select Gateway" />}
              sx={{ minWidth: 250 }}
            />

            <TextField
              select
              label="Select Status"
              value={filters.status}
              onChange={(e) => filters.setState({ status: e.target.value })}
              sx={{ minWidth: 250 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </TextField>

            <TextField
              select
              label="Select Card Type"
              value={filters.status}
              onChange={(e) => filters.setState({ cardType: e.target.value })}
              sx={{ minWidth: 250 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="visa">Visa</MenuItem>
              <MenuItem value="mastercard">Mastercard</MenuItem>
              <MenuItem value="amex">Amex</MenuItem>
              <MenuItem value="diners">Diners</MenuItem>
              <MenuItem value="discover">Discover</MenuItem>
            </TextField>

            <Field.Phone
              name="phoneNumber"
              label="Search By Phone Number"
              defaultCountry="US"
              sx={{ minWidth: 250 }}
            />

            <TextField label="Search By Customer Email" sx={{ minWidth: 250 }} />
          </Box>
        </Box>

        <Box>
          <Button
            variant="contained"
            onClick={handleMenuOpen}
            disabled={isTransactionReportLoading || !data}
          >
            {isTransactionReportLoading ? 'Loading...' : 'Export Transactions'}
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
            <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
          </Menu>
        </Box>
      </Box>
    </FormProvider>
  );
}
