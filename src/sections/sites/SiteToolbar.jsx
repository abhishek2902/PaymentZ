import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Iconify } from 'src/components/iconify';

export function SiteToolbar({ filters, dateError, onResetPage, onExport }) {
  const handleFilterSearch = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ q: event.target.value });
    },
    [filters, onResetPage]
  );

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

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 1.5 }}
      >
        <TextField
          fullWidth
          value={filters.state.q || ''}
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
      </Stack>
    </>
  );
}
