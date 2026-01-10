import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { capitalize, Typography } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { capitalizeWords } from 'src/utils/helper';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { fCentstoDollerCurrency, fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { getCardIcon } from '../customers/CustomerTableRow';

export function TransactionTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const transactionModal = useBoolean();
  const isRefundSuccess = row?.refund?.status?.toLowerCase() === 'refund-success';
  const isRefundFailed = row?.refund?.status?.toLowerCase() === 'refund-failed';

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {/* <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell> */}
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
          {row?.customer?.customerName ||
            row?.paymentResponse?.card?.holder_name ||
            (row?.paymentResponse?.customer?.givenName ||
            row?.paymentResponse?.customer?.middleName ||
            row?.paymentResponse?.customer?.surname
              ? `${row?.paymentResponse?.customer?.givenName || ''} ${row?.paymentResponse?.customer?.middleName || ''} ${row?.paymentResponse?.customer?.surname || ''}`
              : 'N/A')}
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

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.role}</TableCell> */}

        <TableCell
          color={transactionModal.value ? 'inherit' : 'default'}
          onClick={transactionModal.onTrue}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Label
              variant="soft"
              color={
                isRefundSuccess
                  ? 'warning'
                  : row.status?.toLowerCase() === 'success' ||
                      row?.paymentStatus?.toLowerCase() === 'success'
                    ? 'success'
                    : row.status?.toLowerCase() === 'failed' ||
                        row?.paymentStatus?.toLowerCase() === 'failure'
                      ? 'error'
                      : 'default'
              }
            >
              {isRefundSuccess ? 'Refunded' : row?.status || row?.paymentStatus}
            </Label>

            {isRefundFailed && (
              <Tooltip title="Refund Failed" placement="top" arrow>
                <Iconify icon="mdi:alert-circle-outline" color="red" width={20} />
              </Tooltip>
            )}
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {' '}
          <Typography
            variant="body2"
            sx={{ display: 'flex', marginRight: 2, alignItems: 'center' }}
          >
            <Box
              component="img"
              src={getCardIcon(
                row?.paymentResponse?.paymentBrand ||
                  row?.paymentResponse?.card?.type ||
                  row?.paymentResponse?.data?.card?.type
              )}
              alt={row?.paymentResponse?.paymentBrand || row?.paymentResponse?.card?.type}
              sx={{ width: 36, height: 36 }}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {' '}
              ****
              {row?.paymentResponse?.card?.last4Digits ||
                row?.paymentResponse?.card?.number ||
                row?.paymentResponse?.data?.card?.number}
            </Typography>
          </Typography>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="View Details" placement="top" arrow>
              <IconButton
                color={transactionModal.value ? 'inherit' : 'default'}
                onClick={transactionModal.onTrue}
              >
                <Iconify icon="eva:eye-fill" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <TransactionDetailsModal
        currentUser={row}
        open={transactionModal.value}
        onClose={transactionModal.onFalse}
      />
    </>
  );
}
