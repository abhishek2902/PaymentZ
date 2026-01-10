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

export function TransactionToolbar({ filters, dateError, onResetPage, onExport }) {
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

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 1.5 }}
      >
        {/* <Select
          value={selectedColumn}
          onChange={(event) => handlseSelectedColumn(event)}
          sx={{ minWidth: 180 }}
        >
          <MuiMenuItem value="id">Txn ID</MuiMenuItem>
          <MuiMenuItem value="paymentId">Payment ID</MuiMenuItem>
          <MuiMenuItem value="customer">Customer</MuiMenuItem>
          <MuiMenuItem value="merchant">Merchant</MuiMenuItem>
          <MuiMenuItem value="amount">Amount</MuiMenuItem>
        </Select> */}

        <TextField
          fullWidth
          value={filters.state.q}
          onChange={handleFilterSearch}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Autocomplete
          loading={isMerchantLoading}
          options={merchantData}
          getOptionLabel={(option) => option.businessName || ''}
          value={filters.merchant}
          onChange={(_, value) => filters.setState({ merchantId: value?.id })}
          onInputChange={(_, value) => merchantFilters.setState({ q: value })}
          renderInput={(params) => <TextField {...params} label="Select Business" />}
          sx={{ minWidth: 200 }}
        />
        <Autocomplete
          loading={isGatewayLoading}
          options={gatewayData}
          getOptionLabel={(option) => option.name || ''}
          value={filters.gateway}
          onChange={(_, value) => filters.setState({ gatewayId: value?.id })}
          onInputChange={(_, value) => gatewayFilters.setState({ q: value })}
          renderInput={(params) => <TextField {...params} label="Select Gateway" />}
          sx={{ minWidth: 180 }}
        />

        <DatePicker
          label="Start date"
          value={filters.state.startDate ? dayjs(filters.state.startDate) : null}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />

        <DatePicker
          label="End date"
          value={filters.state.endDate ? dayjs(filters.state.endDate) : null}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError ? 'End date must be later than start date' : null,
            },
          }}
          sx={{
            maxWidth: { md: 180 },
            [`& .${formHelperTextClasses.root}`]: {
              bottom: { md: -40 },
              position: { md: 'absolute' },
            },
          }}
        />
        <Button variant="contained" onClick={handleMenuOpen}>
          Export
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
        </Menu>
      </Stack>
    </>
  );
}
