import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Iconify } from 'src/components/iconify'; // Ensure you have this component for custom icons
import { fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

export const getCardIcon = (cardType) => {
  switch (cardType?.toLowerCase()) {
    case 'visa':
    case 'vi':
      return '/assets/icons/cards/visa-svgrepo-com.svg'; // Replace with actual Visa icon path
    case 'mastercard':
    case 'master':
    case 'mc':
      return '/assets/icons/cards/mastercard-svgrepo-com.svg'; // Replace with actual Mastercard icon path
    case 'american express':
    case 'amex':
    case 'ax':
      return '/assets/icons/cards/amex-svgrepo-com.svg'; // Replace with actual Amex icon path
    case 'discover':
    case 'dc':
      return '/assets/icons/cards/discover-svgrepo-com.svg'; // Replace with actual Discover icon path
    case 'maestro':
    case 'mt':
      return '/assets/icons/cards/maestro-svgrepo-com.svg';
    case 'jcb':
    case 'jc':
      return '/assets/icons/cards/jcb-svgrepo-com.svg';
    case 'diners':
    case 'di':
      return '/assets/icons/cards/diners-club-international-svgrepo-com.svg';
    default:
      return '/assets/icons/cards/default-card.png'; // Generic card icon
  }
};

export function CustomerTableRow({ row, selected }) {
  return (
    <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            {row.name}
          </Stack>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.email}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="img"
          src={getCardIcon(row.cardType)}
          alt={row.cardType}
          sx={{ width: 40, height: 40 }}
        />
        {row.card_number}
      </TableCell>

      {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{fCurrency(row.totalSpend)}</TableCell> */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fCurrency(row.payments)}</TableCell>
      {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{fCurrency(row.refunds)}</TableCell> */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTime(row?.createdDate)}</TableCell>
    </TableRow>
  );
}
