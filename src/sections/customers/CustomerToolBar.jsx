import { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Iconify } from 'src/components/iconify';
import { Button, Menu, MenuItem, Select, MenuItem as MuiMenuItem } from '@mui/material';
import { usePopover } from 'src/components/custom-popover';

export function CustomerToolBar({ filters, dateError, onResetPage, onExport }) {
  const menuActions = usePopover();

  // State for column selection
  const [selectedColumn, setSelectedColumn] = useState('name');

  const handleFilterSearch = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ [selectedColumn]: event.target.value });
    },
    [filters, onResetPage, selectedColumn]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ endDate: newValue });
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
          value={filters.state[selectedColumn] || ''}
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
          value={filters.state.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />

        <DatePicker
          label="End date"
          value={filters.state.endDate}
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

        {/* <Button variant="contained" onClick={handleMenuOpen}>
          Export
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
        </Menu> */}
      </Stack>
    </>
  );
}
