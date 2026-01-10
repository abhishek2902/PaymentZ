import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Select,
  Stack,
  Link,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

export default function TransactionFilters({ filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    setFilters(localFilters);
  };

  const handleClear = () => {
    const cleared = {
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
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:filter-bold" width={24} height={24} color="info.main" />
          <Typography variant="subtitle1" fontWeight="bold">
            Transaction Filters
          </Typography>
        </Stack>

        <Link
          component="button"
          underline="hover"
          onClick={handleClear}
          sx={{ fontSize: 14 }}
        >
          Reset Filters
        </Link>
      </Stack>

      {/* First Row */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={localFilters.dateRange}
              onChange={(e) => handleChange('dateRange', e.target.value)}
              label="Date Range"
            >
              <MenuItem value="last24hours">Last 24 hours</MenuItem>
              <MenuItem value="last7days">Last 7 days</MenuItem>
              <MenuItem value="last30days">Last 30 days</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={localFilters.status}
              onChange={(e) => handleChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="all statuses">All Statuses</MenuItem>
              <MenuItem value="successful">Successful</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              value={localFilters.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              label="Currency"
            >
              <MenuItem value="all currencies">All Currencies</MenuItem>
              <MenuItem value="usd">USD</MenuItem>
              <MenuItem value="eur">EUR</MenuItem>
              <MenuItem value="inr">INR</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Admin</InputLabel>
            <Select
              value={localFilters.admin}
              onChange={(e) => handleChange('admin', e.target.value)}
              label="Admin"
            >
              <MenuItem value="all">All Admins</MenuItem>
              <MenuItem value="admin1">Admin 1</MenuItem>
              <MenuItem value="admin2">Admin 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              value={localFilters.region}
              onChange={(e) => handleChange('region', e.target.value)}
              label="Region"
            >
              <MenuItem value="all">All Regions</MenuItem>
              <MenuItem value="us">US</MenuItem>
              <MenuItem value="eu">EU</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Provider</InputLabel>
            <Select
              value={localFilters.provider}
              onChange={(e) => handleChange('provider', e.target.value)}
              label="Provider"
            >
              <MenuItem value="all">All Providers</MenuItem>
              <MenuItem value="provider1">Provider 1</MenuItem>
              <MenuItem value="provider2">Provider 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Second Row */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            label="Amount Min"
            fullWidth
            value={localFilters.amountMin}
            onChange={(e) => handleChange('amountMin', e.target.value)}
            placeholder="Min"
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <TextField
            label="Amount Max"
            fullWidth
            value={localFilters.amountMax}
            onChange={(e) => handleChange('amountMax', e.target.value)}
            placeholder="Max"
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={localFilters.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              label="Payment Method"
            >
              <MenuItem value="all">All Methods</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="bank">Bank Transfer</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3} md={3}>
          <TextField
            label="Merchant"
            fullWidth
            value={localFilters.merchant}
            onChange={(e) => handleChange('merchant', e.target.value)}
            placeholder="Search merchant..."
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Transaction ID"
            fullWidth
            value={localFilters.transactionId}
            onChange={(e) => handleChange('transactionId', e.target.value)}
            placeholder="Enter transaction ID..."
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Showing results for: {localFilters.dateRange}, {localFilters.status}, {localFilters.currency}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleClear}>
            Clear All
          </Button>
          <Button variant="contained" onClick={handleApply}>
            Apply Filters
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
