import { useCallback, useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';
import {
  Button,
  Menu,
  MenuItem,
  Select,
  MenuItem as MuiMenuItem,
  Autocomplete,
} from '@mui/material';
import dayjs from 'dayjs';
import { listMerchant } from 'src/api/merchant';
import { useSetState } from 'src/hooks/use-set-state';
import { listPaymentGateways } from 'src/api/payment-gateway';
import { useQuery } from '@tanstack/react-query';

import utc from 'dayjs/plugin/utc'; // UTC plugin
import { DateTimePicker } from '@mui/x-date-pickers';
import { Field } from 'src/components/hook-form';
import { FormProvider, useForm } from 'react-hook-form';

export function ReportingToolbar({ filters, dateError, setDateError, onResetPage, onExport }) {
  // State for column selection
  const [selectedColumn, setSelectedColumn] = useState('customer');

  const merchantFilters = useSetState({ q: '', name: '', status: '' });
  const gatewayFilters = useSetState({ q: '', name: '', status: '' });

  // Search
  const handleFilterSearch = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ q: event.target.value });
    },
    [filters, onResetPage]
  );

  // handle filter merchant
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

  // handle filter start date
  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ startDate: newValue ? dayjs(newValue).format('MM-DD-YYYY') : null });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ endDate: newValue ? dayjs(newValue).format('MM-DD-YYYY') : null });
    },
    [filters, onResetPage]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    onExport(format);
    handleMenuClose();
  };

  // handle selected column
  const handlseSelectedColumn = (event) => {
    setSelectedColumn(event.target.value);
    filters.setState({ field: event.target.value });
    filters.setState({ q: '' });
  };

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

  const methods = useForm({
    defaultValues: {
      phoneNumber: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 1.5 }}
      >
        <Autocomplete
          loading={isMerchantLoading}
          options={merchantData}
          getOptionLabel={(option) => option.businessName || ''}
          value={filters.merchant}
          onChange={(_, value) => filters.setState({ merchantId: value?.id })}
          onInputChange={(_, value) => merchantFilters.setState({ q: value })}
          renderInput={(params) => <TextField {...params} label="Select Business" />}
          sx={{ minWidth: 160 }}
        />
        <Autocomplete
          loading={isGatewayLoading}
          options={gatewayData}
          getOptionLabel={(option) => option.name || ''}
          value={filters.gateway}
          onChange={(_, value) => filters.setState({ gatewayId: value?.id })}
          onInputChange={(_, value) => gatewayFilters.setState({ q: value })}
          renderInput={(params) => <TextField {...params} label="Select Bank" />}
          sx={{ minWidth: 150 }}
        />
        <TextField
          select
          label="Select Status"
          value={filters.status}
          onChange={(e) => filters.setState({ status: e.target.value })}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="refunded">Refunded</MenuItem>
        </TextField>

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

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
        </Menu>
      </Stack>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 1.5 }}
      >
        <TextField
          select
          label="Select Card Type"
          value={filters.status}
          onChange={(e) => filters.setState({ cardType: e.target.value })}
          sx={{ minWidth: 180 }}
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
          placeholder="Search By Phone Number"
          //   label="Search By Phone Number"
          defaultCountry="US"
          sx={{ minWidth: 180 }}
        />

        <TextField label="Search By Email" sx={{ minWidth: 200 }} />
        <Button variant="contained" onClick={handleMenuOpen}>
          Generate Report
        </Button>
      </Stack>
    </FormProvider>
  );
}
