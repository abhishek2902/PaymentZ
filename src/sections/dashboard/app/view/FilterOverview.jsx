import React from 'react';
import dayjs from 'dayjs';

import { DateTimePicker } from '@mui/x-date-pickers';
import { Box, Select, MenuItem, formHelperTextClasses } from '@mui/material';

import { fIsAfter } from 'src/utils/format-time';

import { filtersOverviewMenu } from './data';

export default function FilterOverview({ filters }) {
  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  // date range
  const handleFilterStartDate = (date) => {
    filters.setState({ startDate: date?.toISOString() });
  };

  const handleFilterEndDate = (date) => {
    filters.setState({ endDate: date?.toISOString() });
  };
  return (
    <Box
      sx={{
        display: 'flex',
        my: 2,
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'end',
        alignItems: { xs: 'left', md: 'center' },
      }}
    >
      <Select
        label="Select Date Range"
        name="Date Range"
        sx={{
          mx: { xs: 2, md: 0 },
          mr: { xs: 2, md: 0 },
          my: { xs: 2, md: 0 },
        }}
        defaultValue={filters.state.dateRange}
        onChange={(event) =>
          filters.setState({
            dateRange: event.target.value,
          })
        }
      >
        {filtersOverviewMenu.map((gateway) => (
          <MenuItem key={gateway.name} value={gateway.value}>
            {gateway.name}
          </MenuItem>
        ))}
      </Select>
      {filters.state.dateRange === 'custom_range' && (
        <Box sx={{ mx: 2 }}>
          <DateTimePicker
            label="Start date(UTC)"
            value={filters.state.startDate ? dayjs(filters.state.startDate) : null}
            onChange={handleFilterStartDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{ maxWidth: { md: 160 }, mx: { md: 2 }, my: { xs: 2, md: 0 } }}
          />

          <DateTimePicker
            label="End date(UTC)"
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
              maxWidth: { md: 160 },
              [`& .${formHelperTextClasses.root}`]: {
                bottom: { md: -40 },
                position: { md: 'absolute' },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
