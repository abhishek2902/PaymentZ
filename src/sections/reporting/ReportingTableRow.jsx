import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { capitalizeWords } from 'src/utils/helper';
import { Iconify } from 'src/components/iconify';

import { fCentstoDollerCurrency, fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

export function ReportingTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const transactionModal = useBoolean();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell
          sx={{
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            '&:hover': {
              color: 'blue', // Change text color on hover
            },
          }}
          color={transactionModal.value ? 'inherit' : 'default'}
          onClick={transactionModal.onTrue}
        >
          {row.paymentId}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">{capitalizeWords(row?.paymentGatewayName)}</Typography>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">{row?.merchantDetails?.businessName}</Typography>
          {/* <Typography variant="body3" color="text.secondary">
            {row?.merchantDetails?.emailAddress}
          </Typography> */}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.paymentGatewayName?.toLowerCase() === 'monrem'
            ? fCentstoDollerCurrency(row?.amount)
            : fCurrency(row.amount)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTime(row?.createdDate)}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="View Details" placement="top" arrow>
              <IconButton>
                <Iconify icon="eva:eye-fill" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
